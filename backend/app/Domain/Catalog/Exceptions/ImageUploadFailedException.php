<?php
namespace App\Domain\Catalog\Exceptions;

class ImageUploadFailedException extends \DomainException
{
    public function render()
    {
        return response()->json(['message' => "L'envoi de la photo a échoué. Réessayez dans un instant."], 502);
    }
}
