<?php
namespace App\Domain\Catalog\Exceptions;

class ProductNotFoundException extends \DomainException
{
    public function render()
    {
        return response()->json(['message' => 'Produit introuvable.'], 404);
    }
}