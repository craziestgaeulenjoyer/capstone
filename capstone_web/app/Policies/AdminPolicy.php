<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\SuperAdmin;

class AdminPolicy
{
    public function update($user, $target)
    {
        return $user->role === 'super_admin';
    }
}
