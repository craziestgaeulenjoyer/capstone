<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Admins table
        Schema::table('admins', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'disabled'])
                  ->default('active')
                  ->after('role');
        });

        // Super Admins table
        Schema::table('super_admins', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'disabled'])
                  ->default('active')
                  ->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
