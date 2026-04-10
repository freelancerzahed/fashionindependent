@extends('frontend.layouts.app')
@section('content')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <main class="container col_3">
        @include('frontend/social/partials/left_sidebar')
        <!-- ================== Middle Section Start============= -->
        <div class="middle_side">
            @include('frontend/social/partials/menu')
            <!-- ================== Middle Menu Start============= -->

            <!-- ================== Middle Menu End============= -->
            <!-- ================== Create Post Start============= -->
            <section class="post_box">
                <form action="{{ route('create-post') }}" method="POST" enctype="multipart/form-data" class="post_box_form">
                    @csrf
                    <div class="profile">
                        <div class="profile_picture">
                            <a href="{{ route('get-user-profile-page', Auth::user()->user_name) }}">
                                @if (Auth::user()->avatar == null || uploaded_asset(Auth::user()->avatar) == '')
                                    <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ Auth::user()->name }}"
                                        class="img-responsive img-circle avatar">
                                @else
                                    <img src="{{ uploaded_asset(Auth::user()->avatar) }}" alt="{{ Auth::user()->name }}"
                                        class="img-responsive img-circle avatar">
                                @endif
                            </a>
                        </div>
                        <div class="name">{{ Auth::user()->name }}</div>
                    </div>
                    <textarea name="body" rows="3" placeholder="What's on your mind, {{ Auth::user()->name }}?" spellcheck="false"
                        required></textarea>

                    <!-- Preview Container -->
                    <div id="previewContainer" class="preview_container">
                        <!-- Previews will be dynamically inserted here -->
                    </div>

                    <div class="post_action_box">
                        <div class="post_type">
                            <label for="fileInput" class="file_input_label">
                                <svg width="20.759" height="20.761" viewBox="0 0 20.759 20.761">
                                    <g id="Group_102" data-name="Group 102" transform="translate(-328.121 -456)">
                                        <g id="Group_56" data-name="Group 56" transform="translate(328.121 458.611)">
                                            <path id="Path_119" data-name="Path 119"
                                                d="M9.3,19a3.681,3.681,0,0,1-3.676-3.676V3.019l-4.179.957A1.946,1.946,0,0,0,.065,6.354L3.648,19.731a1.965,1.965,0,0,0,1.886,1.438,1.9,1.9,0,0,0,.484-.062L14.735,19Z"
                                                transform="translate(0 -3.019)" fill="#2ace82" />
                                        </g>
                                        <g id="Group_57" data-name="Group 57" transform="translate(335.04 456)">
                                            <path id="Path_120" data-name="Path 120"
                                                d="M12.73,8.46A1.73,1.73,0,1,0,11,6.73,1.732,1.732,0,0,0,12.73,8.46Z"
                                                transform="translate(-8.405 -0.675)" fill="#2ace82" />
                                            <path id="Path_121" data-name="Path 121"
                                                d="M21.839,2.595A2.6,2.6,0,0,0,19.244,0h-8.65A2.6,2.6,0,0,0,8,2.595V14.7A2.6,2.6,0,0,0,10.595,17.3h8.65A2.6,2.6,0,0,0,21.839,14.7ZM10.595,1.73h8.65a.865.865,0,0,1,.865.865V8.164l-.657-.657a1.517,1.517,0,0,0-2.145,0L13.19,11.624l-1.09-1.09a1.517,1.517,0,0,0-2.145,0l-.225.225V2.595A.865.865,0,0,1,10.595,1.73Z"
                                                transform="translate(-8)" fill="#2ace82" />
                                        </g>
                                    </g>
                                </svg>
                                <span>Photo or Video</span>
                            </label>
                            <input type="file" name="aiz_file" id="fileInput" class="file_input" accept="image/*,video/*" multiple style="display: none;">
                        </div>
                        <input class="btn create_post_btn" type="submit" value="Create Post" />
                    </div>
                </form>
            </section>
            <!-- ================== Create Post End============= -->
            <!-- ================== Feeds Section Start============= -->
            @include('frontend/social/partials/feed')
            <!-- ================== Feeds Section End============= -->
        </div>
        <!-- ================== Middle Section End============= -->
        @include('frontend/social/partials/right_sidebar')
    </main>

    <!-- Add CSS for Previews and Loading -->
    <style>
        .preview_container {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
        }
        .preview_container img, .preview_container video {
            width: 100px;
            height: auto;
            margin: 5px;
            border: 1px solid #ccc;
            object-fit: cover;
        }
        .file_input_label {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .file_input_label:hover {
            opacity: 0.8;
        }
    </style>

    <!-- Include jQuery and Infinite Scrolling Script -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        // CSRF token setup for AJAX
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // Variables for infinite scrolling
        let loading = false;
        let nextPageUrl = '{{ $posts->nextPageUrl() }}';

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

        // Infinite scrolling logic
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100 && !loading && nextPageUrl) {
                loading = true;
                $('#loading').show();

                $.ajax({
                    url: nextPageUrl,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        if (response.posts && response.posts.length > 0) {
                            response.posts.forEach(function (post) {
                                const postHtml = renderPost(post);
                                $('#posts-container').append(postHtml);
                            });
                            nextPageUrl = response.next_page_url;
                        } else {
                            $('#no-more-posts').show();
                            nextPageUrl = null;
                        }
                        $('#loading').hide();
                        loading = false;
                    },
                    error: function (xhr) {
                        console.error('Error loading posts:', xhr);
                        $('#loading').hide();
                        loading = false;
                    }
                });
            }
        });

        // Function to render a post (client-side template)
        function renderPost(post) {
            // Escape HTML to prevent XSS
            const escapeHtml = (str) => {
                return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, ''');
            };

            // Construct post HTML
            let mediaHtml = '';
            if (post.media) {
                if (post.is_video) {
                    mediaHtml = `<video controls style="max-width: 100%; border-radius: 8px;">
                                    <source src="${post.media_url}" type="video/mp4">
                                    Your browser does not support the video tag.
                                 </video>`;
                } else {
                    mediaHtml = `<img src="${post.media_url}" style="max-width: 100%; border-radius: 8px;" alt="Post media">`;
                }
            }

            const postHtml = `
                <section class="feeds">
                    <div class="feed mt_1" style="margin-bottom: 15px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
                        <div class="feed_header" style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="profile" style="display: flex; align-items: center; gap: 10px;">
                                <div class="profile_picture">
                                    <a href="/profile/${post.user.user_name}">
                                        <img src="${post.user.avatar_url || '/public/uploads/avatar.png'}" alt="${escapeHtml(post.user.name)}" style="width: 40px; height: 40px; border-radius: 50%;">
                                    </a>
                                </div>
                                <div class="description">
                                    <div class="name" style="font-weight: bold; color: #365899;">
                                        <a href="/profile/${post.user.user_name}" style="text-decoration: none; color: #365899;">${escapeHtml(post.user.name)}</a>
                                    </div>
                                    <div class="published" style="color: #90949c; font-size: 12px;">${post.created_at_diff}</div>
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
                                    <a class="dropdown-item" href="/post/remove/${post.id}" style="padding: 8px 16px; display: block; text-decoration: none; color: #000;">Delete</a>
                                </div>
                            </div>
                        </div>
                        <div class="feed_description" style="margin-top: 10px;">
                            <div class="feed_media">${mediaHtml}</div>
                            <div class="feed_text" style="margin-top: 10px; color: #1d2129; font-size: 14px;">${escapeHtml(post.body)}</div>
                        </div>
                        <div class="feed_footer" style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px solid #ddd; margin-top: 10px;">
                            <div class="left" style="display: flex; gap: 10px;">
                                <a href="javascript:void(0)" onclick="postLike(${post.id}, 'postLike', 'like')" style="text-decoration: none; color: #606770;">
                                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                                        <svg height="24" viewBox="0 -960 960 960" width="24">
                                            <path ${post.user_liked ? 'fill="#1877f2"' : ''} d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Z" />
                                        </svg>
                                        <span id="postLikePost-${post.id}">${post.likes_count}</span>
                                    </div>
                                </a>
                                <a href="javascript:void(0)" onclick="postLike(${post.id}, 'postLove', 'love')" style="text-decoration: none; color: #606770;">
                                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                                        <svg height="24" viewBox="0 -960 960 960" width="24">
                                            <path ${post.user_loved ? 'fill="#ff0000"' : ''} d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Z" />
                                        </svg>
                                        <span id="postLovePost-${post.id}">${post.loves_count}</span>
                                    </div>
                                </a>
                                <a href="javascript:void(0)" onclick="postLike(${post.id}, 'postFlag', 'flag')" style="text-decoration: none; color: #606770;">
                                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                                        <svg height="24" viewBox="0 -960 960 960" width="24">
                                            <path ${post.user_flagged ? 'fill="#90949c"' : ''} d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                                        </svg>
                                        <span id="postFlagPost-${post.id}">${post.flags_count}</span>
                                    </div>
                                </a>
                            </div>
                            <div class="right" style="display: flex; gap: 10px;">
                                <a href="javascript:void(0)" onclick="toggleComments(${post.id})" style="text-decoration: none; color: #606770;">
                                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                                        <svg height="24" viewBox="0 -960 960 960" width="24">
                                            <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720Z" />
                                        </svg>
                                        <span>Comment</span>
                                    </div>
                                </a>
                                <a href="javascript:void(0)" onclick="sharePost(${post.id})" style="text-decoration: none; color: #606770;">
                                    <div class="engagement_link" style="display: flex; align-items: center; gap: 5px;">
                                        <svg height="24" viewBox="0 -960 960 960" width="24">
                                            <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
                                        </svg>
                                        <span>Share</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="new_comment" style="margin-top: 10px;">
                            <form method="POST" action="/comment/add" class="comment_form">
                                <input type="hidden" name="_token" value="${$('meta[name="csrf-token"]').attr('content')}">
                                <div class="comment_box" style="display: flex; align-items: center;">
                                    <input type="text" placeholder="Write a comment..." name="comment" id="comment_input_${post.id}" style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; margin-right: 10px;">
                                    <input type="hidden" name="post_id" value="${post.id}">
                                    <button type="submit" class="comment_btn" style="background: none; border: none; cursor: pointer;">
                                        <svg height="24" viewBox="0 -960 960 960" width="24">
                                            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <div id="comments_${post.id}" class="comment_section" style="margin-top: 10px; display: none;">
                                ${post.comments.map(comment => renderComment(comment, 0)).join('')}
                            </div>
                        </div>
                    </div>
                </section>`;
            return postHtml;
        }

        // Function to render a comment (simplified)
        function renderComment(comment, depth) {
            return `<div class="comment" style="margin-left: ${depth * 20}px;">${escapeHtml(comment.body)}</div>`;
        }

        // File preview for post creation
        document.getElementById('fileInput').addEventListener('change', function (event) {
            const previewContainer = document.getElementById('previewContainer');
            previewContainer.innerHTML = ''; // Clear previous previews
            const files = event.target.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function (e) {
                    const mediaElement = file.type.startsWith('video/')
                        ? `<video src="${e.target.result}" controls></video>`
                        : `<img src="${e.target.result}" alt="Preview">`;
                    previewContainer.innerHTML += mediaElement;
                };

                reader.readAsDataURL(file);
            }
        });
    </script>
@endsection