<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorDocument extends Model
{
    protected $fillable = [
        'creator_id',
        'document_type',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'status',
        'uploaded_at',
        'verified_at',
        'notes',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'uploaded_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    /**
     * Get the creator that owns this document.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    /**
     * Scope to get documents by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('document_type', $type);
    }

    /**
     * Scope to get verified documents.
     */
    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    /**
     * Scope to get pending documents.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
