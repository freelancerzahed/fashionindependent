<div class="comment" style="margin-left: {{ $depth * 20 }}px; margin-top: 10px;">
    <div class="comment_header" style="display: flex; justify-content: space-between; align-items: center;">
        <div class="profile" style="display: flex; align-items: center; gap: 10px;">
            <div class="profile_picture">
                <a href="{{ route('get-user-profile-page', $comment->user->user_name) }}">
                    @if ($comment->user->avatar == null || uploaded_asset($comment->user->avatar) == '')
                        <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $comment->user->name }}" style="width: 32px; height: 32px; border-radius: 50%;">
                    @else
                        <img src="{{ uploaded_asset($comment->user->avatar) }}" alt="{{ $comment->user->name }}" style="width: 32px; height: 32px; border-radius: 50%;">
                    @endif
                </a>
            </div>
            <div class="description">
                <div class="name" style="font-weight: bold; color: #365899;"><a href="{{ route('get-user-profile-page', $comment->user->user_name) }}" style="text-decoration: none; color: #365899;">{{ $comment->user->name }}</a></div>
                <div class="comment_time" style="color: #90949c; font-size: 12px;">{{ $comment->created_at->diffForHumans() }}</div>
            </div>
        </div>
    </div>
    <div class="comment_body" style="margin-top: 5px;">
        <p style="margin: 0; color: #1d2129; font-size: 14px;">{{ $comment->comment }}</p>
        <div class="feed_footer" style="display: flex; justify-content: space-between; margin-top: 5px;">
            <div class="left" style="display: flex; gap: 10px;">
                <a href="javascript:void(0)" onclick="commentLike({{ $comment->id }}, 'commentLike', 'like')" style="text-decoration: none; color: #606770;">
                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                        <svg height="20" viewBox="0 -960 960 960" width="20">
                            <path @if ($comment->likes()->where('user_id', auth()->id())->where('type', 'like')->exists()) fill="#1877f2" @endif
                                d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Z" />
                        </svg>
                        <span id="commentLikeComment-{{ $comment->id }}">{{ $comment->likes()->where('type', 'like')->count() }}</span>
                    </div>
                </a>
                <a href="javascript:void(0)" onclick="commentLike({{ $comment->id }}, 'commentLove', 'love')" style="text-decoration: none; color: #606770;">
                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                        <svg height="20" viewBox="0 -960 960 960" width="20">
                            <path @if ($comment->likes()->where('user_id', auth()->id())->where('type', 'love')->exists()) fill="#ff0000" @endif
                                d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Z" />
                        </svg>
                        <span id="commentLoveComment-{{ $comment->id }}">{{ $comment->likes()->where('type', 'love')->count() }}</span>
                    </div>
                </a>
                <a href="javascript:void(0)" onclick="commentLike({{ $comment->id }}, 'commentFlag', 'flag')" style="text-decoration: none; color: #606770;">
                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                        <svg height="20" viewBox="0 -960 960 960" width="20">
                            <path @if ($comment->likes()->where('user_id', auth()->id())->where('type', 'flag')->exists()) fill="#90949c" @endif
                                d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                        </svg>
                        <span id="commentFlagComment-{{ $comment->id }}">{{ $comment->likes()->where('type', 'flag')->count() }}</span>
                    </div>
                </a>
            </div>
            <div class="right">
                <a href="javascript:void(0)" onclick="toggleReplyForm({{ $comment->id }})" style="text-decoration: none; color: #606770; font-size: 14px;">Reply</a>
            </div>
        </div>
    </div>

    <!-- Replies -->
    <div class="replies" id="replies_{{ $comment->id }}" style="margin-left: 20px; margin-top: 5px;">
        @foreach ($comment->replies as $reply)
            @component('components.comment', ['comment' => $reply, 'depth' => $depth + 1])
            @endcomponent
        @endforeach
    </div>

    <!-- Reply Form -->
    <div class="reply_form" id="reply_form_{{ $comment->id }}" style="display: none; margin-top: 5px;">
        <form method="POST" action="{{ route('comment.reply') }}" class="comment_form">
            @csrf
            <input type="hidden" name="post_id" value="{{ $comment->post_id }}">
            <input type="hidden" name="parent_id" value="{{ $comment->id }}">
            <div class="comment_box" style="display: flex; align-items: center;">
                <input type="text" placeholder="Write a reply..." name="comment" style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; margin-right: 10px;">
                <button type="submit" class="comment_btn" style="background: none; border: none; cursor: pointer;">
                    <svg height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Z" />
                    </svg>
                </button>
            </div>
        </form>
    </div>
</div>
