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
        Schema::table('email_change_tokens', function (Blueprint $table) {
            $table->timestamp('verified_at')->nullable()->after('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('email_change_tokens', function (Blueprint $table) {
            $table->dropColumn('verified_at');
        });
    }
};
