<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaKitItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'file_path',
        'file_size',
        'file_format',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
