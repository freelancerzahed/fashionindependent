<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignQuestionResponse extends Model
{
    use HasFactory;

    protected $table = 'campaign_question_responses';

    protected $fillable = [
        'campaign_question_id',
        'user_id',
        'answer'
    ];

    /**
     * Get the question this response belongs to
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(CampaignQuestion::class, 'campaign_question_id');
    }

    /**
     * Get the user who gave this response
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
