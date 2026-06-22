<?php

namespace App\Http\Controllers\Api\v2;

use App\Http\Controllers\Controller;
use App\Http\Resources\V2\BlogCollection;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function blog_list(Request $request)
    {
        $selected_categories = array();
        $search = null;
        
        // Build base query without select first to avoid pagination issues
        $blogs = Blog::with('category:id,category_name')
            ->where('status', 1);

        if ($request->has('search')) {
            $search = $request->search;
            $blogs->where(function ($q) use ($search) {
                foreach (explode(' ', trim($search)) as $word) {
                    $q->where('title', 'like', '%' . $word . '%')
                        ->orWhere('short_description', 'like', '%' . $word . '%');
                }
            });

            $case1 = $search . '%';
            $case2 = '%' . $search . '%';

            $blogs->orderByRaw("CASE 
                WHEN title LIKE '$case1' THEN 1 
                WHEN title LIKE '$case2' THEN 2 
                ELSE 3 
                END");
        }

        if ($request->has('selected_categories')) {
            $selected_categories = $request->selected_categories;
            $blog_categories = BlogCategory::whereIn('slug', $selected_categories)->pluck('id')->toArray();
            $blogs->whereIn('category_id', $blog_categories);
        }

        // Apply ordering only if not from search
        if (!$request->has('search')) {
            $blogs->orderBy('created_at', 'desc');
        }

        // Now select columns and paginate
        $blogs = $blogs->select('id', 'title', 'slug', 'short_description', 'banner', 'category_id', 'status', 'created_at')
            ->paginate(12);

        // Fetch recent blogs separately
        $recent_blogs = Blog::with('category:id,category_name')
            ->select('id', 'title', 'slug', 'short_description', 'banner', 'category_id', 'status', 'created_at')
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->limit(9)
            ->get();

        return response()->json([
            'result' => true,
            'blogs' => new BlogCollection($blogs),
            'selected_categories' => $selected_categories,
            'search' => $search,
            'recent_blogs' => $recent_blogs
        ])->header('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    }

    public function blog_details($slug)
    {
        $blog = Blog::where('slug', $slug)->first();
        $recent_blogs = Blog::where('status', 1)->orderBy('created_at', 'desc')->limit(9)->get();
        
        // Transform blog data to include full image URLs
        if ($blog) {
            $blog->featured_image = $blog->banner ? uploaded_asset($blog->banner) : null;
            $blog->content = $blog->description;
        }
        
        return response()->json([
            'result' => true,
            'blog' => $blog,
            'recent_blogs' => $recent_blogs,
        ]);
    }

    public function news_list(Request $request)
    {
        // Write to a debug file to see if this code is executing
        file_put_contents(storage_path('logs/debug.log'), date('Y-m-d H:i:s') . " - news_list called\n", FILE_APPEND);
        
        $perPage = (int) $request->get('per_page', 10);
        $perPage = min($perPage, 100);
        $page = (int) $request->get('page', 1);

        // Enable query logging
        \DB::enableQueryLog();
        
        $query = Blog::where('status', 1)
            ->where('type', 'news')
            ->select('id', 'title', 'slug', 'short_description', 'banner', 'category_id', 'status', 'created_at', 'type')
            ->orderBy('created_at', 'desc');
        
        // Get raw query before pagination
        $allResults = $query->get();
        $queries = \DB::getQueryLog();
        file_put_contents(storage_path('logs/debug.log'), date('Y-m-d H:i:s') . " - Query executed: " . ($queries ? json_encode(end($queries)) : 'no queries') . "\n", FILE_APPEND);
        file_put_contents(storage_path('logs/debug.log'), date('Y-m-d H:i:s') . " - Results count: " . $allResults->count() . " items\n", FILE_APPEND);
        
        // Now paginate
        $news = $query->paginate($perPage, '*', 'page', $page);
        $items = $news->items();

        file_put_contents(storage_path('logs/debug.log'), date('Y-m-d H:i:s') . " - Pagination returned: " . count($items) . " items\n", FILE_APPEND);

        $response = [
            'result' => true,
            'data' => $items,
            'pagination' => [
                'page' => $news->currentPage(),
                'per_page' => $news->perPage(),
                'total' => $news->total(),
                'total_pages' => $news->lastPage(),
                'has_more' => $news->hasMorePages(),
            ],
        ];

        return response()->json($response)
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '-1')
            ->header('ETag', md5(json_encode($response)));
    }

    public function test()
    {
        return response()->json([
            'result' => true,
            'message' => 'okk...',
        ]);
    }
}
