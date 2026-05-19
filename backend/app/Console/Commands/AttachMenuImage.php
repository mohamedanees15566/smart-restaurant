<?php

namespace App\Console\Commands;

use App\Models\MenuItem;
use App\Support\MenuImageStorage;
use Illuminate\Console\Command;

class AttachMenuImage extends Command
{
  protected $signature = 'menu:attach-image
                          {item : Menu item name (e.g. Biryani)}
                          {file : Full path to the image file on your computer}';

  protected $description = 'Copy an image into storage and attach it to a menu item';

  public function handle(): int
  {
    $item = MenuItem::where('name', $this->argument('item'))->first();

    if (! $item) {
      $this->error('Menu item not found: '.$this->argument('item'));
      return self::FAILURE;
    }

    $source = $this->argument('file');
    if (! is_file($source)) {
      $this->error('File not found: '.$source);
      return self::FAILURE;
    }

    if ($item->image) {
      \Illuminate\Support\Facades\Storage::disk('public')->delete($item->image);
    }

    $path = MenuImageStorage::copyFromPath($source);
    $item->update(['image' => $path]);

    $url = rtrim(config('app.url'), '/').'/storage/'.$path;
    $this->info("Attached to \"{$item->name}\"");
    $this->line("Path: {$path}");
    $this->line("URL:  {$url}");

    return self::SUCCESS;
  }
}
