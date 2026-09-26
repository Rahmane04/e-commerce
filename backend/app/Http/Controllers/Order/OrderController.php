<?php
namespace App\Http\Controllers\Order;

use App\Application\Order\Ports\OrderRepositoryInterface;
use App\Application\Order\UseCases\CancelOrder\CancelOrderUseCase;
use App\Application\Order\UseCases\ConfirmOrder\ConfirmOrderUseCase;
use App\Application\Order\UseCases\MarkOrderAsDelivered\MarkOrderAsDeliveredUseCase;
use App\Application\Order\UseCases\PlaceOrder\{PlaceOrderCommand, PlaceOrderUseCase};
use App\Application\Order\UseCases\ShipOrder\ShipOrderUseCase;
use App\Domain\Order\{Order, Exceptions\OrderNotFoundException};
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\PlaceOrderRequest;

class OrderController extends Controller
{
    private function toJson(Order $order): array
    {
        return [
            'id' => $order->id,
            'status' => $order->status->value,
            'customerName' => $order->customerName,
            'totalCents' => $order->total()->toCents(),
            'items' => array_map(fn ($i) => [
                'productName' => $i->productName,
                'quantity' => $i->quantity,
                'unitPriceCents' => $i->unitPrice->toCents(),
            ], $order->items),
        ];
    }

    public function index(OrderRepositoryInterface $orders)
    {
        return response()->json(array_map(fn ($o) => $this->toJson($o), $orders->findAll()));
    }

    public function show(int $id, OrderRepositoryInterface $orders)
    {
        $order = $orders->findById($id);
        if (!$order) throw new OrderNotFoundException();
        return response()->json($this->toJson($order));
    }

    public function store(PlaceOrderRequest $request, PlaceOrderUseCase $useCase)
    {
        $command = new PlaceOrderCommand(
            customerName: $request->string('customer_name')->toString(),
            customerPhone: $request->string('customer_phone')->toString(),
            customerEmail: $request->input('customer_email'),
            deliveryAddress: $request->string('delivery_address')->toString(),
            deliveryNotes: $request->input('delivery_notes'),
            items: $request->input('items'),
        );

        $order = $useCase->execute($command);
        return response()->json($this->toJson($order), 201);
    }

    public function confirm(int $id, ConfirmOrderUseCase $useCase)
    {
        return response()->json($this->toJson($useCase->execute($id)));
    }

    public function ship(int $id, ShipOrderUseCase $useCase)
    {
        return response()->json($this->toJson($useCase->execute($id)));
    }

    public function deliver(int $id, MarkOrderAsDeliveredUseCase $useCase)
    {
        return response()->json($this->toJson($useCase->execute($id)));
    }

    public function cancel(int $id, CancelOrderUseCase $useCase)
    {
        return response()->json($this->toJson($useCase->execute($id)));
    }
}