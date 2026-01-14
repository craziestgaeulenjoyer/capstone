<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * ADMIN: Get all feedback
     */
    public function index()
    {
        return Feedback::query()
            ->select([
                'id',
                'customer_name as user',
                'rating',
                'description as comment',
                'status',
                'created_at',
            ])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * ADMIN: Approve / Reject feedback
     */
    public function updateStatus(Request $request, Feedback $feedback)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $feedback->update([
            'status' => $request->status,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * CUSTOMER: Approved reviews only
     */
    public function approved()
    {
        return Feedback::query()
            ->where('status', 'approved')
            ->select([
                'customer_name as name',
                'description as text',
                'rating',
            ])
            ->latest()
            ->get();
    }
}
