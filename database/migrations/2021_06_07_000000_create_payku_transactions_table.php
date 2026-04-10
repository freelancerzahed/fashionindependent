<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('payku_transactions')) {
            Schema::create('payku_transactions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('status')->nullable();
                $table->string('order')->nullable();
                $table->string('email')->nullable();
                $table->string('subject')->nullable();
                $table->text('url')->nullable();
                $table->unsignedInteger('amount')->nullable();
                $table->dateTime('notified_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payku_transactions');
    }
};
