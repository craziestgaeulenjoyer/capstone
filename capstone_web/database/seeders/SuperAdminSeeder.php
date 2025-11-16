<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\SuperAdmin;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        SuperAdmin::create([
            'name' => 'Test SuperAdmin',
            'email' => 'rafhaelseno919@gmail.com',
            'password' => Hash::make('Explosion70!'),
        ]);
    }
}

