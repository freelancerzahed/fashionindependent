@extends('frontend.layouts.app')
@section('content')

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')
        <!-- ================== All Friends Start============= -->
        <section class="friends_section">
            <div class="friends">
                @if (Auth::user()->getFriends()->count() > 0)
                    @foreach (Auth::user()->getFriends() as $friend)
                        <div class="friend_wrapper" id="unFriendRequest{{$friend->id}}">
                            <div class="friend_photo">
                                <a href="{{ route('get-user-profile-page', $friend->user_name) }}">
                                    @if ($friend->avatar == null || uploaded_asset($friend->avatar) == '')
                                        <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $friend->name }}"
                                            class="img-responsive">
                                    @else
                                        <img src="{{ uploaded_asset($friend->avatar) }}" alt="{{ $friend->name }}"
                                            class="img-responsive">
                                    @endif
                                </a>
                            </div>
                            <div class="friend_name">{{ $friend->name }}</div>
                            <div class="friend_action_btn">
                                <button class="btn" onclick="send_unfriend_request({{$friend->id}})">Unfriend</button>
                                <a href="{{ route('get-messanger', $friend->user_name) }}" class="btn">Message</a>
                            </div>
                        </div>
                    @endforeach
                @else
                    <!-- Friend Page -->
                    <div class="friend_page">
                        <div class="friend-placeholder">
                            <div class="icon">👥</div>
                            <p class="message">No friends found</p>
                            <p class="subtext">Add some friends to see them here!</p>
                        </div>
                    </div>
                @endif
            </div>
        </section>
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>

@endsection
