<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Notifications\CommonNotification;
use App\Models\Conversation;
use App\Mail\NotificationEmailManager;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{
    /**
     * List messages between authenticated user and another user
     */
    public function index(Request $request, $user_name)
    {
        $authUser = $request->user();

        $user = User::where('user_name', $user_name)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Mark unread messages as viewed
        Conversation::where('sender_id', $user->id)
            ->where('receiver_id', $authUser->id)
            ->where('receiver_viewed', 0)
            ->update(['receiver_viewed' => 1]);

        $conversations = Conversation::where(function ($query) use ($authUser, $user) {
            $query->where('sender_id', $authUser->id)
                ->where('receiver_id', $user->id)
                ->orWhere('sender_id', $user->id)
                ->where('receiver_id', $authUser->id);
        })->with('messages')->orderBy('id', 'ASC')->get();

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'conversations' => $conversations
        ]);
    }

    /**
     * List all conversations of authenticated user
     */
    public function allConversations(Request $request)
    {
        $authUser = $request->user();

        $conversations = Conversation::where('sender_id', $authUser->id)
            ->orWhere('receiver_id', $authUser->id)
            ->with('messages')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'conversations' => $conversations
        ]);
    }

    /**
     * Send a message to another user
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $sender = $request->user();
        $receiver = User::find($request->user_id);

        $conversation = Conversation::firstOrCreate([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id
        ]);

        $message = new Message();
        $message->conversation_id = $conversation->id;
        $message->user_id = $sender->id;
        $message->message = $request->message;
        $message->save();

        // Send notifications
        if ($sender->id != $receiver->id) {
            if (env('MAIL_USERNAME') != null) {
                $array = [
                    'view' => 'emails.notification',
                    'from' => env('MAIL_FROM_ADDRESS'),
                    'type' => 'message',
                    'user_name' => $sender->name,
                    'subject' => "You received a new message from " . $sender->name
                ];

                try {
                    Mail::to($receiver->email)->queue(new NotificationEmailManager($array));
                } catch (\Exception $e) {}
            }

            $receiver->notify(new CommonNotification([
                'user_id' => $sender->id,
                'message' => $sender->name . ' sent you a message.',
                'type' => 'direct_message',
            ]));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    /**
     * Get contacts of authenticated user
     */
    public function getContacts(Request $request)
    {
        $authUser = $request->user();

        $users = Message::join('users', 'messages.user_id', '=', 'users.id')
            ->where('messages.user_id', $authUser->id)
            ->orWhere('messages.to_user_id', $authUser->id)
            ->select('users.id', 'users.name', 'users.user_name', 'users.avatar')
            ->distinct()
            ->get();

        return response()->json([
            'status' => 'success',
            'contacts' => $users
        ]);
    }

    /**
     * Delete a message
     */
    public function deleteMessage(Request $request, $messageId)
    {
        $authUser = $request->user();
        $message = Message::where('id', $messageId)
            ->where('user_id', $authUser->id)
            ->first();

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'message' => 'Message not found or unauthorized'
            ], 404);
        }

        $message->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Message deleted successfully'
        ]);
    }

    /**
     * Delete a conversation
     */
    public function deleteConversation(Request $request, $conversationId)
    {
        $authUser = $request->user();
        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($q) use ($authUser) {
                $q->where('sender_id', $authUser->id)
                  ->orWhere('receiver_id', $authUser->id);
            })->first();

        if (!$conversation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Conversation not found or unauthorized'
            ], 404);
        }

        $conversation->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Conversation deleted successfully'
        ]);
    }

    /**
     * Mark all messages in a conversation as read
     */
    public function markAsRead(Request $request, $conversationId)
    {
        $authUser = $request->user();

        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($q) use ($authUser) {
                $q->where('sender_id', $authUser->id)
                  ->orWhere('receiver_id', $authUser->id);
            })->first();

        if (!$conversation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Conversation not found or unauthorized'
            ], 404);
        }

        Message::where('conversation_id', $conversation->id)
            ->where('user_id', '!=', $authUser->id)
            ->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Messages marked as read'
        ]);
    }
}
