<?php

namespace App\Http\Controllers;

use App\Events\QueueUpdated;
use App\Models\Queue;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    // Get current queue
    public function index()
    {
        $queue = Queue::with('user')
            ->whereIn('status', ['waiting', 'called'])
            ->orderBy('position')
            ->get();

        return response()->json($queue);
    }

    // Join queue
    public function join(Request $request)
    {
        $request->validate([
            'party_size' => 'required|integer|min:1|max:20',
        ]);

        // Check if user already in queue
        $existing = Queue::where('user_id', $request->user()->id)
            ->whereIn('status', ['waiting', 'called'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You are already in the queue.',
                'queue'   => $existing,
            ], 409);
        }

        // Get last position
        $lastPosition = Queue::whereIn('status', ['waiting', 'called'])
            ->max('position') ?? 0;

        $lastNumber = Queue::max('queue_number') ?? 0;

        // Average wait time per position (10 mins)
        $estimatedWait = ($lastPosition + 1) * 10;

        $queue = Queue::create([
            'user_id'        => $request->user()->id,
            'queue_number'   => $lastNumber + 1,
            'party_size'     => $request->party_size,
            'position'       => $lastPosition + 1,
            'status'         => 'waiting',
            'estimated_wait' => $estimatedWait,
            'joined_at'      => now(),
        ]);

        // Broadcast update
        broadcast(new QueueUpdated($this->getQueueData()));

        return response()->json([
            'message' => 'Joined queue successfully!',
            'queue'   => $queue,
        ], 201);
    }

    // Get my queue status
    public function myStatus(Request $request)
    {
        $queue = Queue::where('user_id', $request->user()->id)
            ->whereIn('status', ['waiting', 'called'])
            ->first();

        if (!$queue) {
            return response()->json(['message' => 'You are not in the queue.'], 404);
        }

        return response()->json($queue);
    }

    // Leave queue
    public function leave(Request $request)
    {
        $queue = Queue::where('user_id', $request->user()->id)
            ->whereIn('status', ['waiting', 'called'])
            ->first();

        if (!$queue) {
            return response()->json(['message' => 'You are not in the queue.'], 404);
        }

        $queue->update(['status' => 'left']);

        // Recalculate positions
        $this->recalculatePositions();

        broadcast(new QueueUpdated($this->getQueueData()));

        return response()->json(['message' => 'Left queue successfully.']);
    }

    // Call next (staff)
    public function callNext()
    {
        $next = Queue::where('status', 'waiting')
            ->orderBy('position')
            ->first();

        if (!$next) {
            return response()->json(['message' => 'Queue is empty.'], 404);
        }

        $next->update([
            'status'    => 'called',
            'called_at' => now(),
        ]);

        broadcast(new QueueUpdated($this->getQueueData()));

        return response()->json([
            'message' => 'Customer called!',
            'queue'   => $next->load('user'),
        ]);
    }

    // Mark seated (staff)
    public function markSeated($id)
    {
        $queue = Queue::findOrFail($id);
        $queue->update([
            'status'    => 'seated',
            'seated_at' => now(),
        ]);

        $this->recalculatePositions();
        broadcast(new QueueUpdated($this->getQueueData()));

        return response()->json(['message' => 'Customer seated!']);
    }

    // Remove from queue (staff)
    public function remove($id)
    {
        $queue = Queue::findOrFail($id);
        $queue->update(['status' => 'left']);

        $this->recalculatePositions();
        broadcast(new QueueUpdated($this->getQueueData()));

        return response()->json(['message' => 'Customer removed from queue.']);
    }

    // Helper - recalculate positions
    private function recalculatePositions()
    {
        $waiting = Queue::where('status', 'waiting')
            ->orderBy('position')
            ->get();

        foreach ($waiting as $index => $entry) {
            $entry->update([
                'position'       => $index + 1,
                'estimated_wait' => ($index + 1) * 10,
            ]);
        }
    }

    // Helper - get queue data for broadcast
    private function getQueueData(): array
    {
        return Queue::with('user')
            ->whereIn('status', ['waiting', 'called'])
            ->orderBy('position')
            ->get()
            ->map(fn($q) => [
                'id'             => $q->id,
                'queue_number'   => $q->queue_number,
                'party_size'     => $q->party_size,
                'position'       => $q->position,
                'status'         => $q->status,
                'estimated_wait' => $q->estimated_wait,
                'user_name'      => $q->user->name,
            ])
            ->toArray();
    }
}