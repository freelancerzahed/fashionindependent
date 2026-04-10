<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CampaignController extends Controller
{
    public function __construct()
    {
        // Staff Permission Check
        $this->middleware(['permission:view_campaigns'])->only('index');
        $this->middleware(['permission:edit_campaign'])->only('edit', 'update');
        $this->middleware(['permission:approve_campaign'])->only('approve', 'reject');
        $this->middleware(['permission:delete_campaign'])->only('destroy');
    }

    /**
     * Display a listing of campaigns.
     */
    public function index(Request $request)
    {
        $sort_search = null;
        $status_filter = null;
        $per_page = $request->get('per_page', 15);
        
        // Validate per_page value
        $per_page = in_array($per_page, [10, 15, 25, 50]) ? $per_page : 15;
        
        $campaigns = Campaign::select('id', 'user_id', 'creator_id', 'title', 'description', 'status', 'funding_goal', 'current_funding', 'created_at')
            ->with([
                'user:id,name,email',
                'creator:id,brand_name,user_id'
            ])
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search != '') {
            $sort_search = $request->search;
            $campaigns = $campaigns->where('title', 'like', '%' . $sort_search . '%')
                ->orWhere('description', 'like', '%' . $sort_search . '%');
        }

        if ($request->has('status') && $request->status != '') {
            $status_filter = $request->status;
            $campaigns = $campaigns->where('status', $status_filter);
        }

        // Get status counts for the sidebar/filter
        $status_counts = Campaign::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $campaigns = $campaigns->paginate($per_page)->appends($request->query());
        
        return view('backend.campaigns.index', compact('campaigns', 'sort_search', 'status_filter', 'status_counts', 'per_page'));
    }

    /**
     * Show campaign details.
     */
    public function show($id)
    {
        $campaign = Campaign::with(['user', 'creator', 'pledges'])
            ->findOrFail($id);
        
        return view('backend.campaigns.show', compact('campaign'));
    }

    /**
     * Show the form for editing the campaign.
     */
    public function edit($id)
    {
        $campaign = Campaign::findOrFail($id);
        return view('backend.campaigns.edit', compact('campaign'));
    }

    /**
     * Update the campaign in storage.
     */
    public function update(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,pending,active,live,completed,failed,cancelled',
            'funding_goal' => 'nullable|numeric|min:0',
            'current_funding' => 'nullable|numeric|min:0',
            'rejection_reason' => 'nullable|string',
            'expected_delivery_date' => 'nullable|date',
            'actual_delivery_date' => 'nullable|date',
            'tech_pack_file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,zip|max:10240',
            'materials' => 'nullable|string',
            'colors' => 'nullable|string',
            'sizes' => 'nullable|string',
        ]);

        // Handle tech pack file upload
        if ($request->hasFile('tech_pack_file')) {
            // Delete old file if exists
            if ($campaign->tech_pack_file && Storage::disk('public')->exists($campaign->tech_pack_file)) {
                Storage::disk('public')->delete($campaign->tech_pack_file);
            }

            // Store new file
            $file = $request->file('tech_pack_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $filePath = Storage::disk('public')->putFileAs('campaigns/tech-pack', $file, $filename);
            $validated['tech_pack_file'] = $filePath;
        }

        // Convert comma-separated strings to arrays
        if (isset($validated['materials']) && $validated['materials']) {
            $validated['materials'] = array_map('trim', explode(',', $validated['materials']));
        }
        if (isset($validated['colors']) && $validated['colors']) {
            $validated['colors'] = array_map('trim', explode(',', $validated['colors']));
        }
        if (isset($validated['sizes']) && $validated['sizes']) {
            $validated['sizes'] = array_map('trim', explode(',', $validated['sizes']));
        }

        $campaign->update($validated);

        flash(translate('Campaign has been updated successfully'))->success();
        return redirect()->route('admin.campaigns.index');
    }

    /**
     * Approve a campaign.
     */
    public function approve(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->status = 'active';
        $campaign->rejection_reason = null;
        $campaign->save();

        flash(translate('Campaign has been approved successfully'))->success();
        return back();
    }

    /**
     * Reject a campaign with reason.
     */
    public function reject(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);
        
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $campaign->status = 'cancelled';
        $campaign->rejection_reason = $request->rejection_reason;
        $campaign->save();

        flash(translate('Campaign has been rejected successfully'))->success();
        return back();
    }

    /**
     * Mark campaign as live (start the campaign).
     */
    public function markLive($id)
    {
        $campaign = Campaign::findOrFail($id);
        
        if ($campaign->status !== 'active') {
            flash(translate('Campaign must be approved first'))->error();
            return back();
        }

        $campaign->status = 'live';
        $campaign->launch_date = now();
        $campaign->save();

        flash(translate('Campaign is now live'))->success();
        return back();
    }

    /**
     * Mark campaign as completed.
     */
    public function markCompleted($id)
    {
        $campaign = Campaign::findOrFail($id);
        
        $campaign->status = 'completed';
        $campaign->actual_delivery_date = now();
        $campaign->save();

        flash(translate('Campaign marked as completed'))->success();
        return back();
    }

    /**
     * Delete a campaign.
     */
    public function destroy($id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        flash(translate('Campaign has been deleted successfully'))->success();
        return redirect()->route('admin.campaigns.index');
    }

    /**
     * Get campaign statistics.
     */
    public function statistics()
    {
        $stats = [
            'total' => Campaign::count(),
            'pending' => Campaign::where('status', 'pending')->count(),
            'active' => Campaign::where('status', 'active')->count(),
            'live' => Campaign::where('status', 'live')->count(),
            'completed' => Campaign::where('status', 'completed')->count(),
            'cancelled' => Campaign::where('status', 'cancelled')->count(),
            'total_funding' => Campaign::sum('current_funding'),
            'total_goal' => Campaign::sum('funding_goal'),
        ];

        return view('backend.campaigns.statistics', compact('stats'));
    }

    /**
     * Handle image uploads for campaign.
     */
    public function uploadImages(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);

        $request->validate([
            'product_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'image_metadata' => 'nullable|json',
        ]);

        $productImages = $campaign->product_images ?? [];

        // Handle file uploads
        if ($request->hasFile('product_images')) {
            foreach ($request->file('product_images') as $index => $file) {
                if ($file && $file->isValid()) {
                    // Store file in campaigns/product-images directory
                    $filename = 'campaigns/product-images/' . Str::uuid() . '.' . $file->getClientOriginalExtension();
                    $filePath = Storage::disk('public')->putFileAs('', $file, $filename);

                    // Get image metadata if provided
                    $metadata = [];
                    if ($request->has('image_metadata')) {
                        $imageMeta = json_decode($request->input('image_metadata'), true);
                        if (isset($imageMeta[$index])) {
                            $metadata = $imageMeta[$index];
                        }
                    }

                    // Add image to product_images array
                    $productImages[] = [
                        'path' => $filePath,
                        'type' => $metadata['type'] ?? 'additional',
                        'name' => $metadata['name'] ?? $file->getClientOriginalName(),
                    ];
                }
            }
        }

        $campaign->update([
            'product_images' => $productImages,
        ]);

        flash(translate('Campaign images have been uploaded successfully'))->success();
        return back();
    }

    /**
     * Delete a campaign image.
     */
    public function deleteImage($campaignId, $imageIndex)
    {
        $campaign = Campaign::findOrFail($campaignId);
        $productImages = $campaign->product_images ?? [];

        if (isset($productImages[$imageIndex])) {
            // Delete file from storage
            if (isset($productImages[$imageIndex]['path'])) {
                Storage::disk('public')->delete($productImages[$imageIndex]['path']);
            }

            // Remove from array
            array_splice($productImages, $imageIndex, 1);

            $campaign->update([
                'product_images' => $productImages,
            ]);

            flash(translate('Image has been deleted successfully'))->success();
        }

        return back();
    }

    /**
     * Get image storage URL.
     */
    private function getImageUrl($imagePath)
    {
        if (!$imagePath) {
            return null;
        }

        // If it's already a full URL, return it
        if (str_starts_with($imagePath, 'http')) {
            return $imagePath;
        }

        // Convert to storage URL
        return asset('storage/' . $imagePath);
    }
}
