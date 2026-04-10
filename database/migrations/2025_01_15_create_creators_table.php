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
        Schema::create('creators', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Creator Status
            $table->enum('status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending');
            $table->text('rejection_reason')->nullable();
            
            // Creator Information
            $table->string('brand_name')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            
            // Verification & Requirements
            $table->boolean('has_inventory')->default(false);
            $table->boolean('has_tech_pack')->default(false);
            $table->boolean('verified')->default(false);
            
            // Terms & Agreements
            $table->boolean('accepted_terms')->default(false);
            $table->boolean('accepted_collaboration_agreement')->default(false);
            $table->boolean('accepted_delivery_obligation')->default(false);
            $table->timestamp('terms_accepted_at')->nullable();
            
            // Statistics
            $table->integer('total_campaigns')->default(0);
            $table->integer('successful_campaigns')->default(0);
            $table->decimal('total_funded', 15, 2)->default(0);
            $table->decimal('rating', 3, 2)->nullable();
            
            // Bank/Payment Information
            $table->string('bank_account')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_holder')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('swiftcode')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};
