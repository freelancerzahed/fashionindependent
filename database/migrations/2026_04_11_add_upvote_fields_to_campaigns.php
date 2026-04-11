<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // Add upvote tracking fields
            $table->integer('upvote_goal')->default(5000)->after('days_active')->comment('Target number of upvotes for campaign');
            $table->integer('upvote_count')->default(0)->after('upvote_goal')->comment('Current number of upvotes received');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['upvote_goal', 'upvote_count']);
        });
    }
};
