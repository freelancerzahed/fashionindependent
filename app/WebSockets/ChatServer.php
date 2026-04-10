<?php

namespace App\WebSockets;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\CommonNotification;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class ChatServer implements MessageComponentInterface
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        echo "ChatServer started!\n";
    }

    /**
     * When a client connects
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $query = $conn->httpRequest->getUri()->getQuery();
        parse_str($query, $params);

        $userId = $params['user_id'] ?? null;

        if (!$userId) {
            echo "No user_id provided.\n";
            $conn->close();
            return;
        }

        $user = User::find($userId);
        if ($user) {
            $user->chat_connection_id = $conn->resourceId;
            $user->is_online = true;
            $user->save();
        }

        $this->clients->attach($conn);
        echo "User {$userId} connected with connection ID {$conn->resourceId}\n";
    }

    /**
     * When a message is received
     */
    public function onMessage(ConnectionInterface $conn, $msg)
    {
        $data = json_decode($msg);

        if (!isset($data->type) || $data->type !== 'request_send_message') {
            return;
        }

        $sender = User::find($data->from_user_id);
        $receiver = User::find($data->to_user_id);

        if (!$sender || !$receiver) {
            echo "Sender or receiver not found!\n";
            return;
        }

        // Save or get conversation
        $conversation = Conversation::firstOrCreate([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);

        // Save message
        $message = new Message();
        $message->conversation_id = $conversation->id;
        $message->user_id = $sender->id;
        $message->message = $data->message;
        $message->save();

        // Notify receiver if not sender
        if ($sender->id != $receiver->id) {
            $receiver->notify(new CommonNotification([
                'user_id' => $sender->id,
                'message' => "{$sender->name} sent you a message.",
                'type' => 'direct_message',
            ]));
        }

        // Broadcast to all connected clients
        foreach ($this->clients as $client) {
            $client->send(json_encode([
                'conversation_id' => $conversation->id,
                'message' => $message->message,
                'from_user_id' => $sender->id,
                'to_user_id' => $receiver->id,
                'created_at' => $message->created_at->toDateTimeString(),
            ]));
        }
    }

    /**
     * When a client disconnects
     */
    public function onClose(ConnectionInterface $conn)
    {
        $query = $conn->httpRequest->getUri()->getQuery();
        parse_str($query, $params);

        $userId = $params['user_id'] ?? null;
        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                $user->chat_connection_id = null;
                $user->is_online = false;
                $user->save();
            }
        }

        $this->clients->detach($conn);
        echo "User {$userId} disconnected.\n";
    }

    /**
     * Handle errors
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}
