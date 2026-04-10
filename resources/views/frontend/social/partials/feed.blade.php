<div id="posts-container">
    @foreach ($posts as $post)
        @include('frontend.social.partials._post', ['post' => $post])
    @endforeach
</div>
<div class="loading" id="loading" style="text-align: center; padding: 20px; display: none;">
    <span>Loading more posts...</span>
</div>
<div id="no-more-posts" style="text-align: center; padding: 20px; display: none;">
    <span>No more posts to load.</span>
</div>