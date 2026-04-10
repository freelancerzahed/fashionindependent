<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Notifications\CommonNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    // Send Friend Request
    public function sendFriendRequest(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $recipient = User::find($request->id);

        if ($user->id == $recipient->id) {
            return response()->json(['message' => 'Cannot send request to yourself'], 400);
        }

        if ($user->hasSentFriendRequestTo($recipient) || $user->isFriendWith($recipient)) {
            return response()->json(['message' => 'Friend request already sent or already friends'], 400);
        }

        $user->befriend($recipient);

        // Notify recipient
        $recipient->notify(new CommonNotification([
            'user_id' => $user->id,
            'message' => $user->name . ' sent you a friend request.',
            'type' => 'friend_request',
        ]));

        return response()->json([
            'message' => 'Friend request sent successfully',
            'recipient' => $recipient
        ]);
    }

    // List Friend Requests
    public function friendRequests()
    {
        $user = Auth::user();

        $receivedRequests = $user->getFriendRequests();  // Incoming requests
        $sentRequests = $user->getPendingFriendships(); // Outgoing requests

        return response()->json([
            'received_requests' => $receivedRequests,
            'sent_requests' => $sentRequests,
        ]);
    }

    // Accept Friend Request
    public function acceptFriendRequest($id)
    {
        $user = Auth::user();
        $requester = User::findOrFail($id);

        if ($user->hasFriendRequestFrom($requester)) {
            $user->acceptFriendRequest($requester);

            return response()->json([
                'message' => 'Friend request accepted',
                'friend' => $requester
            ]);
        }

        return response()->json(['message' => 'No friend request from this user'], 400);
    }
// Get All Accepted Friends
public function acceptedFriends()
{
    $user = Auth::user();

    // Get accepted friendships (these are Friendship models)
    $acceptedFriendships = $user->getAcceptedFriendships();

    // Map to actual User models
    $friends = $acceptedFriendships->map(function ($friendship) use ($user) {
        // Determine the friend (sender or recipient)
        return $friendship->sender_id === $user->id
            ? $friendship->recipient
            : $friendship->sender;
    });

    return response()->json([
        'friends_count' => $friends->count(),
        'friends' => $friends,
    ]);
}
// Get all accepted friends
public function allFriends()
{
   $user = Auth::user();

    // Fetch all friendships
    $pendingFriendships  = $user->getPendingFriendships();  // Pending requests (you sent or received)
    $acceptedFriendships = $user->getAcceptedFriendships(); // Accepted friends
    $deniedFriendships   = $user->getDeniedFriendships();   // Denied
    $blockedFriendships  = $user->getBlockedFriendships();  // Blocked

    // Helper to map friendships to actual user models
    $mapFriend = function ($friendship) use ($user) {
        return [
            'friendship_id' => $friendship->id,
            'friend' => $friendship->sender_id === $user->id
                ? $friendship->recipient
                : $friendship->sender,
            'status' => $friendship->status,
        ];
    };

    return response()->json([
        'pending'  => $pendingFriendships->map($mapFriend),
        'accepted' => $acceptedFriendships->map($mapFriend),
        'denied'   => $deniedFriendships->map($mapFriend),
        'blocked'  => $blockedFriendships->map($mapFriend),
    ]);
}

    // Decline Friend Request
    public function declineFriendRequest($id)
    {
        $user = Auth::user();
        $requester = User::findOrFail($id);

        if ($user->hasFriendRequestFrom($requester)) {
            $user->denyFriendRequest($requester);

            return response()->json([
                'message' => 'Friend request declined',
                'friend' => $requester
            ]);
        }

        return response()->json(['message' => 'No friend request from this user'], 400);
    }

    // Remove Friend
    public function removeFriend(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $friend = User::find($request->id);

        if (!$user->isFriendWith($friend)) {
            return response()->json(['message' => 'Not friends'], 400);
        }

        $user->unfriend($friend);

        return response()->json([
            'message' => 'Friend removed successfully',
            'friend' => $friend
        ]);
    }
public function suggestions()
{
    $user = auth()->user();

    // ✅ Collect IDs to exclude
    $friends = $user->getFriends()->pluck('id')->toArray();
    $pending = $user->getFriendRequests()->pluck('id')->toArray();
    $requested = $user->getPendingFriendships()->pluck('id')->toArray();

    $excludeIds = array_merge([$user->id], $friends, $pending, $requested);

    // ✅ Step 1: Friends of friends using the correct relation ->friends()
    $friendsOfFriends = User::whereHas('friends', function ($q) use ($friends) {
        $q->where(function ($q2) use ($friends) {
            $q2->whereIn('sender_id', $friends)
               ->orWhereIn('recipient_id', $friends);
        })->where('status', \App\Utility\Status::ACCEPTED);
    })
        ->whereNotIn('id', $excludeIds)
        ->distinct()
        ->take(10)
        ->get();

    // ✅ Step 2: Fallback to random users
    if ($friendsOfFriends->count() === 0) {
        $friendsOfFriends = User::whereNotIn('id', $excludeIds)
            ->inRandomOrder()
            ->take(10)
            ->get();
    }

    // ✅ Step 3: Return response
    return response()->json([
        'status' => true,
        'count' => $friendsOfFriends->count(),
        'suggestions' => $friendsOfFriends->map(function ($f) {
            return [
                'id' => $f->id,
                'name' => $f->name,
                'user_name' => $f->user_name,
                'avatar' => $f->avatar ? uploaded_asset($f->avatar) : asset('public/uploads/avatar.png'),
            ];
        }),
    ]);
}



    // Block Friend
    public function blockFriend($id)
    {
        $user = Auth::user();
        $friend = User::findOrFail($id);

        $user->blockFriend($friend);

        return response()->json([
            'message' => 'Friend blocked successfully',
            'friend' => $friend
        ]);
    }
}
