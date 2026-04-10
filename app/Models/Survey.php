<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $guarded = [];


    use HasFactory;
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function questions(){
      return $this->hasMany(Question::class);
    }
    public function feedbacks(){
        return $this->hasMany(Feedback::class);
    }
}
