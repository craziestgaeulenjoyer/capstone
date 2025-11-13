<?php

/* php artisan make:migration add_email_verified_at_and_role_to_super_admins_table --table=super_admins */

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
        Schema::table('super_admins', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->enum('role', ['super_admin'])->default('super_admin')->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('super_admins', function (Blueprint $table) {
            //
        });
    }
};
