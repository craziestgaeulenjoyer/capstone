<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\Notification;
use App\Models\Inventory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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

        if (in_array($request->type, ['drink', 'food'])) {
            return is_array($price) ? $price : [$price];
        }

        return (string) $price;
    }

    /**
     * Store a new menu item
     */
    public function store(Request $request)
    {
        if (is_string($request->recipes)) {
            $request->merge([
                'recipes' => json_decode($request->recipes, true)
            ]);
        }

        Log::info('MenuController@store request received', $request->all());

        if ($request->has('recipes')) {
            $cleanRecipes = collect($request->recipes)->filter(function ($r) {
                return !empty($r['inventory_id']);
            })->values()->toArray();

            $request->merge(['recipes' => $cleanRecipes]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:food,drink',
            'price' => 'required',
            'categories' => 'required|array|min:1',
            'subcategories' => 'nullable|array',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        
            'recipes' => 'nullable|array',
            'recipes.*.inventory_id' => 'required|exists:inventories,id',
            'recipes.*.amount' => 'required|numeric|min:0.01',
            'recipes.*.unit' => 'required|string|max:50',
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

        if ($request->has('recipes')) {
            foreach ($request->recipes as $recipe) {
                if (empty($recipe['inventory_id'])) {
                    continue;
                }

                $amount = $recipe['amount'];

                // Safety normalization (backend guard)
                if (is_string($amount) && str_contains($amount, '/')) {
                    [$num, $den] = explode('/', $amount);
                    $amount = (float) $num / (float) $den;
                }

                DB::table('menu_item_recipes')->insert([
                    'menu_item_id' => $item->id,
                    'inventory_id' => $recipe['inventory_id'],
                    'amount' => (float) $amount,
                    'unit' => $recipe['unit'],
                ]);
            }
        }

        DB::statement('SELECT refresh_menu_availability()');

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

    public function index()
    {
        $items = MenuItem::with('recipes')->get();

        return response()->json([
            'items' => $items
        ]);
    }

    public function show($id)
    {
        return response()->json(
            MenuItem::with('recipes')->findOrFail($id)
        );
    }

    /**
     * Update an existing menu item
     */
    public function update(Request $request, $id)
    {
        if (is_string($request->recipes)) {
            $request->merge([
                'recipes' => json_decode($request->recipes, true)
            ]);
        }

        $item = MenuItem::findOrFail($id);
        $before = $item->getOriginal();

        Log::info('MenuController@update request received', $request->all());

        if ($request->has('recipes')) {
            $cleanRecipes = collect($request->recipes)->filter(function ($r) {
                return !empty($r['inventory_id']);
            })->values()->toArray();

            $request->merge(['recipes' => $cleanRecipes]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:food,drink',
            'price' => 'required',
            'categories' => 'required|array|min:1',
            'subcategories' => 'nullable|array',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        
            'recipes' => 'nullable|array',
            'recipes.*.inventory_id' => 'required|exists:inventories,id',
            'recipes.*.amount' => 'required|numeric|min:0.01',
            'recipes.*.unit' => 'required|string|max:50',
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
        
        DB::table('menu_item_recipes')
            ->where('menu_item_id', $item->id)
            ->delete();

        if ($request->has('recipes')) {
            foreach ($request->recipes as $recipe) {
                if (empty($recipe['inventory_id'])) {
                    continue;
                }

                $amount = $recipe['amount'];

                if (is_string($amount) && str_contains($amount, '/')) {
                    [$num, $den] = explode('/', $amount);
                    $amount = (float) $num / (float) $den;
                }

                DB::table('menu_item_recipes')->insert([
                    'menu_item_id' => $item->id,
                    'inventory_id' => $recipe['inventory_id'],
                    'amount' => (float) $amount,
                    'unit' => $recipe['unit'],
                ]);
            }
        }

        DB::statement('SELECT refresh_menu_availability()');

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
        $items = MenuItem::with('recipes')->get();

        // Availability comes from model accessor automatically
        return response()->json([
            'items' => $items
        ]);
    }
}
