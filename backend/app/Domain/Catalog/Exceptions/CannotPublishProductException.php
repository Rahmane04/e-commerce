<?php
namespace App\Domain\Catalog\Exceptions;

class CannotPublishProductException extends \DomainException
{
    public function render()
    {
        return response()->json(['message' => 'Impossible de publier un produit sans image.'], 422);
    }
}