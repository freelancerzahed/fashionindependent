@extends('frontend.layouts.app')
@section('content')

<main class="container col_3">
    @include('frontend/social/partials/left_sidebar')
    <!-- ================== Middle Section Start============= -->
    <div class="middle_side">
        @include('frontend/social/partials/menu')

        <!-- ================== Recommendation History Start============= -->
        <!-- No Recommendations Placeholder -->
        <div class="recommendation_page">
            <div class="recommendation-placeholder">
                <div class="icon">📄</div>
                <p class="message">No recommendation history</p>
                <p class="subtext">Your recommendations will appear here once available.</p>
            </div>
        </div>
        <!-- ================== Recommendation History End============= -->
    </div>
    <!-- ================== Middle Section End============= -->
    <!-- ================== Right Section Side Start============= -->
    @include('frontend/social/partials/right_sidebar')
    <!-- ================== Right Section Side End============= -->
</main>

<style>
    /* Recommendation History Styles */
    .recommendation_page {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 70vh;
        text-align: center;
    }

    .recommendation-placeholder {
        max-width: 400px;
        margin: 0 auto;
    }

    .recommendation-placeholder .icon {
        font-size: 64px;
        margin-bottom: 20px;
        color: #ccc;
    }

    .recommendation-placeholder .message {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin-bottom: 10px;
    }

    .recommendation-placeholder .subtext {
        font-size: 14px;
        color: #777;
    }

    /* Recommendation List Styles */
    .recommendation_list {
        padding: 20px;
    }

    .recommendation-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
    }

    .recommendation-item .content {
        margin-left: 15px;
    }

    .recommendation-item .title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
    }

    .recommendation-item p {
        font-size: 14px;
        color: #666;
        margin: 5px 0;
    }

    .recommendation-item .time {
        font-size: 12px;
        color: #999;
    }
</style>

@endsection
