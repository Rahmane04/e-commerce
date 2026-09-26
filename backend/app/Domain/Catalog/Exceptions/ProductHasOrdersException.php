<?php
namespace App\Domain\Catalog\Exceptions;

class ProductHasOrdersException extends \DomainException
{
    public function render()
    {
        return response()->json([
            'message' => 'Impossible de supprimer ce produit : il fait partie de commandes existantes. Dépubliez-le plutôt.',
        ], 409);
    }
}