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
        // Add analytics fields to campaigns table if they don't exist
        Schema::table('campaigns', function (Blueprint $table) {
            if (!Schema::hasColumn('campaigns', 'returns_count')) {
                $table->integer('returns_count')->default(0)->after('backer_count');
            }
            if (!Schema::hasColumn('campaigns', 'feedback_comments_count')) {
                $table->integer('feedback_comments_count')->default(0)->after('returns_count');
            }
            if (!Schema::hasColumn('campaigns', 'early_adopters_count')) {
                $table->integer('early_adopters_count')->default(0)->after('feedback_comments_count');
            }
            if (!Schema::hasColumn('campaigns', 'bounced_notifications')) {
                $table->integer('bounced_notifications')->default(0)->after('early_adopters_count');
            }
            if (!Schema::hasColumn('campaigns', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('bounced_notifications');
            }
        });

        // Create campaign_feedback table for storing campaign-specific feedback
        if (!Schema::hasTable('campaign_feedback')) {
            Schema::create('campaign_feedback', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('campaign_id');
                $table->unsignedInteger('user_id');
                $table->text('comment');
                $table->integer('rating')->nullable();
                $table->timestamps();

                $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index(['campaign_id', 'user_id']);
            });
        }

        // Create campaign_questions table if it doesn't exist
        if (!Schema::hasTable('campaign_questions')) {
            Schema::create('campaign_questions', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('campaign_id');
                $table->string('question_text');
                $table->string('question_type'); // text, multiple_choice, rating
                $table->longText('options')->nullable(); // JSON for multiple choice
                $table->timestamps();

                $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');
                $table->index('campaign_id');
            });
        }

        // Create campaign_question_responses table if it doesn't exist
        if (!Schema::hasTable('campaign_question_responses')) {
            Schema::create('campaign_question_responses', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('campaign_question_id');
                $table->unsignedInteger('user_id');
                $table->text('answer');
                $table->timestamps();

                $table->foreign('campaign_question_id')->references('id')->on('campaign_questions')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index(['campaign_question_id', 'user_id']);
            });
        }

        // Add size_breakdown column to pledges table for order size tracking
        Schema::table('pledges', function (Blueprint $table) {
            if (!Schema::hasColumn('pledges', 'size_ordered')) {
                $table->string('size_ordered')->nullable()->after('reward_details');
            }
            if (!Schema::hasColumn('pledges', 'quantity')) {
                $table->integer('quantity')->default(1)->after('size_ordered');
            }
            if (!Schema::hasColumn('pledges', 'is_return')) {
                $table->boolean('is_return')->default(false)->after('delivered');
            }
            if (!Schema::hasColumn('pledges', 'return_reason')) {
                $table->text('return_reason')->nullable()->after('is_return');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_question_responses');
        Schema::dropIfExists('campaign_questions');
        Schema::dropIfExists('campaign_feedback');

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumnIfExists(['returns_count', 'feedback_comments_count', 'early_adopters_count', 'bounced_notifications', 'is_featured']);
        });

        Schema::table('pledges', function (Blueprint $table) {
            $table->dropColumnIfExists(['size_ordered', 'quantity', 'is_return', 'return_reason']);
        });
    }
};
