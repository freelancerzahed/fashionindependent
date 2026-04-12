<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampaignQuestion extends Model
{
    use HasFactory;

    protected $table = 'campaign_questions';

    protected $fillable = [
        'campaign_id',
        'question_text',
        'question_type',
        'options'
    ];

    protected $casts = [
        'options' => 'array'
    ];

    /**
     * Get the campaign this question belongs to
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Get responses to this question
     */
    public function responses(): HasMany
    {
        return $this->hasMany(CampaignQuestionResponse::class, 'campaign_question_id');
    }

    /**
     * Get aggregated response statistics
     */
    public function getResponseStats()
    {
        return $this->responses()
            ->groupBy('answer')
            ->selectRaw('answer, count(*) as count')
            ->get();
    }
}
