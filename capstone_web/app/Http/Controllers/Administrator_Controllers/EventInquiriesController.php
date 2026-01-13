<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use App\Models\EventInquiry;
use Illuminate\Http\Request;

class EventInquiriesController extends Controller
{
    // GET all inquiries
    public function index()
    {
        return response()->json([
            'events' => EventInquiry::orderBy('created_at', 'desc')->get()
        ]);
    }

    // GET: single inquiry (modal details)
    public function show($id)
    {
        return response()->json(
            EventInquiry::findOrFail($id)
        );
    }

    // UPDATE status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled',
        ]);

        $event = EventInquiry::findOrFail($id);
        $event->status = $request->status;
        $event->save();

        return response()->json([
            'message' => 'Event status updated successfully',
            'event' => $event,
        ]);
    }
}
