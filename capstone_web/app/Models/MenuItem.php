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

    protected $appends = ['availability_status'];

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

        foreach ($recipes as $inventory) {

            if ($inventory->archived || $inventory->status === 'Expired') {
                return 'Sold Out';
            }

            $requiredAmount = (float) $inventory->pivot->amount;
            $requiredUnit   = strtolower($inventory->pivot->unit);
            $inventoryUnit  = strtolower($inventory->unit);
            $baseUnit       = strtolower($inventory->base_unit);

            // Same unit → direct compare
            if ($requiredUnit === $inventoryUnit) {
                if ($inventory->quantity < $requiredAmount) {
                    return 'Sold Out';
                }
                continue;
            }

            // Units differ → convert
            try {
                $requiredBase = $this->convertToBaseUnit(
                    $requiredAmount,
                    $requiredUnit,
                    $baseUnit
                );
            } catch (Exception $e) {
                return 'Sold Out';
            }

            if ($inventory->quantity < $requiredBase) {
                return 'Sold Out';
            }
        }

        return 'Available';
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
