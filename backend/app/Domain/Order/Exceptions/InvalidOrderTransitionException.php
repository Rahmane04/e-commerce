<?php
namespace App\Domain\Order\Exceptions;

use App\Domain\Order\OrderStatus;

class InvalidOrderTransitionException extends \DomainException
{
    public function __construct(OrderStatus $from, OrderStatus $to)
    {
        parent::__construct("Transition invalide : {$from->value} → {$to->value}.");
    }
    public function render() { return response()->json(['message' => $this->getMessage()], 422); }
}