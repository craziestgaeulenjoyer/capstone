<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('kiosk_orders', function (Blueprint $table) {
            $table->string('order_number')->change();
        });
    }

    public function down(): void
    {
        Schema::table('kiosk_orders', function (Blueprint $table) {
            $table->integer('order_number')->change();
        });
    }
};
