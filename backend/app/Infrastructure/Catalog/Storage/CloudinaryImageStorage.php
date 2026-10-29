<?php
namespace App\Infrastructure\Catalog\Storage;

use App\Application\Catalog\Ports\ImageStorageInterface;
use App\Domain\Catalog\Exceptions\ImageUploadFailedException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudinaryImageStorage implements ImageStorageInterface
{
    public function store(UploadedFile $file): string
    {
        $cloudName = config('images.cloudinary.cloud_name');
        $apiKey = config('images.cloudinary.api_key');
        $apiSecret = config('images.cloudinary.api_secret');
        $folder = config('images.cloudinary.folder');
        $timestamp = time();

        // Paramètres signés, triés par ordre alphabétique, suivis du secret.
        $signature = sha1("folder={$folder}&timestamp={$timestamp}" . $apiSecret);

        $response = Http::timeout(30)
            ->attach('file', fopen($file->getRealPath(), 'r'), $file->getClientOriginalName())
            ->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'folder' => $folder,
                'signature' => $signature,
            ]);

        $url = $response->json('secure_url');

        if ($response->failed() || !is_string($url)) {
            Log::error('Échec upload Cloudinary', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new ImageUploadFailedException();
        }

        return $url;
    }
}
