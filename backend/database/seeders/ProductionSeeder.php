<?php
namespace Database\Seeders;

use App\Infrastructure\Catalog\Persistence\CategoryModel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Données minimales pour la production : catégories + compte admin.
 * Idempotent : sans effet si les catégories ou un utilisateur existent déjà.
 */
class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->seedCategories();
            $this->seedAdmin();
        });
    }

    private function seedCategories(): void
    {
        if (CategoryModel::query()->exists()) {
            return;
        }

        $roots = [
            ['vetements', 'Vêtements', 'Pièces du quotidien et tenues élégantes.', 1,
                [['vetements-hommes', 'Hommes'], ['vetements-femmes', 'Femmes'], ['vetements-enfants', 'Enfants']]],
            ['lingerie', 'Lingerie', 'Délicatesse, douceur et féminité.', 2,
                [['lingerie-ensembles', 'Ensembles'], ['lingerie-nuit', 'Nuit'], ['lingerie-homewear', 'Homewear']]],
            ['linge-de-maison', 'Linge de maison', 'Draps, taies et parures pour une chambre soignée.', 3, []],
            ['encens-parfums', 'Encens & parfums', 'Encens et senteurs pour la maison.', 4, []],
            ['accessoires', 'Accessoires', 'Les détails qui complètent une tenue ou un intérieur.', 5, []],
        ];

        foreach ($roots as [$slug, $name, $description, $order, $children]) {
            $root = $this->save([
                'slug' => $slug,
                'name' => $name,
                'description' => $description,
                'display_order' => $order,
            ]);

            foreach ($children as $i => [$childSlug, $childName]) {
                $this->save([
                    'slug' => $childSlug,
                    'name' => $childName,
                    'parent_id' => $root->id,
                    'display_order' => $i + 1,
                ]);
            }
        }
    }

    private function seedAdmin(): void
    {
        $email = config('shop.admin_email');
        $password = config('shop.admin_password');

        if (!$email || !$password || User::query()->exists()) {
            return;
        }

        // Le mot de passe est haché automatiquement (cast "hashed" du modèle User).
        User::create(['name' => 'Admin', 'email' => $email, 'password' => $password]);
    }

    private function save(array $attributes): CategoryModel
    {
        $category = new CategoryModel();
        $category->forceFill($attributes)->save();

        return $category;
    }
}