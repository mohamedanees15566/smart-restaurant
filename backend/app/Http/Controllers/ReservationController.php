<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Table;
use App\Models\Notification;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    // Get available tables for a date/time
    public function availableTables(Request $request)
    {
        $request->validate([
            'reserved_at' => 'required|date|after:now',
            'party_size'  => 'required|integer|min:1',
        ]);

        // Get tables that are not reserved at this time
        $reservedTableIds = Reservation::where('status', '!=', 'cancelled')
            ->whereBetween('reserved_at', [
                \Carbon\Carbon::parse($request->reserved_at)->subHours(2),
                \Carbon\Carbon::parse($request->reserved_at)->addHours(2),
            ])
            ->pluck('table_id');

        $tables = Table::where('is_active', true)
            ->where('capacity', '>=', $request->party_size)
            ->whereNotIn('id', $reservedTableIds)
            ->get();

        return response()->json($tables);
    }

    // Make a reservation
    public function store(Request $request)
    {
        $request->validate([
            'table_id'    => 'required|exists:tables,id',
            'party_size'  => 'required|integer|min:1',
            'reserved_at' => 'required|date|after:now',
            'notes'       => 'nullable|string',
        ]);

        // Check if table is already reserved
        $conflict = Reservation::where('table_id', $request->table_id)
            ->where('status', '!=', 'cancelled')
            ->whereBetween('reserved_at', [
                \Carbon\Carbon::parse($request->reserved_at)->subHours(2),
                \Carbon\Carbon::parse($request->reserved_at)->addHours(2),
            ])
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This table is already reserved for that time.'
            ], 409);
        }

        $reservation = Reservation::create([
            'user_id'     => $request->user()->id,
            'table_id'    => $request->table_id,
            'party_size'  => $request->party_size,
            'reserved_at' => $request->reserved_at,
            'status'      => 'pending',
            'notes'       => $request->notes,
        ]);

        // Notify customer
        Notification::create([
            'user_id' => $request->user()->id,
            'type'    => 'reservation',
            'title'   => 'Reservation Received! 📅',
            'message' => 'Your table reservation for ' . \Carbon\Carbon::parse($request->reserved_at)->format('M d, Y h:i A') . ' is pending confirmation.',
            'data'    => ['reservation_id' => $reservation->id],
        ]);

        return response()->json([
            'message'     => 'Reservation created successfully!',
            'reservation' => $reservation->load('table'),
        ], 201);
    }

    // Get my reservations
    public function myReservations(Request $request)
    {
        $reservations = Reservation::with('table')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('reserved_at')
            ->get();

        return response()->json($reservations);
    }

    // Cancel reservation
    public function cancel(Request $request, $id)
    {
        $reservation = Reservation::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $reservation->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Reservation cancelled.']);
    }

    // Staff - get all reservations
    public function allReservations()
    {
        $reservations = Reservation::with('user', 'table')
            ->orderBy('reserved_at')
            ->get();

        return response()->json($reservations);
    }

    // Staff - confirm reservation
    public function confirm($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update([
            'status'       => 'confirmed',
            'confirmed_at' => now(),
        ]);

        // Notify customer
        Notification::create([
            'user_id' => $reservation->user_id,
            'type'    => 'reservation_confirmed',
            'title'   => 'Reservation Confirmed! ✅',
            'message' => 'Your table reservation for ' . $reservation->reserved_at->format('M d, Y h:i A') . ' has been confirmed!',
            'data'    => ['reservation_id' => $reservation->id],
        ]);

        return response()->json(['message' => 'Reservation confirmed!']);
    }
}