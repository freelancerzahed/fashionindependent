<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Resources\V2\CategoryCollection;
use App\Models\BusinessSetting;
use App\Models\Category;
use Cache;

class CategoryController extends Controller
{

    public function index($parent_id = 0)
    {
        if (request()->has('parent_id') && request()->parent_id) {
            $category = Category::where('slug', request()->parent_id)->first();
            $parent_id = $category->id;
        }

        // return Cache::remember("app.categories-$parent_id", 86400, function () use ($parent_id) {
            return new CategoryCollection(Category::where('parent_id', $parent_id)->whereDigital(0)->get());
        // });
    }

    public function info($slug)
    {
        return new CategoryCollection(Category::where('slug', $slug)->get());
    }

    public function featured()
    {
        return Cache::remember('app.featured_categories', 86400, function () {
            return new CategoryCollection(Category::where('featured', 1)->get());
        });
    }

    public function home()
    {
        return Cache::remember('app.home_categories', 86400, function () {
            return new CategoryCollection(Category::whereIn('id', json_decode(get_setting('home_categories')))->get());
        });
    }

    public function top()
    {
        return Cache::remember('app.top_categories', 86400, function () {
            return new CategoryCollection(Category::whereIn('id', json_decode(get_setting('home_categories')))->limit(20)->get());
        });
    }

    /**
     * Get categories for menu display with hierarchical structure
     * Used for header and navigation menus
     */
    public function menu()
    {
        $categories = Cache::remember('app.menu_categories', 3600, function () {
            return Category::where('parent_id', 0)
                ->where('digital', 0)
                ->select('id', 'name', 'slug')
                ->with(['categories:id,parent_id,name,slug'])
                ->orderBy('order_level', 'desc')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => (string)$category->id,
                        'name' => $category->name,
                        'href' => "/category/{$category->slug}",
                        'subcategories' => $category->categories
                            ->sortByDesc('order_level')
                            ->map(function ($sub) {
                                return [
                                    'id' => (string)$sub->id,
                                    'name' => $sub->name,
                                    'href' => "/category/{$sub->slug}",
                                ];
                            })
                            ->values()
                            ->toArray(),
                    ];
                })
                ->values();
        });

        return response()->json([
            'result' => true,
            'categories' => $categories,
            'status' => 200,
        ])->header('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    }
}
