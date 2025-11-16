<?php

/* php artisan make:migration add_email_verified_at_and_role_to_admins_table --table=admins */

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
        Schema::table('admins', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->enum('role', ['admin', 'super_admin'])->default('admin')->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            //
        });
    }
};
