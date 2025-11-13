<?php

/* php artisan make:migration add_username_to_admins_and_super_admins_tables --table=admins */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->string('username', 50)->nullable()->after('name');
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->string('username', 50)->nullable()->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('username');
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
