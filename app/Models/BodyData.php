<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BodyData extends Model
{
    protected $table = 'body_data';

    protected $fillable = [
        'user_id',
        'shape',
        'shape_keys',
        'slider_values',
        'alphanumeric_code',
    ];

    protected $casts = [
        'shape_keys'     => 'array',
        'slider_values'  => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function body_stat()
    {
        return $this->hasOne(BodyStat::class, 'body_data_id');
    }
}
