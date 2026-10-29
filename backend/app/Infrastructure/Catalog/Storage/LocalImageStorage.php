<?php
namespace App\Infrastructure\Catalog\Storage;

use App\Application\Catalog\Ports\ImageStorageInterface;
use Illuminate\Http\UploadedFile;

class LocalImageStorage implements ImageStorageInterface
{
    public function store(UploadedFile $file): string
    {
        $path = $file->store('products', 'public');

        return asset('storage/' . $path);
    }
}
