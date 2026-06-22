<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\PressRelease;
use App\Models\MediaKitItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PressController extends Controller
{
    /**
     * Get all press releases
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->get('per_page', 10);
            $perPage = min($perPage, 100);
            $page = (int) $request->get('page', 1);

            $releases = PressRelease::where('is_active', true)
                ->orderBy('published_date', 'desc')
                ->paginate($perPage, ['id', 'title', 'slug', 'excerpt', 'published_date'], 'page', $page);

            return response()->json([
                'status' => true,
                'data' => $releases->items(),
                'pagination' => [
                    'page' => $releases->currentPage(),
                    'per_page' => $releases->perPage(),
                    'total' => $releases->total(),
                    'total_pages' => $releases->lastPage(),
                    'has_more' => $releases->hasMorePages(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching press releases', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch press releases',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single press release by slug
     */
    public function show($slug)
    {
        try {
            $release = PressRelease::where('slug', $slug)
                ->where('is_active', true)
                ->first();

            if (!$release) {
                return response()->json([
                    'status' => false,
                    'message' => 'Press release not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $release
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching press release', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch press release',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get media kit files
     */
    public function mediaKit()
    {
        try {
            $items = MediaKitItem::where('is_active', true)
                ->select('id', 'name', 'file_size', 'file_format', 'description')
                ->get();

            return response()->json([
                'status' => true,
                'data' => $items
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching media kit', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch media kit',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

