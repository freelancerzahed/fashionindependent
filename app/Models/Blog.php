<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\PreventDemoModeChanges;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use PreventDemoModeChanges;

    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'category_id',
        'status',
        'type',
        'banner',
        'meta_title',
        'meta_img',
        'meta_description',
        'meta_keywords',
    ];
    
    public function category() {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

}
