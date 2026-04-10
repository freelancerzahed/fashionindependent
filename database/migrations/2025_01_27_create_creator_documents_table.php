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
        Schema::create('creator_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('creator_id');
            $table->foreign('creator_id')->references('id')->on('creators')->onDelete('cascade');
            
            // Document Information
            $table->enum('document_type', ['tech_pack', 'id_front', 'id_back'])->index();
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');
            
            // Status and Verification
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending')->index();
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['creator_id', 'document_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creator_documents');
    }
};
