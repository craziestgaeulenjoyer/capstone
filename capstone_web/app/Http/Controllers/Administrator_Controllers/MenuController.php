<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    /**
     * Resolve actor name safely
     */
    private function actorName(): string
    {
        if (auth('super_admin')->check()) {
            return auth('super_admin')->user()->name;
        }

        if (auth('admin')->check()) {
            return auth('admin')->user()->name;
        }

        return 'System';
    }

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
     */
    private function normalizePrice(Request $request)
    {
        $price = $request->price;

        if ($request->type === 'drink') {
            return is_array($price) ? $price : [$price];
        }

        return is_array($price) ? $price : (string) $price;
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
            'price' => 'required',
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

        Notification::create([
            'type' => 'menu',
            'action' => 'Created',
            'subject' => $item->name,
            'changed_fields' => $item->only([
                'type', 'price', 'categories', 'subcategories', 'description'
            ]),
            'performed_by' => $this->actorName(),
        ]);

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
        $before = $item->getOriginal();

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

        // Detect changes
        $changed = [];
        foreach ($item->getChanges() as $key => $newValue) {
            $changed[$key] = [
                'old' => $before[$key] ?? null,
                'new' => $newValue,
            ];
        }

        if (!empty($changed)) {
            Notification::create([
                'type' => 'menu',
                'action' => 'Updated',
                'subject' => $item->name,
                'changed_fields' => $changed,
                'performed_by' => $this->actorName(),
            ]);
        }

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

        Notification::create([
            'type' => 'menu',
            'action' => 'Deleted',
            'subject' => $item->name,
            'changed_fields' => null,
            'performed_by' => $this->actorName(),
        ]);

        $item->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully.'
        ]);
    }

    /**
     * Public menu
     */
    public function publicMenu()
    {
        return response()->json(MenuItem::all());
    }
}
