<?php

namespace App\Utility;

use App\Mail\InvoiceEmailManager;
use App\Models\User;
use App\Models\SmsTemplate;
use App\Http\Controllers\OTPVerificationController;
use App\Models\EmailTemplate;
use Mail;
use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderNotification;
use App\Models\FirebaseNotification;

class NotificationUtility
{
    public static function sendOrderPlacedNotification($order, $request = null)
    {
        //sends email to Customer, Seller and Admin with the invoice pdf attached
        $adminId = get_admin()->id;
        $userIds = array($order->seller_id);
        if($order->user->email != null){
            array_push($userIds, $order->user_id);
        }
        if ($order->seller_id != $adminId) {
            array_push($userIds, $adminId);
        }
        $users = User::findMany($userIds);
        foreach($users as $user){
            $emailIdentifier = 'order_placed_email_to_'.$user->user_type;
            $emailTemplate = EmailTemplate::whereIdentifier($emailIdentifier)->first();

            if($emailTemplate != null && $emailTemplate->status == 1){
                $emailSubject = $emailTemplate->subject;
                $emailSubject = str_replace('[[order_code]]', $order->code, $emailSubject);

                $array['view']      = 'emails.invoice';
                $array['subject']   = $emailSubject;
                $array['order']     = $order;
                if($emailTemplate->status == 1){
                    try {
                        Mail::to($user->email)->queue(new InvoiceEmailManager($array));
                    } catch (\Exception $e) {}
                }
            }
        }

        if (addon_is_activated('otp_system') && SmsTemplate::where('identifier', 'order_placement')->first()->status == 1) {
            try {
                $otpController = new OTPVerificationController;
                $otpController->send_order_code($order);
            } catch (\Exception $e) {

            }
        }

        //sends Notifications to user
        self::sendNotification($order, 'placed');
        if ($request !=null && get_setting('google_firebase') == 1 && $order->user->device_token != null) {
            $request->device_token = $order->user->device_token;
            $request->title = "Order placed !";
            $request->text = "An order {$order->code} has been placed";

            $request->type = "order";
            $request->id = $order->id;
            $request->user_id = $order->user->id;

            self::sendFirebaseNotification($request);
        }
    }

    public static function sendNotification($order, $order_status)
    {
        $adminId = get_admin()->id;
        $userIds = array($order->user->id, $order->seller_id);
        if ($order->seller_id != $adminId) {
            array_push($userIds, $adminId);
        }
        $users = User::findMany($userIds);

        $order_notification = array();
        $order_notification['order_id'] = $order->id;
        $order_notification['order_code'] = $order->code;
        $order_notification['user_id'] = $order->user_id;
        $order_notification['seller_id'] = $order->seller_id;
        $order_notification['status'] = $order_status;

        foreach($users as $user){
            $notificationType = get_notification_type('order_'.$order_status.'_'.$user->user_type, 'type');
            if($notificationType != null && $notificationType->status == 1){
                $order_notification['notification_type_id'] = $notificationType->id;
                Notification::send($user, new OrderNotification($order_notification));
            }
        }
    }
    public static function sendFirebaseNotification($req)
    {
        $url = 'https://fcm.googleapis.com/fcm/send';

        // Ensure that inputs are sanitized properly to prevent potential injection
        $deviceToken = htmlspecialchars($req->device_token, ENT_QUOTES, 'UTF-8');
        $notificationText = htmlspecialchars($req->text, ENT_QUOTES, 'UTF-8');
        $notificationTitle = htmlspecialchars($req->title, ENT_QUOTES, 'UTF-8');
        $itemType = htmlspecialchars($req->type, ENT_QUOTES, 'UTF-8');
        $itemTypeId = (int)$req->id; // Ensure the ID is an integer
        $userId = (int)$req->user_id; // Ensure the user ID is an integer

        $fields = array(
            'to' => $deviceToken,
            'notification' => [
                'body' => $notificationText,
                'title' => $notificationTitle,
                'sound' => 'default' /*Default sound*/
            ],
            'data' => [
                'item_type' => $itemType,
                'item_type_id' => $itemTypeId,
                'click_action' => 'FLUTTER_NOTIFICATION_CLICK'
            ]
        );

        $headers = array(
            'Authorization: key=' . env('FCM_SERVER_KEY'),
            'Content-Type: application/json'
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Enable SSL verification for secure communication
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

        $result = curl_exec($ch);

        // Error handling: Check if cURL request was successful
        if (curl_errno($ch)) {
            \Log::error('cURL Error: ' . curl_error($ch)); // Log the error for debugging
            curl_close($ch);
            return false; // Return false or handle as needed
        }

        curl_close($ch);

        // Log the successful notification (you can enhance this based on requirements)
        $firebase_notification = new FirebaseNotification;
        $firebase_notification->title = $notificationTitle;
        $firebase_notification->text = $notificationText;
        $firebase_notification->item_type = $itemType;
        $firebase_notification->item_type_id = $itemTypeId;
        $firebase_notification->receiver_id = $userId;
        $firebase_notification->save();

        return true; // Indicate successful notification
    }

}
