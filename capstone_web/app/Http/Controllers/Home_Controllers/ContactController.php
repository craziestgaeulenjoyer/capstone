<?php

namespace App\Http\Controllers\Home_Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'message' => 'required|string',
        ]);

        Contact::create($data);

        return response()->json([
            'message' => 'Message saved successfully'
        ]);
    }
}
