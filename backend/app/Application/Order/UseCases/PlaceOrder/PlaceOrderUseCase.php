<?php
namespace App\Application\Order\UseCases\PlaceOrder;

use App\Application\Catalog\Ports\ProductRepositoryInterface;
use App\Application\Customer\UseCases\FindOrCreateCustomer\FindOrCreateCustomerUseCase;
use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Domain\Catalog\Exceptions\InvalidVariantException;
use App\Domain\Catalog\Exceptions\ProductNotFoundException;
use App\Domain\Catalog\Product;
use App\Domain\Catalog\ProductVariant;
use App\Domain\Order\{Order, OrderStatus};
use Illuminate\Support\Facades\DB;

class PlaceOrderUseCase
{
    public function __construct(
        private ProductRepositoryInterface $products,
        private OrderRepositoryInterface $orders,
        private FindOrCreateCustomerUseCase $findOrCreateCustomer,
    ) {}

    public function execute(PlaceOrderCommand $command): Order
    {
        return DB::transaction(function () use ($command) {
            $customer = $this->findOrCreateCustomer->execute(
                $command->customerName,
                $command->customerPhone,
                $command->customerEmail,
            );

            $orderItems = [];
            foreach ($command->items as $line) {
                $product = $this->products->findById($line['product_id']);
                if ($product === null) {
                    throw new ProductNotFoundException();
                }

                // La variante est résolue depuis la base : on ne fait pas confiance au front.
                $variant = $this->resolveVariant($product, $line['variant_id'] ?? null);

                $orderItems[] = [
                    'product_id' => $product->id,
                    'variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'variant_label' => $variant?->label,
                    'variant_value' => $variant?->value,
                    'unit_price_cents' => $product->price->toCents(),
                    'quantity' => $line['quantity'],
                ];
            }

            foreach ($orderItems as $item) {
                $this->products->decrementStock($item['product_id'], $item['variant_id'], $item['quantity']);
            }

            return $this->orders->create([
                'customer_id' => $customer->id,
                'customer_name' => $command->customerName,
                'customer_phone' => $command->customerPhone,
                'customer_email' => $command->customerEmail,
                'delivery_address' => $command->deliveryAddress,
                'delivery_notes' => $command->deliveryNotes,
                'status' => OrderStatus::EnAttente->value,
                'items' => $orderItems,
            ]);
        });
    }

    /**
     * Règle : un produit avec variantes exige une variante qui lui appartient ;
     * un produit sans variante n'en accepte aucune.
     */
    private function resolveVariant(Product $product, mixed $variantId): ?ProductVariant
    {
        if (count($product->variants) === 0) {
            if ($variantId !== null) {
                throw new InvalidVariantException("Le produit « {$product->name} » n'a pas de variante.");
            }
            return null;
        }

        if ($variantId === null) {
            throw new InvalidVariantException("Veuillez choisir une variante pour « {$product->name} ».");
        }

        foreach ($product->variants as $variant) {
            if ($variant->id === (int) $variantId) {
                return $variant;
            }
        }

        throw new InvalidVariantException("Variante invalide pour « {$product->name} ».");
    }
}
