<?php

return [
    // "local" (développement) ou "cloudinary" (production)
    'driver' => env('IMAGE_STORAGE_DRIVER', 'local'),

    'cloudinary' => [
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key' => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
        'folder' => env('CLOUDINARY_FOLDER', 'boutique/products'),
    ],
];
