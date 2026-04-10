<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $guarded = [];
    protected $fillable = ['survey_id','question','orders','type','editional_info'];

    
    use HasFactory;
    public function survey(){
     return $this->belongsTo(Survey::class);
    }
    public function answers(){
    return $this->hasMany(Answer::class);
    }
    public function responses(){
        return $this->hasMany(FeedbackResponse::class);
    }


}
