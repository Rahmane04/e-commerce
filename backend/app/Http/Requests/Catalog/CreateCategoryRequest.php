<?php
namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}