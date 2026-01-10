<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller; 
use App\Models\Admin;
use App\Models\SuperAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AdminManagementController extends Controller
{
    public function update(Request $request, $id)
    {
        // Logged-in user
        $user = Auth::user();

        // Find admin or super admin
        $admin = Admin::find($id) ?? SuperAdmin::findOrFail($id);

        // AUTHORIZATION CHECK (RIGHT HERE)
        $this->authorize('update', $admin);

        // Validation (runs only if authorized)
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'disabled'])],
            'email' => ['nullable', 'email', 'unique:admins,email,' . $admin->id],
        ]);

        // Email editable only by super admin
        if (isset($validated['email'])) {
            $admin->email = $validated['email'];
        }

        // Update status
        $admin->status = $validated['status'];
        $admin->save();

        return response()->json([
            'message' => 'Admin updated successfully'
        ]);
    }
}
