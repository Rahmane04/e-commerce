<?php
namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /** Normalise le téléphone en +221XXXXXXXXX quand il est reconnu (espaces, 00221, 221 acceptés). */
    protected function prepareForValidation(): void
    {
        $raw = preg_replace('/[\s.\-()]/', '', (string) $this->input('customer_phone'));

        if (preg_match('/^(?:\+221|00221|221)?((?:7[05678]|33)\d{7})$/', $raw, $m)) {
            $this->merge(['customer_phone' => '+221' . $m[1]]);
        }
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'regex:/^\+221(?:7[05678]|33)\d{7}$/'],
            'customer_email' => ['nullable', 'email'],
            'delivery_address' => ['required', 'string'],
            'delivery_notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_phone.regex' => 'Numéro de téléphone invalide (exemple : 77 123 45 67).',
        ];
    }
}