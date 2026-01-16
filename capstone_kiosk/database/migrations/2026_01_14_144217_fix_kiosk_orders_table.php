<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // cart_items column already exists
        // nothing to do
    }

    public function down(): void
    {
        // no rollback needed
    }
};
