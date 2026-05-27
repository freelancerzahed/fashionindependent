<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\Campaign;
use App\Models\CampaignQuestion;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CampaignQuestionStatisticsController extends Controller
{
    /**
     * Get aggregated statistics for all questions in a campaign
     * 
     * GET /api/v2/campaign/{id}/question-statistics
     */
    public function getStatistics(Request $request, $campaignId)
    {
        try {
            // Fetch campaign
            $campaign = Campaign::find($campaignId);
            if (!$campaign) {
                return response()->json([
                    'status' => false,
                    'message' => 'Campaign not found',
                ], 404);
            }

            // Get all questions for this campaign
            $questions = $campaign->questions()->with('responses')->get();

            if ($questions->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'data' => [
                        'campaign_id' => $campaignId,
                        'total_responses' => 0,
                        'questions' => [],
                    ],
                ]);
            }

            // Tally responses for each question
            $questionsData = [];
            $totalResponses = 0;

            foreach ($questions as $question) {
                $responses = $question->responses()
                    ->selectRaw('answer, COUNT(*) as count')
                    ->groupBy('answer')
                    ->get();

                $responseCounts = [];
                $questionTotal = 0;

                foreach ($responses as $response) {
                    $responseCounts[$response->answer] = (int) $response->count;
                    $questionTotal += $response->count;
                }

                $totalResponses += $questionTotal;

                // Find most popular answer
                $mostPopularAnswer = null;
                $mostPopularCount = 0;
                foreach ($responseCounts as $answer => $count) {
                    if ($count > $mostPopularCount) {
                        $mostPopularCount = $count;
                        $mostPopularAnswer = $answer;
                    }
                }

                $questionsData[] = [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'question_type' => $question->question_type,
                    'total_responses' => $questionTotal,
                    'response_counts' => $responseCounts,
                    'most_popular_answer' => $mostPopularAnswer,
                    'most_popular_count' => $mostPopularCount,
                ];
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'campaign_id' => $campaignId,
                    'total_responses' => $totalResponses,
                    'total_questions' => count($questionsData),
                    'questions' => $questionsData,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching question statistics: ' . $e->getMessage(),
            ], 500);
        }
    }
}
