<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MenuImageStorage
{
  public static function rules(): array
  {
    return ['nullable', 'file', 'image', 'max:5120'];
  }

  public static function store(UploadedFile $file): string
  {
    $base = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
    $base = Str::slug($base) ?: 'menu-item';
    $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
    $filename = "{$base}.{$ext}";

    $disk = Storage::disk('public');
    $path = "menu/{$filename}";
    $i = 1;
    while ($disk->exists($path)) {
      $path = "menu/{$base}-{$i}.{$ext}";
      $i++;
    }

    $file->storeAs('menu', basename($path), 'public');

    return $path;
  }

  public static function copyFromPath(string $sourcePath, ?string $preferredName = null): string
  {
    if (! is_file($sourcePath)) {
      throw new \InvalidArgumentException("Image file not found: {$sourcePath}");
    }

    $name = $preferredName ?: basename($sourcePath);
    $name = preg_replace('/[^a-zA-Z0-9._-]/', '-', $name);
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION) ?: 'jpg');
    $base = Str::slug(pathinfo($name, PATHINFO_FILENAME)) ?: 'menu-item';
    $filename = "{$base}.{$ext}";

    $disk = Storage::disk('public');
    $disk->makeDirectory('menu');
    $path = "menu/{$filename}";
    $i = 1;
    while ($disk->exists($path)) {
      $path = "menu/{$base}-{$i}.{$ext}";
      $i++;
    }

    $disk->put($path, file_get_contents($sourcePath));

    return $path;
  }
}
