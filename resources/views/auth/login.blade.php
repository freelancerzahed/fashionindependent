@extends('frontend.layouts.app')

@section('content')
<style>
    body {
        background: #f5f5f5;
    }

    .login-container {
        max-width: 400px;
        margin: 60px auto;
        padding: 30px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .login-title {
        color: #900;
        text-align: center;
        font-size: 26px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .login-subtitle {
        text-align: center;
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
    }

    .form-control {
        width: 100%;
        padding: 12px;
        margin-bottom: 15px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: #eef3ff;
    }

    .form-check {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 14px;
    }

    .btn-submit {
        width: 100%;
        background: #900;
        color: #fff;
        padding: 12px;
        border: none;
        border-radius: 6px;
        font-weight: bold;
    }

    .text-danger {
        color: red;
        font-size: 13px;
        margin-bottom: 10px;
    }
</style>

<div class="login-container">
    <h1 class="login-title">Welcome to Mirror Me Fashion</h1>
    <p class="login-subtitle">Login to your account</p>

    <form method="POST" action="{{ route('login') }}">
        @csrf

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <input type="email" name="email" class="form-control" placeholder="Email" required value="{{ old('email') }}">
        @error('email')
            <div class="text-danger">{{ $message }}</div>
        @enderror

        <input type="password" name="password" class="form-control" placeholder="Password" required>
        @error('password')
            <div class="text-danger">{{ $message }}</div>
        @enderror

        <!-- Google reCAPTCHA -->
        <div class="mb-3">
            <div class="g-recaptcha" data-sitekey="{{ env('RECAPTCHA_SITE_KEY') }}"></div>
        </div>


        <div class="form-check">
            <label>
                <input type="checkbox" name="remember"> Remember Me
            </label>
            <a href="{{ route('password.request') }}">Forgot password?</a>
        </div>

        <button type="submit" class="btn-submit">SIGN IN</button>
    </form>
</div>

<!-- reCAPTCHA Script -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
@endsection
