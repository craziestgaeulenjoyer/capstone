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
            'name' => 'Macy Admin',
            'email' => 'macyatienza92@gmail.com',
            'password' => Hash::make('Explosion70!'),
        ]);
    }
}

