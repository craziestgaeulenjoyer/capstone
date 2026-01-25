<?php

namespace App\Http\Controllers\Administrator_Controllers;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Resolve actor name safely (admin / superadmin)
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
     * Create system notification
     */
    private function notify(
        string $action,
        ?string $subject,
        $changedFields = null
    ): void {
        Notification::create([
            'type' => 'inventory',
            'action' => $action,
            'subject' => $subject,
            'changed_fields' => $changedFields,
            'performed_by' => $this->actorName(),
        ]);
    }

    /**
     * Fetch inventory (supports month/year filter)
     */
    public function index(Request $request)
    {
        $month = $request->query('month');
        $year  = $request->query('year');

        $query = Inventory::query();

        if ($month && $year) {
            $query->whereMonth('updated_at', $month)
                  ->whereYear('updated_at', $year);
        }

        return response()->json(
            $query->orderBy('updated_at', 'DESC')->get()
        );
    }

    /**
     * Store inventory item
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validate([
                'name'            => 'required|string',
                'category'        => 'required|string',
                'supplier'        => 'nullable|string',
                'quantity'        => 'required|numeric',
                'unit'            => 'nullable|string',
                'base_unit'       => 'required|string', 
                'conversion_size' => 'nullable|numeric', 
                'expiry'          => 'nullable|date',
                'status'          => 'nullable|string',
            ]);

            $item = Inventory::create([
                'name'            => $data['name'],
                'category'        => $data['category'],
                'supplier'        => $data['supplier'],
                'quantity'        => $data['quantity'], 
                'unit'            => $data['unit'],       
                'base_unit'       => $data['base_unit'],
                'conversion_size' => $data['conversion_size'] ?? null,
                'expiry'          => $data['expiry'],
                'status'          => $data['status'] ?? 'In Stock',
            ]);

            InventoryLog::create([
                'inventory_id' => $item->id,
                'action' => 'created',
                'changed_fields' => null,
                'performed_by' => $this->actorName(),
            ]);

            Notification::create([
                'type' => 'inventory',
                'action' => 'Created',
                'subject' => $item->name,
                'changed_fields' => null,
                'performed_by' => $this->actorName(),
                'is_read' => false,
            ]);

            DB::commit();

            return response()->json($item, 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show single inventory
     */
    public function show($id)
    {
        return Inventory::findOrFail($id);
    }

    /**
     * Update inventory item
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $item = Inventory::findOrFail($id);

            $oldData = $item->only([
                'name',
                'category',
                'supplier',
                'quantity',
                'base_unit',
                'expiry',
                'status',
            ]);

            $data = $request->validate([
                'name'            => 'sometimes|string',
                'category'        => 'sometimes|string',
                'supplier'        => 'nullable|string',
                'quantity'        => 'sometimes|numeric',
                'unit'            => 'nullable|string',
                'conversion_size' => 'sometimes|numeric',
                'base_unit'       => 'sometimes|string',
                'expiry'          => 'nullable|date',
                'status'          => 'sometimes|in:In Stock,Low,Expired Soon,Expired',
            ]);

            if (isset($data['quantity'])) {
                $item->quantity = $data['quantity'];
                unset($data['quantity']);
            }

            if (!isset($data['unit']) && isset($data['base_unit'])) {
                $data['unit'] = match ($data['base_unit']) {
                    'ml'    => 'ml',
                    'g'     => 'g',
                    'grams' => 'g',
                    default => 'pcs',
                };
            }

            $item->update($data);

            $changedFields = [];
            foreach ($data as $field => $newValue) {
                if (($oldData[$field] ?? null) != $newValue) {
                    $changedFields[$field] = [
                        'old' => $oldData[$field] ?? null,
                        'new' => $newValue,
                    ];
                }
            }

            InventoryLog::create([
                'inventory_id'   => $item->id,
                'action'         => 'updated',
                'changed_fields' => $changedFields ?: null,
                'performed_by'   => $this->actorName(),
            ]);

            Notification::create([
                'type'           => 'inventory',
                'action'         => 'Updated',
                'subject'        => $item->name,
                'changed_fields' => $changedFields ?: null,
                'performed_by'   => $this->actorName(),
                'is_read'        => false,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Inventory updated successfully',
                'item' => $item,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Inventory update failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete inventory
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $item = Inventory::findOrFail($id);
            $name = $item->name;

            $item->delete();

            InventoryLog::create([
                'inventory_id' => null,
                'action' => 'deleted',
                'changed_fields' => null,
                'performed_by' => $this->actorName(),
            ]);

            Notification::create([
                'type' => 'inventory',
                'action' => 'Deleted',
                'subject' => $name,
                'changed_fields' => null,
                'performed_by' => $this->actorName(),
                'is_read' => false,
            ]);

            DB::commit();

            return response()->json(['message' => 'Deleted']);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Archive inventory
     */
    public function archive($id)
    {
        DB::beginTransaction();

        try {
            $inventory = Inventory::findOrFail($id);

            $oldValue = $inventory->archived;

            $inventory->update([
                'archived' => true,
            ]);

            $changedFields = [
                'archived' => [
                    'old' => $oldValue,
                    'new' => true,
                ],
            ];

            // Inventory log
            InventoryLog::create([
                'inventory_id'   => $inventory->id,
                'action'         => 'archived',
                'changed_fields' => $changedFields,
                'performed_by'   => $this->actorName(),
            ]);

            // Notification
            Notification::create([
                'type'           => 'inventory',
                'action'         => 'Archived',
                'subject'        => $inventory->name,
                'changed_fields' => $changedFields,
                'performed_by'   => $this->actorName(),
                'is_read'        => false,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Inventory archived successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to archive inventory',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Paginated activity logs
     */
    public function logs(Request $request)
    {
        $logs = InventoryLog::with('inventory')
            ->orderBy('created_at', 'DESC')
            ->paginate(10);

        return response()->json($logs);
    }

     /**
     * Fetch notifications (for bell)
     */
    public function notifications()
    {
        return response()->json(
            Notification::orderBy('created_at', 'DESC')
                ->paginate(10)
        );
    }

    /**
     * Mark notification as read
     */
    public function markNotificationRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Inventory list for recipe selection
     */
    public function recipeIngredients()
    {
        return response()->json(
            Inventory::where('archived', false)
                ->where('quantity', '>', 0)
                ->whereNotIn('status', ['Expired'])
                ->orderBy('name')
                ->get([
                        'id',
                        'name',
                        'base_unit',
                        'quantity',
                        'status'
                    ])
        );
    }

    /**
     * Convert recipe unit to inventory base unit
     */
    private function convertToBaseUnit(
        float $amount,
        string $fromUnit,
        string $baseUnit
    ): float {
        $map = [
            // SPOONS
            'tbsp' => [
                'ml' => 15,
                'g'  => 12,
            ],
            'tsp' => [
                'ml' => 5,
                'g'  => 4,
            ],

            // CUPS
            'cup' => [
                'ml' => 240,
                'g'  => 120,
            ],

            // OUNCES (NEW)
            'oz' => [
                'ml' => 29.5735,  // fluid ounce
                'g'  => 28.3495,  // weight ounce
            ],

            // BASE UNITS
            'ml' => [
                'ml' => 1,
            ],
            'g' => [
                'g' => 1,
            ],
            'pcs' => [
                'pcs' => 1,
            ],
        ];

        // Normalize units (safety)
        $fromUnit = strtolower(trim($fromUnit));
        $baseUnit = strtolower(trim($baseUnit));

        if (!isset($map[$fromUnit][$baseUnit])) {
            throw new \Exception("Unsupported unit conversion: $fromUnit → $baseUnit");
        }

        return $amount * $map[$fromUnit][$baseUnit];
    }
}
