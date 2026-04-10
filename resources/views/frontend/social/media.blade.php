@extends('frontend.layouts.app')
@section('content')

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')
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
                <textarea style="width: 100%" name="body" rows="3" placeholder="What's on your mind?" spellcheck="false"></textarea>
                <div class="post_action_box">
                    <div class="post_type">
                        <p>Photo or Video</p>
                        <input type="file" name="aiz_file">
                        <ul class="list">
                            <li><svg width="20.759" height="20.761" viewBox="0 0 20.759 20.761">
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
                                </svg></li>
                        </ul>
                    </div>
                    <input class="btn create_post_btn" type="submit" value="Create Post" />
                </div>
            </form>
        </section>
        <!-- ================== All Friends Start============= -->
        <section class="media_section">
            @if ($medias->count() > 0)
                @foreach ($medias as $media)
                    <div class="media_wrapper">
                        <div class="media">
                            @if ($media->type == 'image')
                                <img src="{{ my_asset($media->file_name) }}" class="img-fit">
                            @elseif($media->type == 'video')
                                <video controls="controls">
                                    <source src="{{ my_asset($media->file_name) }}" type="video/mp4">
                                    <source src="{{ my_asset($media->file_name) }}" type="video/ogg">
                                    Your browser does not support the HTML5 Video element.
                                </video>
                            @else
                                <i class="las la-file"></i>
                            @endif
                        </div>
                        <div class="media_action_btn">
                            <button class="btn w_100">delete</button>
                        </div>
                    </div>
                @endforeach
            @endif
        </section>
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>

@endsection
