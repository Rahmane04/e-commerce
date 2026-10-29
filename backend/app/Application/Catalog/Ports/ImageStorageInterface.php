<?php
namespace App\Application\Catalog\Ports;

use Illuminate\Http\UploadedFile;

interface ImageStorageInterface
{
    /** Stocke l'image et retourne son URL publique. */
    public function store(UploadedFile $file): string;
}
