<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackResponse extends Model
{
    use HasFactory;
   
    protected $guarded= [];
    public function feedback(){
        return $this->belongsTo(Feedback::class);
    }
    public function question(){
        return $this->belongsTo(Question::class);
        
    }
    public function answer(){
        return $this->belongsTo(Answer::class);
        
    }
}
