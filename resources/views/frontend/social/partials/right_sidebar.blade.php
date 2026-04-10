@php
    $friendsOfFriends = Auth::user()->getFriendsOfFriends($perPage = 3);
@endphp

<div class="right_side ">

    <!-- Redesigned Chatbot -->
    <div class="card mt-4 modern-chatbot">
        <div class="chatbot-header">
            <h2>Sofia Ai Assistant</h2>
        </div>
        <div class="chatbot-body">
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chat-bubble bot">👋 Hi there! Need help with anything?</div>
                <div class="chat-bubble user">Yes! Can you help me track my order?</div>
                <div class="chat-bubble bot">Sure! Just go to your profile → Orders section.</div>
            </div>
            <div class="chatbot-input-wrapper">
                <input type="text" id="chatbot-input" placeholder="Type your message..." />
                <button onclick="sendMessage()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-send" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div class="card">

        <div class="card_title">
            <h2>Friend Suggestions</h2>
        </div>
        <div class="card_body">
            @if ($friendsOfFriends->count() < 0)
                @foreach ($friendsOfFriends as $friend)
                    @if (!Auth::user()->isFriendWith($friend))
                        <div class="friend" id="friendRequest{{ $friend->id }}">
                            <div class="profile">
                                <div class="profile_picture">
                                    <a href="{{ route('get-user-profile-page', $friend->user_name) }}">
                                        @if ($friend->avatar == null || uploaded_asset($friend->avatar) == '')
                                            <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $friend->name }}"
                                                class="img-responsive img-circle avatar">
                                        @else
                                            <img src="{{ uploaded_asset($friend->avatar) }}" alt="{{ $friend->name }}"
                                                class="img-responsive img-circle avatar">
                                        @endif
                                    </a>
                                </div>
                                <a href="" class="name">{{ $friend->name }}</a>
                            </div>
                            <a href="javascript:void(0)" onclick="send_friend_request({{ $friend->id }})" class="btn add_friend">
                                Add Friend
                            </a>
                        </div>
                    @endif
                @endforeach
            @else
                @foreach (App\Models\User::all()->random(3) as $friend)
                    @if (!Auth::user()->isFriendWith($friend))
                        <div class="friend" id="friendRequest{{ $friend->id }}">
                            <div class="profile">
                                <div class="profile_picture">
                                    <a href="{{ route('get-user-profile-page', $friend->user_name) }}">
                                        @if ($friend->avatar == null || uploaded_asset($friend->avatar) == '')
                                            <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $friend->name }}"
                                                class="img-responsive img-circle avatar">
                                        @else
                                            <img src="{{ uploaded_asset($friend->avatar) }}" alt="{{ $friend->name }}"
                                                class="img-responsive img-circle avatar">
                                        @endif
                                    </a>
                                </div>
                                <a href="" class="name">{{ $friend->name }}</a>
                            </div>
                            <a href="javascript:void(0)" onclick="send_friend_request({{ $friend->id }})" class="btn add_friend">
                                Add Friend
                            </a>
                        </div>
                    @endif
                @endforeach
            @endif
        </div>
    </div>

</div>

<!-- Chatbot Styles -->
<style>
    .modern-chatbot {
        background: #ffffff;
        border-radius: 18px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .chatbot-header {
        background: #900000;
        color: #fff;
        padding: 16px 20px;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .chatbot-body {
        padding: 15px;
        display: flex;
        flex-direction: column;
        height: 320px;
        justify-content: space-between;
    }

    .chatbot-messages {
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 4px;
        margin-bottom: 12px;
    }

    .chat-bubble {
        max-width: 80%;
        padding: 10px 14px;
        margin-bottom: 10px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .chat-bubble.bot {
        background: #f1f2f6;
        align-self: flex-start;
        color: #2f3542;
        border-top-left-radius: 4px;
    }

    .chat-bubble.user {
        background: #900000;
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
    }

    .chatbot-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
}

    .chatbot-input-wrapper input {
        flex-grow: 1;
        padding: 10px 14px;
        border-radius: 50px;
        border: 1px solid #dcdde1;
        outline: none;
        font-size: 14px;
        background-color: #f9f9f9;
    }

    .chatbot-input-wrapper button {
        background: #900000;
        border: none;
        padding: 10px 12px;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .chatbot-input-wrapper button:hover {
        background: #900000;
    }

    .icon-send {
        width: 20px;
        height: 20px;
        fill: white;
    }
    .icon-send path{

        fill: white;
    }
</style>

@push('scripts')
<script>
    function sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        if (!message) return;

        const messages = document.getElementById('chatbot-messages');

        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-bubble user';
        userMsg.textContent = message;
        messages.appendChild(userMsg);

        // Simulated bot response
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-bubble bot';
            botMsg.textContent = 'Thanks for your message! I’ll get back to you soon.';
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 500);

        messages.scrollTop = messages.scrollHeight;
        input.value = '';
    }
</script>
@endpush
