<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\Blog;

class DebugController extends Controller
{
    public function checkBlogs()
    {
        // Test the exact query from news_list
        $perPage = 10;
        $page = 1;
        
        $news_query = Blog::with('category:id,category_name')
            ->where('status', 1)
            ->where('type', 'news')
            ->select('id', 'title', 'slug', 'short_description', 'banner', 'category_id', 'status', 'created_at', 'type')
            ->orderBy('created_at', 'desc');
        
        $news_paginated = $news_query->paginate($perPage, '*', 'page', $page);
        
        // Also test without select
        $news_without_select = Blog::with('category:id,category_name')
            ->where('status', 1)
            ->where('type', 'news')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        return response()->json([
            'all_blogs_count' => Blog::count(),
            'blogs_with_status_1' => Blog::where('status', 1)->count(),
            'blogs_with_type_blog' => Blog::where('type', 'blog')->count(),
            'blogs_with_type_news' => Blog::where('type', 'news')->count(),
            'blogs_with_status_1_and_type_news' => Blog::where('status', 1)->where('type', 'news')->count(),
            'news_paginated_count' => $news_paginated->count(),
            'news_paginated_items' => $news_paginated->items(),
            'news_without_select' => $news_without_select,
        ]);
    }
}
