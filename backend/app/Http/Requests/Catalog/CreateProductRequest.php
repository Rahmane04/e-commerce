<?php
namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // la vraie autorisation (admin connecté) viendra avec Sanctum, pas encore branchée ici
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price_cents' => ['required', 'integer', 'min:0'],
            'compare_at_price_cents' => ['nullable', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'featured' => ['boolean'],
            'is_new' => ['boolean'],
            'variants' => ['nullable', 'array'],
            'variants.*.label' => ['required_with:variants', 'string'],
            'variants.*.value' => ['required_with:variants', 'string'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
        ];
    }
}