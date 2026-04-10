<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedbacks';
    protected $guarded= [];
    use HasFactory;
    public function survey(){
        return $this->belongsTo(Survey::class);
    }
    public function feedback_responses(){
        return $this->hasMany(FeedbackResponse::class);
    }
    public function questions(){
        return $this->hasMany(Question::class);
    }
    public function answers(){
        return $this->hasMany(Answer::class);
    }
}
