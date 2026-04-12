<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Pledge;
use App\Models\User;
use App\Models\Feedback;
use App\Models\Question;
use App\Models\FeedbackResponse;
use App\Models\CampaignQuestion;
use App\Models\CampaignQuestionResponse;
use App\Models\CampaignFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    /**
     * Get comprehensive analytics for creator's campaigns
     */
    public function getCreatorAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Fetch all campaigns for this creator
            $campaigns = Campaign::where('user_id', $user->id)
                ->with(['pledges.backer', 'pledges.campaign'])
                ->get();

            if ($campaigns->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'analytics' => $this->getEmptyAnalyticsStructure()
                ]);
            }

            // Calculate comprehensive analytics
            $analytics = [
                // Overview metrics
                'totalCampaigns' => $campaigns->count(),
                'totalEarnings' => (float) $campaigns->sum('current_funding'),
                'totalBackers' => $campaigns->sum('backer_count'),
                'conversionRate' => $this->calculateConversionRate($campaigns),
                
                // Campaign performance
                'activeCampaigns' => $campaigns->where('status', 'live')->count(),
                'activeSales' => (float) $campaigns->where('status', 'live')->sum('current_funding'),
                'activeShowcases' => $campaigns->where('status', 'live')->count(),
                'recentlyClosed' => $campaigns->where('status', 'completed')->count(),
                
                // Backer metrics
                'totalDonations' => 0,
                'outboundBounces' => 0,
                'averageOrderValue' => 0,
                
                // Product analytics - Sizing breakdown
                'sizingBreakdown' => $this->calculateSizingBreakdown($campaigns),
                
                // Campaign questions and responses
                'questionResponses' => $this->aggregateQuestionResponses($campaigns),
                
                // Engagement metrics
                'upvotes' => (int) $campaigns->sum('upvote_count'),
                'returns' => $this->calculateReturns($campaigns),
                'returnRate' => 0,
                
                // Demographics
                'demographics' => $this->aggregateDemographics($campaigns),
                
                // Customer insights
                'uniqueCustomers' => $this->countUniqueCustomers($campaigns),
                'repeatCustomers' => $this->countRepeatCustomers($campaigns),
                'earlyAdopters' => $this->countEarlyAdopters($campaigns),
                'feedbackComments' => $this->countFeedbackComments($campaigns),
                
                // Customer details
                'customers' => $this->getCustomersList($campaigns),
                'feedbackList' => $this->getFeedbackList($campaigns)
            ];

            // Calculate derived metrics
            $analytics['totalDonations'] = count($this->getAllPledges($campaigns));
            $analytics['averageOrderValue'] = $analytics['totalBackers'] > 0 
                ? round($analytics['totalEarnings'] / $analytics['totalBackers'], 2)
                : 0;
            $analytics['returnRate'] = $analytics['totalDonations'] > 0
                ? round(($analytics['returns'] / $analytics['totalDonations']) * 100, 2)
                : 0;

            return response()->json([
                'status' => true,
                'analytics' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Analytics error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to load analytics',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Health check endpoint for diagnosing API issues
     */
    public function healthCheck(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'status' => true,
            'message' => 'Analytics API is running',
            'timestamp' => now()->toIso8601String(),
            'authenticated' => $user !== null,
            'user' => $user ? [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name
            ] : null,
            'database' => [
                'campaigns' => Campaign::count(),
                'pledges' => Pledge::count(),
                'feedback' => CampaignFeedback::count(),
            ]
        ]);
    }

    /**
     * Calculate conversion rate
     */
    private function calculateConversionRate($campaigns)
    {
        $totalViews = $campaigns->sum('views') ?: 1;
        $totalBackers = $campaigns->sum('backer_count');
        $conversionRate = ($totalBackers / $totalViews) * 100;
        
        return round($conversionRate, 2);
    }

    /**
     * Calculate sizing breakdown from all campaigns
     */
    private function calculateSizingBreakdown($campaigns)
    {
        $sizingData = [];
        
        foreach ($campaigns as $campaign) {
            try {
                // Check if sizing data is stored in campaign
                $sizes = $campaign->sizes;
                if ($sizes) {
                    // Ensure it's an array
                    $sizes = is_array($sizes) ? $sizes : (is_string($sizes) ? [$sizes] : []);
                    
                    foreach ($sizes as $size) {
                        // Skip empty or null values
                        if (empty($size)) continue;
                        
                        $sizeName = null;
                        $count = 1;
                        
                        if (is_array($size) && isset($size['name'])) {
                            $sizeName = strval($size['name']);
                            $count = intval($size['count'] ?? 1);
                        } elseif (is_string($size)) {
                            $sizeName = trim($size);
                        } elseif (is_object($size)) {
                            $sizeName = $size->name ?? strval($size);
                        }
                        
                        if ($sizeName && strlen($sizeName) > 0) {
                            $sizingData[$sizeName] = ($sizingData[$sizeName] ?? 0) + $count;
                        }
                    }
                }

                // Also aggregate from pledges if they have size data
                if ($campaign->pledges && count($campaign->pledges) > 0) {
                    foreach ($campaign->pledges as $pledge) {
                        $rewardDetails = $pledge->reward_details;
                        if ($rewardDetails && is_array($rewardDetails) && isset($rewardDetails['size'])) {
                            $size = strval($rewardDetails['size']);
                            if (!empty($size)) {
                                $sizingData[$size] = ($sizingData[$size] ?? 0) + 1;
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                // Skip sizing processing for this campaign if there's an error
                Log::warning('Sizing breakdown error for campaign ' . $campaign->id, ['error' => $e->getMessage()]);
                continue;
            }
        }

        return array_map(function($value) {
            return is_numeric($value) ? intval($value) : $value;
        }, $sizingData);
    }

    /**
     * Aggregate question responses from campaigns
     */
    private function aggregateQuestionResponses($campaigns)
    {
        $questionResponses = [];
        
        if ($campaigns->isEmpty()) {
            return $questionResponses;
        }
        
        $campaignIds = $campaigns->pluck('id')->toArray();

        try {
            // Fetch questions from new CampaignQuestion table
            $campaignQuestions = CampaignQuestion::whereIn('campaign_id', $campaignIds)
                ->get();
            
            foreach ($campaignQuestions as $question) {
                try {
                    // Get responses for this question
                    $responses = CampaignQuestionResponse::where('campaign_question_id', $question->id)
                        ->select('answer')
                        ->selectRaw('count(*) as count')
                        ->groupBy('answer')
                        ->get();

                    if ($responses && count($responses) > 0) {
                        $formattedResponses = [];
                        foreach ($responses as $r) {
                            if ($r && isset($r->answer)) {
                                $formattedResponses[] = [
                                    'answer' => strval($r->answer),
                                    'count' => intval($r->count ?? 1)
                                ];
                            }
                        }
                        
                        if (count($formattedResponses) > 0) {
                            $questionResponses[] = [
                                'question' => strval($question->question_text ?? 'Question'),
                                'responses' => $formattedResponses
                            ];
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning('Error processing question ' . $question->id, ['error' => $e->getMessage()]);
                    continue;
                }
            }
        } catch (\Exception $e) {
            Log::warning('Error fetching campaign questions', ['error' => $e->getMessage()]);
        }

        return $questionResponses;
    }

    /**
     * Calculate returns count
     */
    private function calculateReturns($campaigns)
    {
        $pledgeIds = $campaigns->flatMap(fn($c) => $c->pledges->pluck('id'))->toArray();
        
        return Pledge::whereIn('id', $pledgeIds)
            ->where('status', 'returned')
            ->count();
    }

    /**
     * Aggregate demographics from backers
     */
    private function aggregateDemographics($campaigns)
    {
        try {
            $pledges = $this->getAllPledges($campaigns);
            
            // Return empty structure if no pledges
            if (empty($pledges)) {
                return [
                    'ageGroups' => [],
                    'genders' => [],
                    'locations' => [],
                    'education' => [],
                    'incomeRanges' => []
                ];
            }
            
            $backerIds = collect($pledges)->pluck('backer_id')->unique()->toArray();
            
            if (empty($backerIds)) {
                return [
                    'ageGroups' => [],
                    'genders' => [],
                    'locations' => [],
                    'education' => [],
                    'incomeRanges' => []
                ];
            }

            // Fetch user profile data
            $users = User::whereIn('id', $backerIds)
                ->select('id', 'name', 'avatar', 'location', 'phone', 'country')
                ->get();

            // Group by location
            $locations = [];
            foreach ($users as $user) {
                $loc = null;
                if ($user->location && is_string($user->location)) {
                    $loc = trim($user->location);
                }
                if (!$loc && $user->country && is_string($user->country)) {
                    $loc = trim($user->country);
                }
                
                if ($loc && strlen($loc) > 0) {
                    $locations[$loc] = ($locations[$loc] ?? 0) + 1;
                }
            }

            // Sort by count and get top 10
            arsort($locations);
            $locations = array_slice($locations, 0, 10, true);

            return [
                'ageGroups' => [],
                'genders' => [],
                'locations' => $locations,
                'education' => [],
                'incomeRanges' => []
            ];
        } catch (\Exception $e) {
            Log::warning('Error aggregating demographics', ['error' => $e->getMessage()]);
            return [
                'ageGroups' => [],
                'genders' => [],
                'locations' => [],
                'education' => [],
                'incomeRanges' => []
            ];
        }
    }

    /**
     * Count unique customers
     */
    private function countUniqueCustomers($campaigns)
    {
        $pledges = $this->getAllPledges($campaigns);
        return collect($pledges)->pluck('backer_id')->unique()->count();
    }

    /**
     * Count repeat customers
     */
    private function countRepeatCustomers($campaigns)
    {
        $pledges = $this->getAllPledges($campaigns);
        $backerCounts = collect($pledges)->groupBy('backer_id')->map->count();
        
        return $backerCounts->filter(fn($count) => $count > 1)->count();
    }

    /**
     * Count early adopters
     */
    private function countEarlyAdopters($campaigns)
    {
        if ($campaigns->isEmpty()) {
            return 0;
        }

        $firstCampaignId = $campaigns->first()->id;
        $firstCampaignPledges = Pledge::where('campaign_id', $firstCampaignId)->pluck('backer_id')->toArray();

        // Early adopters are those who backed the first campaign
        return count($firstCampaignPledges);
    }

    /**
     * Count feedback comments
     */
    private function countFeedbackComments($campaigns)
    {
        try {
            $campaignIds = $campaigns->pluck('id')->toArray();
            
            // Count from new CampaignFeedback table
            $count = CampaignFeedback::whereIn('campaign_id', $campaignIds)->count();

            return $count;
        } catch (\Exception $e) {
            Log::warning('Error counting feedback comments', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * Get all pledges for campaigns
     */
    private function getAllPledges($campaigns)
    {
        return $campaigns->flatMap(fn($c) => $c->pledges)->all();
    }

    /**
     * Get customers list with details
     */
    private function getCustomersList($campaigns)
    {
        try {
            $pledges = $this->getAllPledges($campaigns);
            if (empty($pledges)) {
                return [];
            }
            
            $backerIds = collect($pledges)->pluck('backer_id')->unique()->toArray();
            if (empty($backerIds)) {
                return [];
            }

            $customers = [];
            foreach ($backerIds as $backerId) {
                try {
                    $backer = User::find($backerId);
                    if (!$backer) continue;

                    $backerPledges = collect($pledges)->filter(fn($p) => $p->backer_id == $backerId);
                    if ($backerPledges->isEmpty()) continue;

                    $totalSpent = $backerPledges->sum('amount');
                    $campaignsBacked = $backerPledges->pluck('campaign_id')->unique()->count();

                    $customers[] = [
                        'id' => strval($backerId),
                        'name' => $backer->name ?? 'Unknown',
                        'email' => $backer->email ?? 'N/A',
                        'totalSpent' => is_numeric($totalSpent) ? floatval($totalSpent) : 0.0,
                        'campaignsBacked' => intval($campaignsBacked),
                        'joinDate' => $backer->created_at ? $backer->created_at->toIso8601String() : '',
                        'isEarlyAdopter' => false
                    ];
                } catch (\Exception $e) {
                    Log::warning('Error processing backer ' . $backerId, ['error' => $e->getMessage()]);
                    continue;
                }
            }

            // Sort by total spent
            usort($customers, fn($a, $b) => floatval($b['totalSpent']) <=> floatval($a['totalSpent']));

            return array_slice($customers, 0, 100);
        } catch (\Exception $e) {
            Log::warning('Error getting customers list', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get feedback list
     */
    private function getFeedbackList($campaigns)
    {
        try {
            if ($campaigns->isEmpty()) {
                return [];
            }
            
            $campaignIds = $campaigns->pluck('id')->toArray();
            $feedback = [];

            // Get feedback from new CampaignFeedback table
            try {
                $campaignFeedbacks = CampaignFeedback::whereIn('campaign_id', $campaignIds)
                    ->with(['user'])
                    ->orderBy('created_at', 'desc')
                    ->limit(50)
                    ->get();

                foreach ($campaignFeedbacks as $cf) {
                    try {
                        $campaign = $campaigns->firstWhere('id', $cf->campaign_id);
                        
                        if ($cf->user) {
                            $feedback[] = [
                                'customerId' => strval($cf->user_id),
                                'customerName' => $cf->user->name ?? 'Unknown',
                                'comment' => strval($cf->comment ?? ''),
                                'date' => $cf->created_at ? $cf->created_at->toIso8601String() : '',
                                'campaign' => $campaign ? strval($campaign->title ?? 'Unknown Campaign') : 'Unknown Campaign'
                            ];
                        }
                    } catch (\Exception $e) {
                        Log::warning('Error processing campaign feedback ' . $cf->id, ['error' => $e->getMessage()]);
                        continue;
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Error fetching campaign feedback', ['error' => $e->getMessage()]);
            }

            // Remove duplicates and limit
            $uniqueFeedback = [];
            $seen = [];
            foreach ($feedback as $item) {
                $key = $item['customerId'] . '-' . substr(md5($item['comment']), 0, 8);
                if (!isset($seen[$key])) {
                    $seen[$key] = true;
                    $uniqueFeedback[] = $item;
                }
            }

            return array_slice($uniqueFeedback, 0, 50);
        } catch (\Exception $e) {
            Log::warning('Error getting feedback list', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get empty analytics structure
     */
    private function getEmptyAnalyticsStructure()
    {
        return [
            'totalCampaigns' => 0,
            'totalEarnings' => 0,
            'totalBackers' => 0,
            'conversionRate' => 0,
            'activeCampaigns' => 0,
            'activeSales' => 0,
            'activeShowcases' => 0,
            'recentlyClosed' => 0,
            'totalDonations' => 0,
            'outboundBounces' => 0,
            'averageOrderValue' => 0,
            'sizingBreakdown' => [],
            'questionResponses' => [],
            'upvotes' => 0,
            'returns' => 0,
            'returnRate' => 0,
            'demographics' => [
                'ageGroups' => [],
                'genders' => [],
                'locations' => [],
                'education' => [],
                'incomeRanges' => []
            ],
            'uniqueCustomers' => 0,
            'repeatCustomers' => 0,
            'earlyAdopters' => 0,
            'feedbackComments' => 0,
            'customers' => [],
            'feedbackList' => []
        ];
    }

    /**
     * Get campaign-specific analytics
     */
    public function getCampaignAnalytics(Request $request, $campaignId)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $campaign = Campaign::find($campaignId);
            if (!$campaign || $campaign->user_id !== $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Campaign not found or unauthorized'
                ], 404);
            }

            $pledges = $campaign->pledges()->with('backer')->get();

            $analytics = [
                'campaignId' => (int) $campaign->id,
                'campaignTitle' => $campaign->title,
                'totalPledges' => $pledges->count(),
                'totalFunding' => (float) $pledges->sum('amount'),
                'fundingGoal' => (float) $campaign->funding_goal,
                'fundingPercentage' => $campaign->getFundingPercentage(),
                'averagePledgeAmount' => $pledges->count() > 0 
                    ? round($pledges->sum('amount') / $pledges->count(), 2)
                    : 0,
                'backerList' => $pledges->map(function ($pledge) {
                    return [
                        'id' => (string) $pledge->backer_id,
                        'name' => $pledge->backer->name,
                        'email' => $pledge->backer->email,
                        'amount' => (float) $pledge->amount,
                        'status' => $pledge->status,
                        'date' => $pledge->created_at->toIso8601String()
                    ];
                })->toArray()
            ];

            return response()->json([
                'status' => true,
                'analytics' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Campaign analytics error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to load campaign analytics'
            ], 500);
        }
    }
}
