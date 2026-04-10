<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFriendshipsTable extends Migration
{

    public function up() {
        $table_name = config('friendships.tables.fr_pivot');
        if (!Schema::hasTable($table_name)) {
            Schema::create($table_name, function (Blueprint $table) {
                $table->increments('id');
                $table->morphs('sender');
                $table->morphs('recipient');
                $table->tinyInteger('status')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down() {
        Schema::dropIfExists(config('friendships.tables.fr_pivot'));
    }

}