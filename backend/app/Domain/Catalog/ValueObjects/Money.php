<?php
namespace App\Domain\Catalog\ValueObjects;

final class Money
{
    private function __construct(private readonly int $cents) {}

    public static function fromCents(int $cents): self
    {
        if ($cents < 0) {
            throw new \InvalidArgumentException("Montant invalide: {$cents}");
        }
        return new self($cents);
    }

    public static function zero(): self
    {
        return new self(0);
    }

    public function add(Money $other): self
    {
        return self::fromCents($this->toCents() + $other->toCents());
    }

    public function multiply(int $factor): self
    {
        return self::fromCents($this->toCents() * $factor);
    }

    public function toCents(): int
    {
        return $this->cents;
    }

    public function isGreaterThan(Money $other): bool
    {
        return $this->cents > $other->cents;
    }
}