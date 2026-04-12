<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignFeedback extends Model
{
    use HasFactory;

    protected $table = 'campaign_feedback';

    protected $fillable = [
        'campaign_id',
        'user_id',
        'comment',
        'rating'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];

    /**
     * Get the campaign this feedback is for
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Get the user who left the feedback
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
