@extends('frontend.layouts.app')
@section('content')

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')
        <!-- ================== All Notifications Start============= -->

        @if (count(auth()->user()->notifications) > 0)
        <div class="sender_list mt_1">
            @foreach (auth()->user()->notifications as $notification)
                @php
                    $user = isset($notification->data['user_id']) ? App\Models\User::find($notification->data['user_id']) : null;
                    $message = $notification->data['message'] ?? 'You have a new notification.';
                    $username = $user ? $user->name : 'Someone';
                @endphp

                <div class="profile">
                    <div class="profile_picture">
                        @if (!isset($user) || ($user->avatar == null || uploaded_asset($user->avatar) == ''))
                            <img src="{{ asset('public/uploads/avatar.png') }}" alt="{{ $username }}" class="img-responsive img-circle avatar">
                        @else
                            <img src="{{ uploaded_asset($user->avatar) }}" alt="{{ $username }}" class="img-responsive img-circle avatar">
                        @endif
                    </div>
                    <div class="content">
                        <span class="username">{{ $username }}</span>
                        <p>{{ $message }}</p>
                        <span class="time">{{ $notification->created_at->diffForHumans() }}</span>
                    </div>
                </div>
            @endforeach
        </div>
        @else
        <!-- No Notifications Placeholder -->
        <div class="notification_page">
            <div class="notification-placeholder">
                <div class="icon">🔔</div>
                <p class="message">No new notifications</p>
                <p class="subtext">Check back later for updates!</p>
            </div>
        </div>
        @endif
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>
@endsection
