<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pledge extends Model
{
    protected $fillable = [
        'campaign_id',
        'backer_id',
        'amount',
        'status',
        'reward_tier',
        'reward_details',
        'transaction_id',
        'payment_method',
        'paid_at',
        'delivered',
        'delivered_at',
        'shipping_address',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'reward_details' => 'array',
        'paid_at' => 'datetime',
        'delivered' => 'boolean',
        'delivered_at' => 'datetime',
    ];

    /**
     * Get the campaign for this pledge.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Get the backer (user) for this pledge.
     */
    public function backer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'backer_id');
    }

    /**
     * Check if pledge is confirmed/paid.
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
