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
        Schema::create('pledges', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('campaign_id');
            $table->unsignedInteger('backer_id');
            $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');
            $table->foreign('backer_id')->references('id')->on('users')->onDelete('cascade');
            
            // Pledge Details
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'confirmed', 'paid', 'refunded', 'cancelled'])->default('pending');
            
            // Reward Tier Information
            $table->string('reward_tier')->nullable();
            $table->json('reward_details')->nullable();
            
            // Payment Information
            $table->string('transaction_id')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamp('paid_at')->nullable();
            
            // Delivery
            $table->boolean('delivered')->default(false);
            $table->timestamp('delivered_at')->nullable();
            $table->text('shipping_address')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pledges');
    }
};
