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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('creator_id');
            $table->unsignedInteger('user_id');
            $table->foreign('creator_id')->references('id')->on('creators')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Campaign Status
            $table->enum('status', ['draft', 'pending_review', 'live', 'funded', 'failed', 'cancelled', 'delivered'])->default('draft');
            $table->text('rejection_reason')->nullable();
            
            // Campaign Details
            $table->string('title');
            $table->text('description');
            $table->decimal('funding_goal', 15, 2);
            $table->decimal('current_funding', 15, 2)->default(0);
            $table->integer('backer_count')->default(0);
            $table->integer('days_active')->default(90);
            
            // Product Information
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->json('materials')->nullable(); // JSON array of materials
            $table->json('colors')->nullable(); // JSON array of colors
            $table->json('sizes')->nullable(); // JSON array of sizes
            
            // Images & Media
            $table->json('product_images')->nullable(); // JSON array of image URLs
            $table->string('tech_pack_file')->nullable();
            $table->boolean('tech_pack_purchased')->default(false);
            $table->decimal('tech_pack_cost', 10, 2)->nullable();
            
            // Campaign Dates
            $table->timestamp('launch_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamp('expected_delivery_date')->nullable();
            $table->timestamp('actual_delivery_date')->nullable();
            
            // Manufacturing & Delivery
            $table->enum('manufacturing_location', ['in_house', 'external'])->default('in_house');
            $table->string('manufacturing_partner')->nullable();
            $table->text('delivery_notes')->nullable();
            
            // Campaign Settings
            $table->integer('minimum_pledges')->default(10);
            $table->decimal('minimum_pledge_amount', 10, 2)->default(0);
            $table->boolean('allow_overfunding')->default(true);
            
            // Statistics
            $table->integer('views')->default(0);
            $table->integer('shares')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
