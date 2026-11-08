<?php
namespace Tests\Unit;

use App\Domain\Order\OrderStatus;
use PHPUnit\Framework\TestCase;

class OrderStatusTest extends TestCase
{
    public function test_en_attente_peut_etre_confirmee_ou_annulee(): void
    {
        $this->assertTrue(OrderStatus::EnAttente->canTransitionTo(OrderStatus::Confirmee));
        $this->assertTrue(OrderStatus::EnAttente->canTransitionTo(OrderStatus::Annulee));
    }

    public function test_en_attente_ne_peut_pas_sauter_des_etapes(): void
    {
        $this->assertFalse(OrderStatus::EnAttente->canTransitionTo(OrderStatus::Expediee));
        $this->assertFalse(OrderStatus::EnAttente->canTransitionTo(OrderStatus::Livree));
    }

    public function test_confirmee_peut_etre_expediee_ou_annulee(): void
    {
        $this->assertTrue(OrderStatus::Confirmee->canTransitionTo(OrderStatus::Expediee));
        $this->assertTrue(OrderStatus::Confirmee->canTransitionTo(OrderStatus::Annulee));
    }

    public function test_expediee_ne_peut_plus_etre_annulee(): void
    {
        $this->assertTrue(OrderStatus::Expediee->canTransitionTo(OrderStatus::Livree));
        $this->assertFalse(OrderStatus::Expediee->canTransitionTo(OrderStatus::Annulee));
    }

    public function test_livree_et_annulee_sont_des_etats_finaux(): void
    {
        $this->assertSame([], OrderStatus::Livree->nextPossible());
        $this->assertSame([], OrderStatus::Annulee->nextPossible());
    }

    public function test_aucun_retour_en_arriere(): void
    {
        $this->assertFalse(OrderStatus::Confirmee->canTransitionTo(OrderStatus::EnAttente));
        $this->assertFalse(OrderStatus::Livree->canTransitionTo(OrderStatus::Expediee));
    }
}