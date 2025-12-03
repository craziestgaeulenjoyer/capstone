<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    /**
     * Get all menu items (admin view)
     */
    public function list()
    {
        return response()->json([
            'items' => MenuItem::all()
        ]);
    }

    /**
     * Normalize price for food and drinks
     * - Drinks: always array
     * - Food: string (single) or array (regular/large)
     */
    private function normalizePrice(Request $request)
    {
        $price = $request->price;

        if ($request->type === 'drink') {
            // Ensure drinks are always stored as array
            return is_array($price) ? $price : [$price];
        }

        // Food
        if (is_array($price)) {
            return $price;
        }

        return (string) $price; // single price as string
    }

    /**
     * Store a new menu item
     */
    public function store(Request $request)
    {
        Log::info('MenuController@store request received', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:food,drink',
            'price' => 'required', // string or array
            'categories' => 'required|array|min:1',
            'subcategories' => 'nullable|array',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $finalPrice = $this->normalizePrice($request);

        $path = $request->hasFile('image')
            ? $request->file('image')->store('menu_images', 'public')
            : null;

        $item = MenuItem::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'price' => $finalPrice,
            'categories' => $validated['categories'],
            'subcategories' => $validated['subcategories'] ?? [],
            'description' => $validated['description'] ?? '',
            'image_path' => $path,
        ]);

        Log::info('Menu item stored', ['item' => $item]);

        return response()->json([
            'message' => 'Menu item added successfully.',
            'item' => $item
        ], 201);
    }

    /**
     * Update an existing menu item
     */
    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);

        Log::info('MenuController@update request received', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:food,drink',
            'price' => 'required',
            'categories' => 'required|array|min:1',
            'subcategories' => 'nullable|array',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $finalPrice = $this->normalizePrice($request);

        // Handle image
        if ($request->hasFile('image')) {
            if ($item->image_path) {
                Storage::disk('public')->delete($item->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('menu_images', 'public');
        }

        $item->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'price' => $finalPrice,
            'categories' => $validated['categories'],
            'subcategories' => $validated['subcategories'] ?? [],
            'description' => $validated['description'] ?? '',
            'image_path' => $validated['image_path'] ?? $item->image_path,
        ]);

        Log::info('Menu item updated', ['item' => $item]);

        return response()->json([
            'message' => 'Menu item updated successfully.',
            'item' => $item
        ]);
    }

    /**
     * Delete a menu item
     */
    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);

        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }

        $item->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully.'
        ]);
    }

    /**
     * Public menu (for website)
     */
    public function publicMenu()
    {
        return response()->json(MenuItem::all());
    }
}
