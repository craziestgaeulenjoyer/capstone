<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;

class KioskMenuStatusController extends Controller
{
    public function index()
    {
        // Fetch all menu items
        $menuItems = MenuItem::all();

        $groupedItems = [];

        foreach ($menuItems as $item) {
            foreach ($item->categories as $category) {
                // Initialize category array if it doesn't exist
                if (!isset($groupedItems[$category])) {
                    $groupedItems[$category] = [];
                }

                // Ensure price exists
                $price = [
                    'regular' => $item->price['regular'] ?? null,
                    'large' => $item->price['large'] ?? null,
                ];

                // Determine available sizes dynamically
                $sizes = [];
                if ($item->type === 'drink' && $price['regular'] && $price['large']) {
                    $sizes = ["Regular 16oz", "Large 22oz"];
                } elseif ($item->type === 'drink' && $price['large'] && !$price['regular']) {
                    $sizes = ["Large 22oz"];
                } elseif ($item->type === 'food') {
                    if (str_contains(strtolower($item->name), 'fries')) {
                        $sizes = ["Regular", "Large"];
                    } elseif (str_contains(strtolower($item->name), 'sticks')) {
                        $sizes = ["10 pcs", "15 pcs"];
                    } elseif (str_contains(strtolower($item->name), 'hash')) {
                        $sizes = ["2 pcs", "3 pcs"];
                    } else {
                        $sizes = ["Regular"];
                    }
                }

                // Calculate max quantity based on inventory and recipe
                $maxQuantity = PHP_INT_MAX;

                $recipes = DB::table('menu_item_recipes')
                    ->where('menu_item_id', $item->id)
                    ->get();

                foreach ($recipes as $recipe) {
                    $inventory = DB::table('inventories')
                        ->where('id', $recipe->inventory_id)
                        ->first();

                    if ($inventory) {
                        // compute possible servings from this ingredient
                        $possibleServings = floor($inventory->quantity / $recipe->amount);
                        $maxQuantity = min($maxQuantity, $possibleServings);
                    } else {
                        // inventory missing → cannot make item
                        $maxQuantity = 0;
                    }
                }

                // fallback if no recipes
                if ($recipes->isEmpty()) {
                    $maxQuantity = $item->max_quantity ?? 0;
                }

                $groupedItems[$category][] = [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => $category,
                    'price' => $price,
                    'sizes' => $sizes,
                    'image' => $item->image_path,
                    'is_available' => $item->is_available,
                    'availability_status' => $item->is_available ? 'Available' : 'Not Available',
                    'max_quantity' => (int) $maxQuantity,
                ];
            }
        }

        return response()->json($groupedItems);
    }
}
