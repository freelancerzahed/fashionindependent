@extends('frontend.layouts.app')
@section('content')

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <div class="" style="display: flex">

        <div class="sender_list mt_1">
            @if(count($users_by_conversation) > 0)
                @foreach ($users_by_conversation as $user_info)
                    @if (auth()->user()->id != $user_info->id)
                        <a href="{{ route('get-messanger', $user_info->user_name) }}">
                            <div class="profile">
                                <div class="profile_picture @if ($user_info->is_online){{ 'online' }} @endif">
                                    @if ($user_info->avatar == null || uploaded_asset($user_info->avatar) == '')
                                        <img src="{{ asset('public/uploads/avatar.png') }}"
                                            alt="{{ $user_info->name }}" class="img-responsive img-circle avatar">
                                    @else
                                        <img src="{{ uploaded_asset($user_info->avatar) }}"
                                            alt="{{ $user_info->name }}" class="img-responsive img-circle avatar">
                                    @endif
                                </div>
                                <div class="content">
                                    <div class="name">{{ $user_info->name }}</div>
                                </div>
                            </div>
                        </a>
                    @endif
                @endforeach
            @else
                <!-- No Users Found Placeholder -->
                <div class="sender-placeholder">
                    <div class="icon">👤</div>
                    <p class="message">No users found</p>
                    <p class="subtext">Start a conversation to see users here!</p>
                </div>
            @endif
        </div>

        <div class="right_side_massanger sticky">
            <div class="messanger_chatbox">
                @isset($conversations)
                    <div class="message_body" id="messageBody">
                        @foreach ($conversations as $conversation)
                            @foreach ($conversation->messages as $message)
                                <div class="@if ($message->user_id == auth()->id()) talk_bubble @else user_bubble @endif">
                                    {{ $message->message }}
                                </div>
                            @endforeach
                        @endforeach
                    </div>

                    <div class="messanger_footer">
                        @csrf
                        <input type="hidden" value="{{ $user->id }}" name="user_id">
                        <textarea spellcheck="false" id="messageInput" name="message" rows="1" placeholder="Type something here..." required></textarea>
                        <button type="submit" id="messageSubmitBtn" class="btn" onclick="send_chat_message({{ $user->id }})">Send</button>
                    </div>
                @else
                    <!-- No Conversations Found Placeholder -->
                    <div class="message-placeholder">
                        <div class="icon">💬</div>
                        <p class="message">No conversations found</p>
                        <p class="subtext">Start a conversation to see messages here!</p>
                    </div>
                @endisset
            </div>
        </div>
    </div>

    @include('frontend/social/partials/right_sidebar')

</main>
@endsection

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const socket = new WebSocket('ws://127.0.0.1:8080?user_id={{ auth()->user()->id }}');
        const from_user_id = "{{ Auth::user()->id }}";

        const messageInput = document.getElementById('messageInput');
        const messageBody = document.getElementById('messageBody');
        const userIdInput = document.querySelector('input[name="user_id"]');

        // WebSocket Event Listeners
        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const newMessage = document.createElement("div");
            newMessage.textContent = data.message;

            if (!messageBody) return;

            if (from_user_id == data.from_user_id) {
                newMessage.classList.add("talk_bubble");
            } else if (from_user_id == data.to_user_id) {
                newMessage.classList.add("user_bubble");
            }

            messageBody.append(newMessage);
            scrollToBottom(messageBody);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            // setTimeout(() => location.reload(), 5000);
        };

        // Sending Chat Messages
        function send_chat_message(to_user_id) {
            const submitBtn = document.querySelector('#messageSubmitBtn');
            if (!submitBtn) return;

            submitBtn.disabled = true;

            const message = messageInput.value.trim();
            if (!message) {
                alert('Message should not be empty!');
                submitBtn.disabled = false;
                return;
            }

            const data = {
                message,
                from_user_id,
                to_user_id,
                type: 'request_send_message'
            };

            try {
                socket.send(JSON.stringify(data));
                messageInput.value = ""; // Clear input
            } catch (error) {
                console.error("Failed to send message:", error);
            } finally {
                submitBtn.disabled = false;
            }
        }

        // Listen for Enter Key Press
        if (messageInput && userIdInput) {
            messageInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default behavior
                    send_chat_message(userIdInput.value);
                }
            });
        } else {
            console.error('Required elements are missing: messageInput or user_id input.');
        }

        function scrollToBottom(element) {
    const start = element.scrollTop; // Current scroll position
    const end = element.scrollHeight - element.clientHeight; // Bottom position
    const duration = 1000; // Animation duration in milliseconds (e.g., 1 second)
    const startTime = performance.now();

    function easeInOutQuad(t) {
        // Easing function for smooth acceleration/deceleration
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0 to 1
        const easedProgress = easeInOutQuad(progress); // Apply easing
        const newPosition = start + (end - start) * easedProgress;

        element.scrollTop = newPosition;

        if (progress < 1) {
            requestAnimationFrame(animate); // Continue until done
        }
    }

    requestAnimationFrame(animate);
}
    });
</script>
