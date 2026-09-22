<?php
namespace App\Domain\Catalog\Exceptions;

class OutOfStockException extends \DomainException
{
    public function render() { return response()->json(['message' => $this->getMessage()], 422); }
}