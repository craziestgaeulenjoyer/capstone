<?php

namespace App\Http\Controllers\Home_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventInquiry;

class EventInquiryController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'event_type' => 'required|string',
            'event_date' => 'required|date',
            'estimated_pax' => 'required|integer',
            'event_location' => 'required|string',
        ]);

        EventInquiry::create($data);

        return response()->json([
            'message' => 'Inquiry submitted successfully'
        ], 201);
    }
}
