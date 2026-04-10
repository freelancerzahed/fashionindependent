@extends('frontend.layouts.app')
@section('content')
    <main class="container col_2">

        @include('frontend/social/partials/left_sidebar')

 <div class="middle_side">
            <!-- ================== Middle Menu Start============= -->
            <div class="cover_photo_container ">
                <div class="cover_photo "
                    style="background: url({{ asset('public/uploads/cover-photo.jpg') }});  height: 200px;
            width: 100%;
            background-size: cover;
            background-repeat: no-repeat;">
                    <div class="profile_container">
                        <div class="profile">

                            @if ($user->avatar == null || uploaded_asset($user->avatar) == '')
                                <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $user->name }}">
                            @else
                                <img src="{{ uploaded_asset($user->avatar) }}" alt="{{ $user->name }}">
                            @endif

                            <b class="name">
                                {{ $user->name }}
                            </b>
                        </div>

                        <div class="acction_button">
                            @php
                                $current_user = Auth::user();
                            @endphp
                            <a class="btn btn-theme btn-sm bg-primary" href="{{ route('get-messanger', $user->user_name) }}"
                                style="color: #fff !important">Message</a>

                            @if ($current_user->isFriendWith($user))
                                <a href="{{ route('remove-friend', $user->id) }}" class="btn"
                                    style="color: #fff !important">Following</a>
                            @else
                                <a href="{{ route('send-friend-request', $user->id) }}" class="btn"
                                    style="color: #fff !important">Follow</a>
                            @endif

                        </div>
                    </div>
                </div>

            </div>
            <div style="margin-top: 7%">
                @include('frontend/social/partials/menu')
            </div>
            @foreach (App\Models\Post::orderBy('created_at', 'DESC')->where('user_id', $user->id)->get() as $post)
                <section class="feeds">

                    <div class="feed mt_1" style="margin-bottom: 15px;">
                        <div class="feed_header">

                            <div class="profile">
                                <div class="profile_picture"> <a
                                        href="{{ route('get-user-profile-page', $post->user->user_name) }}">
                                        @if ($post->user->avatar == null || uploaded_asset($post->user->avatar) == '')
                                            <img src="{{ asset('public/uploads/avatar.png') }}"
                                                alt="{{ $post->user->name }}" class="img-responsive img-circle avatar">
                                        @else
                                            <img src="{{ uploaded_asset($post->user->avatar) }}"
                                                alt="{{ $post->user->name }}" class="img-responsive img-circle avatar">
                                        @endif
                                    </a> </div>
                                <div class="description">
                                    <div class="name text-muted">{{ $post->user->name }}</div>
                                    <div class="published"> {{ $post->created_at->diffForHumans() }}</div>
                                </div>
                            </div>
                            <div class="dropdown">
                                <div class="action" onclick="toggleDropdown()"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-more-horizontal">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="19" cy="12" r="1"></circle>
                                    <circle cx="5" cy="12" r="1"></circle>
                                </svg> </div>
                                <div class="dropdown_menu card" id="dropdownMenu" style="display: none" >
                                  <a class="dropdown-item" href="#">Delete</a>

                                </div>
                              </div>

                        </div>
                        <div class="feed_description">
                            <div class="feed_media">

                                @if ($post->media != null)
                                    @if (uploaded_asset($post->media) != '' && is_video($post->media))
                                        <video controls="controls">
                                            <source src=" {{ uploaded_asset($post->media) }}" type="video/mp4">
                                            <source src="{{ uploaded_asset($post->media) }}" type="video/ogg">
                                            Your browser does not support the HTML5 Video element.
                                        </video>
                                    @elseif(uploaded_asset($post->media) != '')
                                        <img src="{{ uploaded_asset($post->media) }}" class="image" alt="image post">
                                    @endif
                                @endif
                            </div>
                            <div class="feed_text"> {{ $post->body }} </div>
                        </div>
                        <div class="feed_footer">

                            @php
                                $likes_count = App\Models\Like::where('post_id', $post->id)
                                    ->where('type', 'like')
                                    ->get();
                                $love_count = App\Models\Like::where('post_id', $post->id)
                                    ->where('type', 'love')
                                    ->get();
                                $flag_count = App\Models\Like::where('post_id', $post->id)
                                    ->where('type', 'flag')
                                    ->get();
                            @endphp

                            <div class="left">
                                <a href="javascript:void(0)" onclick="postLike({{ $post->id }},'postLike','like')">
                                    <div class="like engagement_link"> <svg height="24" viewBox="0 -960 960 960"
                                            width="24">
                                            <path @if ($post->likes()->where('user_id', auth()->user()->id)->where('type', 'like')->count() != 0) fill="#ff0000" @endif
                                                d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                                        </svg> <span
                                            id="postLikePost-{{ $post->id }}">{{ $likes_count->count() }}</span>

                                    </div>
                                </a>
                                <a href="javascript:void(0)" onclick="postLike({{ $post->id }},'postLove','love')">
                                    <div class="love engagement_link"><svg height="24" viewBox="0 -960 960 960"
                                            width="24">
                                            <path @if ($post->likes()->where('user_id', auth()->user()->id)->where('type', 'love')->count() != 0) fill="#ff0000" @endif
                                                d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                                        </svg></div>
                                </a>
                                <span id="postLovePost-{{ $post->id }}">{{ $love_count->count() }}</span>
                                <a href="javascript:void(0)" onclick="postLike({{ $post->id }},'postFlag','flag')">
                                    <div class="flag engagement_link"><svg height="24" viewBox="0 -960 960 960"
                                            width="24">
                                            <path @if ($post->likes()->where('user_id', auth()->user()->id)->where('type', 'flag')->count() != 0) fill="#ff0000" @endif
                                                d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                                        </svg></div>
                                </a>
                                <span id="postFlagPost-{{ $post->id }}"> {{ $flag_count->count() }}</span>
                            </div>
                            <div class="right">
                                <div class="comment engagement_link"> <svg height="24" viewBox="0 -960 960 960"
                                        width="24">
                                        <path
                                            d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                                    </svg> <span>Comment</span> </div>
                                <div class="share engagement_link"><svg height="24" viewBox="0 -960 960 960"
                                        width="24">
                                        <path
                                            d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
                                    </svg></div>
                                <span>Share</span>
                            </div>
                        </div>
                        <div class="new_comment" style="display: block;">
                            <form method="post" action="{{ route('comment.add') }}">
                                @csrf
                                <div class="comment_box">
                                    <input type="text" placeholder="write comment" name="comment">
                                    <input type="hidden" name="post_id" value="{{ $post->id }}">
                                    <button type="submit" class="comment_btn"><svg height="24"
                                            viewBox="0 -960 960 960" width="24">
                                            <path
                                                d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                                        </svg></span>
                                </div>
                            </form>

                            <div class="comment_section mt_1">
                                @foreach ($post->comments as $comment)
                                    <div class="comment">
                                        <div class="main_comment">
                                            <div class="comment_header">
                                                <div class="profile">
                                                    <div class="profile_picture"><a
                                                            href="{{ route('get-user-profile-page', $post->user->user_name) }}">
                                                            @if ($post->user->avatar == null || uploaded_asset($post->user->avatar) == '')
                                                                <img src="{{ asset('public/uploads/avatar.png') }}"
                                                                    alt="{{ $post->user->name }}"
                                                                    class="img-responsive img-circle avatar">
                                                            @else
                                                                <img src="{{ uploaded_asset($post->user->avatar) }}"
                                                                    alt="{{ $post->user->name }}"
                                                                    class="img-responsive img-circle avatar">
                                                            @endif
                                                        </a>
                                                    </div>

                                                    <a class="name"
                                                        href="{{ route('get-user-profile-page', $post->user->user_name) }}">
                                                        {{ $post->user->name }}
                                                    </a>
                                                </div>
                                                <div class="comment_time">
                                                    <h6>{{ $comment->created_at->diffForHumans() }}</h6>
                                                </div>
                                            </div>
                                            <div class="comment_body">

                                                <p>{{ $comment->comment }}</p>

                                                @php
                                                    $comment_likes_count = App\Models\CommentLike::where(
                                                        'comment_id',
                                                        $comment->id,
                                                    )
                                                        ->where('type', 'like')
                                                        ->get();
                                                    $comment_love_count = App\Models\CommentLike::where(
                                                        'comment_id',
                                                        $comment->id,
                                                    )
                                                        ->where('type', 'love')
                                                        ->get();
                                                    $comment_flag_count = App\Models\CommentLike::where(
                                                        'comment_id',
                                                        $comment->id,
                                                    )
                                                        ->where('type', 'flag')
                                                        ->get();
                                                @endphp
                                                <div class="feed_footer">

                                                    <div class="left">
                                                        <a href="javascript:void(0)"
                                                            onclick="commentLike({{ $comment->id }},'postLike','like')">
                                                            <div class="like engagement_link"> <svg height="24"
                                                                    viewBox="0 -960 960 960" width="24">
                                                                    <path
                                                                        @if ($comment->likes()->where('user_id', auth()->user()->id)->where('type', 'like')->count() != 0) fill="#ff0000" @endif
                                                                        d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                                                                </svg> <span
                                                                    id="postLikeComment-{{ $comment->id }}">{{ $comment_likes_count->count() }}</span>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)"
                                                            onclick="commentLike({{ $comment->id }},'postLove','love')">
                                                            <div class="love engagement_link"><svg height="24"
                                                                    viewBox="0 -960 960 960" width="24">
                                                                    <path
                                                                        @if ($comment->likes()->where('user_id', auth()->user()->id)->where('type', 'love')->count() != 0) fill="#ff0000" @endif
                                                                        d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                                                                </svg></div>
                                                        </a>
                                                        <span
                                                            id="postLoveComment-{{ $comment->id }}">{{ $comment_love_count->count() }}</span>

                                                        <a href="javascript:void(0)"
                                                            onclick="commentLike({{ $comment->id }},'postFlag','flag')">
                                                            <div class="flag engagement_link"><svg height="24"
                                                                    viewBox="0 -960 960 960" width="24">
                                                                    <path
                                                                        @if ($comment->likes()->where('user_id', auth()->user()->id)->where('type', 'flag')->count() != 0) fill="#ff0000" @endif
                                                                        d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                                                                </svg></div>
                                                        </a>

                                                        <span
                                                            id="postFlagComment-{{ $comment->id }}">{{ $comment_flag_count->count() }}</span>
                                                    </div>
                                                    <div class="right">
                                                        <div class="comment engagement_link"> <svg height="24"
                                                                viewBox="0 -960 960 960" width="24">
                                                                <path
                                                                    d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                                                            </svg> <span>Comment</span> </div>
                                                        <div class="share engagement_link"><svg height="24"
                                                                viewBox="0 -960 960 960" width="24">
                                                                <path
                                                                    d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
                                                            </svg></div>
                                                        <span>Share</span>
                                                    </div>
                                                </div>

                                            </div>



                                        </div>
                                        <div class="sub_comments">
                                            <div class="reply">
                                                <form method="post">
                                                    <div class="comment_box"> <input type="text"
                                                            placeholder="write comment"> <span type="button"
                                                            class="comment_btn"><svg height="24"
                                                                viewBox="0 -960 960 960" width="24">
                                                                <path
                                                                    d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                                                            </svg></span> </div>
                                                </form>
                                            </div>
                                            @foreach ($comment->replies as $comment)
                                                <div class="sub_comment mt_1">
                                                    <div class="comment_header">
                                                        <div class="profile">
                                                            <div class="profile_picture"><img src="images/profile_pic.jpg"
                                                                    alt="">
                                                            </div>

                                                            <a class="name" href="#javascript">
                                                                Pabelo Mukrani
                                                            </a>
                                                        </div>
                                                        <div class="comment_time">
                                                            <h6>50 mins ago</h6>
                                                        </div>
                                                    </div>
                                                    <div class="comment_body">

                                                        <p>Oooo Very Cute and Sweet Dog, happy birthday Cuty.... 🙂</p>
                                                        <div class="feed_footer">

                                                            <div class="left">
                                                                <div class="like engagement_link"> <svg height="24"
                                                                        viewBox="0 -960 960 960" width="24">
                                                                        <path
                                                                            d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                                                                    </svg> <span>Like</span> </div>
                                                                <div class="love engagement_link"><svg height="24"
                                                                        viewBox="0 -960 960 960" width="24">
                                                                        <path
                                                                            d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                                                                    </svg></div>
                                                                <span>Love</span>
                                                                <div class="flag engagement_link"><svg height="24"
                                                                        viewBox="0 -960 960 960" width="24">
                                                                        <path
                                                                            d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                                                                    </svg></div> <span>Report</span>
                                                            </div>
                                                            <div class="right">
                                                                <div class="comment engagement_link"> <svg height="24"
                                                                        viewBox="0 -960 960 960" width="24">
                                                                        <path
                                                                            d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                                                                    </svg> <span>Comment</span> </div>
                                                                <div class="share engagement_link"><svg height="24"
                                                                        viewBox="0 -960 960 960" width="24">
                                                                        <path
                                                                            d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
                                                                    </svg></div>
                                                                <span>Share</span>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            @endforeach

                                        </div>

                                    </div>
                                @endforeach
                            </div>

                        </div>
                    </div>


                </section>
            @endforeach
        </div>
        <!-- ================== Middle Section End============= -->
        <!-- ================== Right Section Side Start============= -->

        <!-- ================== Right Section Side End============= -->
    </main>
@endsection
