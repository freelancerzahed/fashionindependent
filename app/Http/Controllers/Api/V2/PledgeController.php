<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Pledge;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PledgeController extends Controller
{
    /**
     * Create a pledge
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:0.01',
            'reward_tier' => 'nullable|string',
            'shipping_address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $campaign = Campaign::find($request->campaign_id);

        if (!$campaign) {
            return response()->json([
                'status' => false,
                'message' => 'Campaign not found'
            ], 404);
        }

        if (!$campaign->isActive()) {
            return response()->json([
                'status' => false,
                'message' => 'This campaign is not active'
            ], 400);
        }

        try {
            $pledge = Pledge::create([
                'campaign_id' => $campaign->id,
                'backer_id' => $user->id,
                'amount' => $request->amount,
                'status' => 'pending',
                'reward_tier' => $request->reward_tier,
                'shipping_address' => $request->shipping_address,
            ]);

            Log::info('Pledge created', ['pledge_id' => $pledge->id, 'campaign_id' => $campaign->id]);

            return response()->json([
                'status' => true,
                'message' => 'Pledge created successfully',
                'pledge' => $pledge
            ], 201);
        } catch (\Exception $e) {
            Log::error('Pledge creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Pledge creation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pledges by campaign
     */
    public function getCampaignPledges(Request $request, $campaignId)
    {
        $campaign = Campaign::find($campaignId);

        if (!$campaign) {
            return response()->json([
                'status' => false,
                'message' => 'Campaign not found'
            ], 404);
        }

        $pledges = Pledge::where('campaign_id', $campaignId)
            ->with('backer')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'pledges' => $pledges,
            'total_pledges' => count($pledges),
            'total_amount' => $pledges->sum('amount'),
        ]);
    }

    /**
     * Get pledges by user (backer)
     */
    public function getUserPledges(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $pledges = Pledge::where('backer_id', $user->id)
            ->with(['campaign', 'campaign.creator'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'pledges' => $pledges,
            'total_pledges' => count($pledges),
        ]);
    }

    /**
     * Update pledge status (admin only)
     */
    public function updateStatus(Request $request, $pledgeId)
    {
        $pledge = Pledge::find($pledgeId);

        if (!$pledge) {
            return response()->json([
                'status' => false,
                'message' => 'Pledge not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,paid,refunded,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $pledge->update([
                'status' => $request->status,
                'paid_at' => $request->status === 'paid' ? now() : $pledge->paid_at,
            ]);

            Log::info('Pledge status updated', ['pledge_id' => $pledge->id, 'status' => $request->status]);

            return response()->json([
                'status' => true,
                'message' => 'Pledge status updated',
                'pledge' => $pledge
            ]);
        } catch (\Exception $e) {
            Log::error('Pledge update failed', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
