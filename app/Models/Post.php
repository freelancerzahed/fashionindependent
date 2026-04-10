<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Post extends Model
{
    protected $with = ['user', 'likes', 'comments'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'media' => $this->media ? uploaded_asset($this->media) : null,
            'media_url' => $this->media ? uploaded_asset($this->media) : null,
            'is_video' => $this->media ? is_video($this->media) : false,
            'created_at_diff' => $this->created_at->diffForHumans(),
            'user' => [
                'name' => $this->user->name,
                'user_name' => $this->user->user_name,
                'avatar_url' => $this->user->avatar ? uploaded_asset($this->user->avatar) : null,
            ],
            'likes_count' => $this->likes()->where('type', 'like')->count(),
            'loves_count' => $this->likes()->where('type', 'love')->count(),
            'flags_count' => $this->likes()->where('type', 'flag')->count(),
            'user_liked' => $this->likes()->where('user_id', auth()->id())->where('type', 'like')->exists(),
            'user_loved' => $this->likes()->where('user_id', auth()->id())->where('type', 'love')->exists(),
            'user_flagged' => $this->likes()->where('user_id', auth()->id())->where('type', 'flag')->exists(),
            'comments' => $this->comments()->where('parent_id', null)->get()->toArray(),
        ];
    }
}
