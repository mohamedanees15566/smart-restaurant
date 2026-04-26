<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('queue_number');
            $table->tinyInteger('party_size')->default(1);
            $table->integer('position')->default(0);
            $table->enum('status', ['waiting', 'called', 'seated', 'left'])->default('waiting');
            $table->integer('estimated_wait')->default(0);
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('called_at')->nullable();
            $table->timestamp('seated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue');
    }
};