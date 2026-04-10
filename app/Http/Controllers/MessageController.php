<?php

namespace App\Http\Controllers;
use App\Notifications\CommonNotification;
use App\Models\Conversation;
use App\Mail\NotificationEmailManager;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Notifications\MessageNotification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($user_name)
{
    $authUserId = Auth::user()->id;

    $users_by_conversation = Conversation::join('users', function ($join) use ($authUserId) {
        $join->on('conversations.sender_id', '=', 'users.id')
            ->orOn('conversations.receiver_id', '=', 'users.id');
    })
        ->where(function ($q) use ($authUserId) {
            $q->where('conversations.sender_id', $authUserId)
                ->orWhere('conversations.receiver_id', $authUserId);
        })
        ->orderByDesc('conversations.created_at')
        ->get()
        ->unique('id');

    $user = User::where('user_name', $user_name)->first();

    $conversations = Conversation::where('sender_id', $user->id)
        ->where('receiver_id', $authUserId)
        ->where('receiver_viewed', 0)
        ->get();

    $conversations->each(function ($conversation) {
        $conversation->update(['receiver_viewed' => 1]);
    });

    $conversations = Conversation::where(function ($query) use ($authUserId, $user) {
            $query->where('sender_id', $authUserId)
                ->where('receiver_id', $user->id)
                ->orWhere('sender_id', $user->id)
                ->where('receiver_id', $authUserId);
        })
        ->orderBy('id', 'ASC')
        ->get();

    return view('frontend.social.messanger', compact('user', 'users_by_conversation', 'conversations'));
}

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
 * Store a newly created resource in storage.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\Response
 */
public function store(Request $request)
{
    $sender = Auth::user();
    $receiver = User::find($request->user_id);

    if (!$receiver) {
        flash(translate('Receiver not found!'))->error();
        return back();
    }

    $conversation = new Conversation();
    $conversation->sender_id = $sender->id;
    $conversation->receiver_id = $request->user_id;

    // Save conversation and message regardless of notifications
    if ($conversation->save()) {
        $message = new Message;
        $message->conversation_id = $conversation->id;
        $message->user_id = $sender->id;
        $message->message = $request->message;
        $message->save();

        // Send notifications to receiver only if they are not the sender
        if ($sender->id != $receiver->id) {
            // Send email notification to receiver
            if (env('MAIL_USERNAME') != null && isNotify($receiver)) {
                $array['view'] = 'emails.notification';
                $array['from'] = env('MAIL_FROM_ADDRESS');
                $array['type'] = "message";
                $array['user_name'] = $sender->name;

                // Check if receiver is a top friend
                if (isTopFriend($receiver)) {
                    $array['subject'] = "You received a new message from your top friend!";
                } else {
                    $array['subject'] = "You received a new message!";
                }

                try {
                    Mail::to($receiver->email)->queue(new NotificationEmailManager($array));
                } catch (\Exception $e) {
                    // Log error if needed
                }
            }

            // Send database notification to receiver
            $receiver->notify(new CommonNotification([
                'user_id' => $sender->id,
                'message' => $sender->name . ' sent you a message.',
                'type' => 'direct_message',
            ]));
        }
    }

    flash(translate('Message has been sent to your friend'))->success();
    return back();
}
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getContacts(Request $request)
    {
        // get all users that received/sent message from/to [Auth user]
        $users = Message::join('users',  function ($join) {
            $join->on('ch_messages.from_id', '=', 'users.id')
                ->orOn('ch_messages.to_id', '=', 'users.id');
        })
            ->where(function ($q) {
                $q->where('ch_messages.from_id', Auth::user()->id)
                    ->orWhere('ch_messages.to_id', Auth::user()->id);
            })
            ->orderBy('ch_messages.created_at', 'desc')
            ->get()
            ->unique('id');

        $contacts = '<p class="message-hint center-el"><span>Your contact list is empty</span></p>';
        $users = $users->where('id', '!=', Auth::user()->id);
        if ($users->count() > 0) {
            // fetch contacts
            $contacts = '';
            foreach ($users as $user) {
                if ($user->id != Auth::user()->id) {
                    // Get user data
                    $userCollection = User::where('id', $user->id)->first();
                    $contacts .= Chatify::getContactItem($request['messenger_id'], $userCollection);
                }
            }
        }

        // send the response
        return Response::json([
            'contacts' => $contacts,
        ], 200);
    }
}
