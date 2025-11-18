<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    // Fetch all inventory items, both archived and non-archived
    public function index(Request $request)
    {
        return Inventory::latest()->get(); // No filtering on 'archived' here
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'quantity' => 'required|integer',
            'unit' => 'nullable|string',
            'expiry' => 'nullable|date',
            'status' => 'required|in:In Stock,Low,Expired Soon,Expired',
        ]);

        $inventory = Inventory::create($data);

        return response()->json($inventory, 201);
    }

    public function show($id)
    {
        return Inventory::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'quantity' => 'sometimes|required|integer',
            'unit' => 'nullable|string',
            'expiry' => 'nullable|date',
            'status' => 'sometimes|required|in:In Stock,Low,Expired Soon,Expired',
        ]);

        $inventory->update($data);

        return response()->json($inventory);
    }

    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();
        return response()->json(['message' => 'Inventory deleted successfully']);
    }

    public function archive($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->archived = true;
        $inventory->save();

        return response()->json(['message' => 'Inventory archived successfully']);
    }
}
