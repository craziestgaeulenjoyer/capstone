<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventory_id')->nullable();
            $table->string('action');
            $table->json('changed_fields')->nullable(); 
            $table->string('performed_by')->nullable();
            $table->timestamps();

            $table->foreign('inventory_id')->references('id')->on('inventories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_logs');
    }
};
