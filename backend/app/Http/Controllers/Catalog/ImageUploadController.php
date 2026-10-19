<?php
namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\UploadImageRequest;

class ImageUploadController extends Controller
{
    public function store(UploadImageRequest $request)
    {
        $path = $request->file('image')->store('products', 'public');

        return response()->json(['url' => asset('storage/' . $path)], 201);
    }
}
