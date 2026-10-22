<?php
namespace App\Domain\Catalog\Exceptions;

class InvalidVariantException extends \DomainException
{
    public function render()
    {
        return response()->json(['message' => $this->getMessage()], 422);
    }
}
