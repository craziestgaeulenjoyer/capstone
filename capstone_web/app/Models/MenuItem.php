<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Exception;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'price',
        'categories',
        'subcategories',
        'description',
        'image_path',
    ];

    protected $casts = [
        'price' => 'array',
        'categories' => 'array',
        'subcategories' => 'array',
    ];

    protected $appends = ['availability_status', 'max_quantity'];

    public function getMaxQuantityAttribute(): int
    {
        $recipes = $this->relationLoaded('recipes')
            ? $this->recipes
            : $this->recipes()->get();

        if ($recipes->isEmpty()) {
            return 0;
        }

        $maxQuantities = [];

        foreach ($recipes as $inventory) {
            if ($inventory->archived || $inventory->status === 'Expired') {
                return 0;
            }

            $requiredAmount = (float) $inventory->pivot->amount;
            $requiredUnit   = strtolower($inventory->pivot->unit);
            $inventoryUnit  = strtolower($inventory->unit);
            $baseUnit       = strtolower($inventory->base_unit);

            if ($requiredUnit === $inventoryUnit) {
                $availableAmount = $inventory->quantity;
            } else {
                try {
                    $availableAmount = $inventory->quantity / $this->convertToBaseUnit(1, $requiredUnit, $baseUnit);
                } catch (\Exception $e) {
                    return 0;
                }
            }

            $maxForIngredient = floor($availableAmount / $requiredAmount);
            $maxQuantities[] = $maxForIngredient;
        }

        return min($maxQuantities);
    }

    /* ---------------- RELATIONSHIP ---------------- */

    public function recipes()
    {
        return $this->belongsToMany(
            Inventory::class,
            'menu_item_recipes',
            'menu_item_id',
            'inventory_id'
        )->withPivot(['amount', 'unit']);
    }

    /* ---------------- AVAILABILITY (ACCESSOR) ---------------- */

    public function getAvailabilityStatusAttribute(): string
    {
        $recipes = $this->relationLoaded('recipes')
            ? $this->recipes
            : $this->recipes()->get();

        if ($recipes->isEmpty()) {
            return 'Not Available';
        }

        $maxQuantities = [];

        foreach ($recipes as $inventory) {
            if ($inventory->archived || $inventory->status === 'Expired') {
                return 'Sold Out';
            }

            $requiredAmount = (float) $inventory->pivot->amount;
            $requiredUnit   = strtolower($inventory->pivot->unit);
            $inventoryUnit  = strtolower($inventory->unit);
            $baseUnit       = strtolower($inventory->base_unit);

            // Convert inventory quantity to match required unit if needed
            if ($requiredUnit === $inventoryUnit) {
                $availableAmount = $inventory->quantity;
            } else {
                try {
                    // Convert required unit to inventory base unit
                    $availableAmount = $inventory->quantity / $this->convertToBaseUnit(1, $requiredUnit, $baseUnit);
                } catch (\Exception $e) {
                    return 'Sold Out';
                }
            }

            // Max servings this ingredient allows
            $maxForIngredient = floor($availableAmount / $requiredAmount);
            $maxQuantities[] = $maxForIngredient;
        }

        // Minimum across all ingredients
        return min($maxQuantities) > 0 ? 'Available' : 'Sold Out';
    }

    /* ---------------- UNIT CONVERSION ---------------- */

    private function convertToBaseUnit(
        float $amount,
        string $fromUnit,
        string $baseUnit
    ): float {
        $map = [
            'tbsp' => ['ml' => 15, 'g' => 12],
            'tsp'  => ['ml' => 5,  'g' => 4],
            'cup'  => ['ml' => 240,'g' => 120],
            'oz'   => ['ml' => 29.5735, 'g' => 28.3495],
            'ml'   => ['ml' => 1],
            'g'    => ['g' => 1],
            'pcs'  => ['pcs' => 1],
        ];

        $fromUnit = strtolower(trim($fromUnit));
        $baseUnit = strtolower(trim($baseUnit));

        if (!isset($map[$fromUnit][$baseUnit])) {
            throw new Exception("Unsupported unit: $fromUnit → $baseUnit");
        }

        return $amount * $map[$fromUnit][$baseUnit];
    }
}
