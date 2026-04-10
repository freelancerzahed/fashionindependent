@foreach (App\Models\Post::orderBy('created_at', 'DESC')->get() as $post)
    <section class="feeds">
        <div class="feed mt_1" style="margin-bottom: 15px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
            <!-- Post Header -->
            <div class="feed_header" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="profile" style="display: flex; align-items: center; gap: 10px;">
                    <div class="profile_picture">
                        <a href="{{ route('get-user-profile-page', $post->user->user_name) }}">
                            @if ($post->user->avatar == null || uploaded_asset($post->user->avatar) == '')
                                <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $post->user->name }}" style="width: 40px; height: 40px; border-radius: 50%;">
                            @else
                                <img src="{{ uploaded_asset($post->user->avatar) }}" alt="{{ $post->user->name }}" style="width: 40px; height: 40px; border-radius: 50%;">
                            @endif
                        </a>
                    </div>
                    <div class="description">
                        <div class="name" style="font-weight: bold; color: #365899;"><a href="{{ route('get-user-profile-page', $post->user->user_name) }}" style="text-decoration: none; color: #365899;">{{ $post->user->name }}</a></div>
                        <div class="published" style="color: #90949c; font-size: 12px;">{{ $post->created_at->diffForHumans() }}</div>
                    </div>
                </div>
                <div class="dropdown">
                    <div class="action" onclick="toggleDropdown(this)" style="cursor: pointer;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                    </div>
                    <div class="dropdown_menu card" style="display: none; position: absolute; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
                        <a class="dropdown-item" href="{{ route('remove-post', $post->id) }}" style="padding: 8px 16px; display: block; text-decoration: none; color: #000;">Delete</a>
                    </div>
                </div>
            </div>

            <!-- Post Description -->
            <div class="feed_description" style="margin-top: 10px;">
                <div class="feed_media">
                    @if ($post->media != null)
                        @if (uploaded_asset($post->media) != '' && is_video($post->media))
                            <video controls style="max-width: 100%; border-radius: 8px;">
                                <source src="{{ uploaded_asset($post->media) }}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        @elseif (uploaded_asset($post->media) != '')
                            <img src="{{ uploaded_asset($post->media) }}" style="max-width: 100%; border-radius: 8px;" alt="Post media">
                        @endif
                    @endif
                </div>
                <div class="feed_text" style="margin-top: 10px; color: #1d2129; font-size: 14px;">{{ $post->body }}</div>
            </div>

            <!-- Post Footer -->
            <div class="feed_footer" style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px solid #ddd; margin-top: 10px;">
                <div class="left" style="display: flex; gap: 10px;">
                    <a href="javascript:void(0)" onclick="postLike({{ $post->id }}, 'postLike', 'like')" style="text-decoration: none; color: #606770;">
                        <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path @if ($post->likes()->where('user_id', auth()->id())->where('type', 'like')->exists()) fill="#1877f2" @endif
                                    d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Z" />
                            </svg>
                            <span id="postLikePost-{{ $post->id }}">{{ $post->likes()->where('type', 'like')->count() }}</span>
                        </div>
                    </a>
                    <a href="javascript:void(0)" onclick="postLike({{ $post->id }}, 'postLove', 'love')" style="text-decoration: none; color: #606770;">
                        <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path @if ($post->likes()->where('user_id', auth()->id())->where('type', 'love')->exists()) fill="#ff0000" @endif
                                    d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Z" />
                            </svg>
                            <span id="postLovePost-{{ $post->id }}">{{ $post->likes()->where('type', 'love')->count() }}</span>
                        </div>
                    </a>
                    <a href="javascript:void(0)" onclick="postLike({{ $post->id }}, 'postFlag', 'flag')" style="text-decoration: none; color: #606770;">
                        <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path @if ($post->likes()->where('user_id', auth()->id())->where('type', 'flag')->exists()) fill="#90949c" @endif
                                    d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                            </svg>
                            <span id="postFlagPost-{{ $post->id }}">{{ $post->likes()->where('type', 'flag')->count() }}</span>
                        </div>
                    </a>
                </div>
                <div class="right" style="display: flex; gap: 10px;">
                    <a href="javascript:void(0)" onclick="toggleComments({{ $post->id }})" style="text-decoration: none; color: #606770;">
                        <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720Z" />
                            </svg>
                            <span>Comment</span>
                        </div>
                    </a>
                    <a href="javascript:void(0)" onclick="sharePost({{ $post->id }})" style="text-decoration: none; color: #606770;">
                        <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
                            </svg>
                            <span>Share</span>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Comment Section -->
            <div class="new_comment" style="margin-top: 10px;">
                <form method="POST" action="{{ route('comment.add') }}" class="comment_form">
                    @csrf
                    <div class="comment_box" style="display: flex; align-items: center;">
                        <input type="text" placeholder="Write a comment..." name="comment" id="comment_input_{{ $post->id }}" style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; margin-right: 10px;">
                        <input type="hidden" name="post_id" value="{{ $post->id }}">
                        <button type="submit" class="comment_btn" style="background: none; border: none; cursor: pointer;">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Z" />
                            </svg>
                        </button>
                    </div>
                </form>
                <div id="comments_{{ $post->id }}" class="comment_section" style="margin-top: 10px; display: none;">
                    @foreach ($post->comments->where('parent_id', null) as $comment)
                        @component('components.comment', ['comment' => $comment, 'depth' => 0])
                        @endcomponent
                    @endforeach
                </div>
            </div>
        </div>
    </section>
@endforeach

<script>
    // Toggle dropdown menu
    function toggleDropdown(element) {
        const menu = element.nextElementSibling;
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    // Toggle reply form visibility
    function toggleReplyForm(commentId) {
        const form = document.getElementById(`reply_form_${commentId}`);
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        } else {
            console.error(`Reply form with ID reply_form_${commentId} not found.`);
        }
    }

    // Toggle comments section visibility
    function toggleComments(postId) {
        const commentsSection = document.getElementById(`comments_${postId}`);
        if (commentsSection) {
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        } else {
            console.error(`Comments section with ID comments_${postId} not found.`);
        }
    }

    // Share post by copying URL to clipboard
    function sharePost(postId) {
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postUrl).then(() => {
            alert('Post URL copied to clipboard!');
        }).catch(err => {
            console.error('Error copying URL:', err);
        });
    }


</script>
