<?php
namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'price_cents' => ['sometimes', 'integer', 'min:0'],
            'compare_at_price_cents' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'images' => ['sometimes', 'array'],
            'featured' => ['sometimes', 'boolean'],
            'is_new' => ['sometimes', 'boolean'],
        ];
    }
}