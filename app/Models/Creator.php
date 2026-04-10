<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Creator extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'rejection_reason',
        'brand_name',
        'bio',
        'profile_image',
        'has_inventory',
        'has_tech_pack',
        'verified',
        'accepted_terms',
        'accepted_collaboration_agreement',
        'accepted_delivery_obligation',
        'terms_accepted_at',
        'total_campaigns',
        'successful_campaigns',
        'total_funded',
        'rating',
        'bank_account',
        'bank_name',
        'account_holder',
        'routing_number',
        'swiftcode',
    ];

    protected $casts = [
        'has_inventory' => 'boolean',
        'has_tech_pack' => 'boolean',
        'verified' => 'boolean',
        'accepted_terms' => 'boolean',
        'accepted_collaboration_agreement' => 'boolean',
        'accepted_delivery_obligation' => 'boolean',
        'terms_accepted_at' => 'datetime',
        'total_funded' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    /**
     * Get the user that owns the creator profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all campaigns by this creator.
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    /**
     * Get all documents by this creator.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(CreatorDocument::class);
    }

    /**
     * Check if creator is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if creator has met requirements.
     */
    public function hasMetRequirements(): bool
    {
        return $this->has_inventory && ($this->has_tech_pack || true); // Tech pack can be purchased
    }
}
