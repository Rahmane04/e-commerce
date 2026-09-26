<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Catalog\CategoryController;
use App\Http\Controllers\Catalog\ProductController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Order\OrderController;
use Illuminate\Support\Facades\Route;

// --- Public : consultation du catalogue + passage de commande (pas de compte client en V1) ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/id/{id}', [ProductController::class, 'showById']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);

// --- Protégé : réservé à l'admin connectée ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);
    Route::post('/products/{id}/publish', [ProductController::class, 'publish']);
    Route::post('/products/{id}/unpublish', [ProductController::class, 'unpublish']);

    Route::post('/categories', [CategoryController::class, 'store']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/confirm', [OrderController::class, 'confirm']);
    Route::post('/orders/{id}/ship', [OrderController::class, 'ship']);
    Route::post('/orders/{id}/deliver', [OrderController::class, 'deliver']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);

    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::patch('/categories/{slug}', [CategoryController::class, 'update']);
    Route::delete('/categories/{slug}', [CategoryController::class, 'destroy']);
});