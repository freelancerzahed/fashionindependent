<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    protected $fillable = [
        'creator_id',
        'user_id',
        'status',
        'rejection_reason',
        'title',
        'description',
        'funding_goal',
        'current_funding',
        'backer_count',
        'days_active',
        'product_name',
        'product_description',
        'materials',
        'colors',
        'sizes',
        'product_images',
        'tech_pack_file',
        'tech_pack_purchased',
        'tech_pack_cost',
        'launch_date',
        'end_date',
        'expected_delivery_date',
        'actual_delivery_date',
        'manufacturing_location',
        'manufacturing_partner',
        'delivery_notes',
        'minimum_pledges',
        'minimum_pledge_amount',
        'allow_overfunding',
        'upvote_goal',
        'upvote_count',
        'views',
        'shares',
        'previous_sales',
        'existing_inventory',
        'manufacturer_restock',
        'manufacturing_assistance',
        'business_registration',
    ];

    protected $casts = [
        'funding_goal' => 'decimal:2',
        'current_funding' => 'decimal:2',
        'tech_pack_cost' => 'decimal:2',
        'minimum_pledge_amount' => 'decimal:2',
        'upvote_goal' => 'integer',
        'upvote_count' => 'integer',
        'materials' => 'array',
        'colors' => 'array',
        'sizes' => 'array',
        'product_images' => 'array',
        'previous_sales' => 'array',
        'existing_inventory' => 'array',
        'manufacturer_restock' => 'array',
        'manufacturing_assistance' => 'array',
        'business_registration' => 'array',
        'tech_pack_purchased' => 'boolean',
        'allow_overfunding' => 'boolean',
        'launch_date' => 'datetime',
        'end_date' => 'datetime',
        'expected_delivery_date' => 'datetime',
        'actual_delivery_date' => 'datetime',
    ];

    /**
     * Get the creator for this campaign.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    /**
     * Get the user (campaign owner).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all pledges for this campaign.
     */
    public function pledges(): HasMany
    {
        return $this->hasMany(Pledge::class);
    }

    /**
     * Get all feedback for this campaign.
     */
    public function feedback(): HasMany
    {
        return $this->hasMany(CampaignFeedback::class);
    }

    /**
     * Get all questions for this campaign.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(CampaignQuestion::class);
    }

    /**
     * Check if campaign is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'live' && $this->end_date > now();
    }

    /**
     * Check if campaign funding goal is met.
     */
    public function isFunded(): bool
    {
        return $this->current_funding >= $this->funding_goal;
    }

    /**
     * Get funding percentage.
     */
    public function getFundingPercentage(): int
    {
        if ($this->funding_goal == 0) {
            return 0;
        }
        return min(100, (int) (($this->current_funding / $this->funding_goal) * 100));
    }

    /**
     * Get days remaining.
     */
    public function getDaysRemaining(): int
    {
        if (!$this->end_date) {
            return 0;
        }
        $days = now()->diffInDays($this->end_date, false);
        return max(0, $days);
    }
}
