<?php

namespace App\Http\Controllers;
use App\Notifications\CommonNotification;
use App\Mail\NotificationEmailManager;
use App\Notifications\FriendRequestNotification;
use Hootlex\Friendships\Traits\Friendable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class FriendController extends Controller
{

    public function sendFriendRequest(Request $request)
    {

        $user = Auth::user();
        $recipient = User::find($request->id);
        //sends email to User
        // if (env('MAIL_USERNAME') != null && isNotify($recipient)) {
        //     $array['view'] = 'emails.notification';
        //     $array['subject'] = "You have a new friend request!";
        //     $array['from'] = env('MAIL_FROM_ADDRESS');
        //     $array['type']= 'friend_request';
        //     $array['user_name']=$user->name;

        //     try {
        //         Mail::to($recipient->email)->queue(new NotificationEmailManager($array));

        //     } catch (\Exception $e) {
        //     }
        // }
        $recipient->notify(new CommonNotification([
            'user_id' => auth()->id(),
            'message' => auth()->user()->name . ' sent you a friend request.',
            'type' => 'friend_request',
        ]));

        $user->befriend($recipient);
        return response()->json('success');
    }
    public function removeFriend(Request $request)
    {
        $user = Auth::user();
        $friend = User::find($request->id);
        $user->unfriend($friend);
        return response()->json('success');
    }
    public function blockFriend($id)
    {
        $user = Auth::user();
        $friend = User::find($id);
        $user->blockFriend($friend);
        return back();
    }
    public function addTop10Friend(Request $request)
    {
        $user = Auth::user();
        $user->top_10_friends = json_encode($request->top_10_friends);
        if ($user->update()) {
            flash('Friend has been added in to 10')->success();
        }
        return back();
    }
}
