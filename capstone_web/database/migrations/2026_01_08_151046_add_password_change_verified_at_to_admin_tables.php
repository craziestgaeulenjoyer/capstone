<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->timestamp('password_change_verified_at')->nullable()
                  ->after('password_change_otp_expires_at');
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->timestamp('password_change_verified_at')->nullable()
                  ->after('password_change_otp_expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('password_change_verified_at');
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->dropColumn('password_change_verified_at');
        });
    }
};

