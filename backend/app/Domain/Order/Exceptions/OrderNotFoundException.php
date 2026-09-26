<?php
namespace App\Domain\Order\Exceptions;

class OrderNotFoundException extends \DomainException
{
    public function render() { return response()->json(['message' => 'Commande introuvable.'], 404); }
}