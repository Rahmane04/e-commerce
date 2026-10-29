<?php
namespace App\Http\Controllers\Catalog;

use App\Application\Catalog\Ports\ImageStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\UploadImageRequest;

class ImageUploadController extends Controller
{
    public function store(UploadImageRequest $request, ImageStorageInterface $storage)
    {
        $url = $storage->store($request->file('image'));

        return response()->json(['url' => $url], 201);
    }
}
