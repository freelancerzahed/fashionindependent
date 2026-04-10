@extends('frontend.layouts.app')
@section('content')

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')
        <div class="settings_page">
            <div class="settings">
                <div class="card personal_info">
                    <h2 class="card_title">Personal Information</h2>
                    <form class="form" action="{{ route('user.profile-update') }}" method="POST">
                        @csrf
                        <label>Full Name</label>
                        <input class="input" name="name" value="{{ Auth::user()->name }}" type="text" placeholder="Enter your full name">

                        <label>Nick Name</label>
                        <input class="input" name="nick_name" value="{{ Auth::user()->nick_name }}" type="text" placeholder="Enter your nickname">

                        <label>Username</label>
                        <input class="input" name="user_name" value="{{ Auth::user()->user_name }}" type="text" placeholder="Enter your username">

                        <label>Email</label>
                        <input class="input" name="email" value="{{ Auth::user()->email }}" type="email" placeholder="Enter your email">

                        <label>Phone</label>
                        <input class="input" name="phone" value="{{ Auth::user()->phone }}" type="text" placeholder="Enter your phone number">

                        <button type="submit" class="btn primary">Update</button>
                    </form>
                </div>

                <div class="card notifications">
                    <h2 class="card_title">Notification Preferences</h2>
                    <form action="{{ route('user.is_notify') }}" method="POST">
                        @csrf
                        <label>How often would you like to receive notifications?</label>
                        <select name="time" class="input">
                            <option value="1">Daily</option>
                            <option value="10080">Once a week</option>
                            <option value="21600">Twice a month</option>
                            <option value="0">Never</option>
                        </select>
                        <button type="submit" class="btn primary">Update</button>
                    </form>
                </div>

                <div class="card privacy">
                    <h2 class="card_title">Change Your Password</h2>
                    <form action="{{ route('user.change-password') }}" method="POST">
                        @csrf
                        <label>New Password</label>
                        <input name="password" class="input" type="password" placeholder="Enter new password">

                        <label>Confirm Password</label>
                        <input name="password_confirmation" class="input" type="password" placeholder="Confirm new password">

                        <button type="submit" class="btn primary">Change Password</button>
                    </form>
                </div>

                <div class="card privacy">
                    <h2 class="card_title">Privacy Settings</h2>
                    <form action="{{ route('user.privecy-setting-update') }}" method="POST">
                        @csrf
                        <div class="checkbox_group">
                            <label class="checkbox">
                                <input name="is_hide_birthday" type="checkbox" @if (Auth::user()->is_hide_birthday === 1) checked @endif>
                                <span class="checkbox_label">Hide Birthday</span>
                            </label>
                        </div>
                        <div class="checkbox_group">
                            <label class="checkbox">
                                <input name="is_hide_body_shape" type="checkbox" @if (Auth::user()->is_hide_body_shape === 1) checked @endif>
                                <span class="checkbox_label">Hide Body Shape</span>
                            </label>
                        </div>
                        <div class="checkbox_group">
                            <label class="checkbox">
                                <input name="is_hide_favorites" type="checkbox" @if (Auth::user()->is_hide_favorites === 1) checked @endif>
                                <span class="checkbox_label">Hide Favorites</span>
                            </label>
                        </div>
                        <div class="checkbox_group">
                            <label class="checkbox">
                                <input name="status" type="checkbox" @if (auth()->user()->status === 0) checked @endif>
                                <span class="checkbox_label">Deactivate Account</span>
                            </label>
                        </div>
                        <button type="submit" class="btn primary">Update</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>

<style>
    .container {
        max-width: 100%;
        padding: 15px;
    }
    .settings_page {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .card {
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .btn.primary {
        background: #007bff;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .btn.primary:hover {
        background: #0056b3;
    }
    @media (max-width: 768px) {
        .col_3 {
            display: flex;
            flex-direction: column;
        }
        .middle_side {
            width: 100%;
            padding: 10px;
        }
        .card {
            width: 100%;
        }
    }
</style>

@endsection
