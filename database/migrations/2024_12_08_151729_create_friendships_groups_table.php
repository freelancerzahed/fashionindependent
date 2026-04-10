<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Class CreateFriendshipsGroupsTable
 */
class CreateFriendshipsGroupsTable extends Migration
{

    public function up() {
        $table_name = config('friendships.tables.fr_groups_pivot');
        if (!Schema::hasTable($table_name)) {
            Schema::create($table_name, function (Blueprint $table) {

                $table->integer('friendship_id')->unsigned();
                $table->morphs('friend');
                $table->integer('group_id')->unsigned();

                $table->foreign('friendship_id')
                    ->references('id')
                    ->on(config('friendships.tables.fr_pivot'))
                    ->onDelete('cascade');

                $table->unique(['friendship_id', 'friend_id', 'friend_type', 'group_id'], 'unique');

            });
        }
    }

    public function down() {
        Schema::dropIfExists(config('friendships.tables.fr_groups_pivot'));
    }

}