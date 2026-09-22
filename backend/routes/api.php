<?php

use App\Http\Controllers\Catalog\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Catalog\CategoryController;
use App\Http\Controllers\Order\OrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::patch('/products/{id}', [ProductController::class, 'update']);
Route::post('/products/{id}/publish', [ProductController::class, 'publish']);
Route::post('/products/{id}/unpublish', [ProductController::class, 'unpublish']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/orders/{id}/confirm', [OrderController::class, 'confirm']);
Route::post('/orders/{id}/ship', [OrderController::class, 'ship']);
Route::post('/orders/{id}/deliver', [OrderController::class, 'deliver']);
Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']); 