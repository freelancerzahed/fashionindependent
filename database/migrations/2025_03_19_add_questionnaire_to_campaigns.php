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
            // Add questionnaire fields
            $table->json('previous_sales')->nullable()->after('product_images')->comment('Previous sales channels');
            $table->json('existing_inventory')->nullable()->after('previous_sales')->comment('Existing inventory levels');
            $table->json('manufacturer_restock')->nullable()->after('existing_inventory')->comment('Manufacturer restock time');
            $table->json('manufacturing_assistance')->nullable()->after('manufacturer_restock')->comment('Manufacturing assistance requirements');
            $table->json('business_registration')->nullable()->after('manufacturing_assistance')->comment('Business registration status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn([
                'previous_sales',
                'existing_inventory',
                'manufacturer_restock',
                'manufacturing_assistance',
                'business_registration'
            ]);
        });
    }
};
