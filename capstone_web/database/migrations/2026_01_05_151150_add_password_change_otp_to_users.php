<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->string('password_change_otp')->nullable();
            $table->timestamp('password_change_otp_expires_at')->nullable();
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->string('password_change_otp')->nullable();
            $table->timestamp('password_change_otp_expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn([
                'password_change_otp',
                'password_change_otp_expires_at'
            ]);
        });

        Schema::table('super_admins', function (Blueprint $table) {
            $table->dropColumn([
                'password_change_otp',
                'password_change_otp_expires_at'
            ]);
        });
    }
};
