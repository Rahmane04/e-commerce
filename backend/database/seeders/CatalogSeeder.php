<?php
namespace Database\Seeders;

use App\Infrastructure\Catalog\Persistence\CategoryModel;
use App\Infrastructure\Catalog\Persistence\ProductModel;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // ── Catégories + sous-catégories ────────────────────────────────
        $vetements = CategoryModel::create(['slug' => 'vetements', 'name' => 'Vêtements', 'description' => 'Pièces du quotidien et tenues élégantes.', 'display_order' => 1]);
        $vetementsHommes = CategoryModel::create(['slug' => 'vetements-hommes', 'name' => 'Hommes', 'parent_id' => $vetements->id, 'display_order' => 1]);
        $vetementsFemmes = CategoryModel::create(['slug' => 'vetements-femmes', 'name' => 'Femmes', 'parent_id' => $vetements->id, 'display_order' => 2]);
        CategoryModel::create(['slug' => 'vetements-enfants', 'name' => 'Enfants', 'parent_id' => $vetements->id, 'display_order' => 3]);

        $lingerie = CategoryModel::create(['slug' => 'lingerie', 'name' => 'Lingerie', 'description' => 'Délicatesse, douceur et féminité.', 'display_order' => 2]);
        $lingerieEnsembles = CategoryModel::create(['slug' => 'lingerie-ensembles', 'name' => 'Ensembles', 'parent_id' => $lingerie->id, 'display_order' => 1]);
        $lingerieNuit = CategoryModel::create(['slug' => 'lingerie-nuit', 'name' => 'Nuit', 'parent_id' => $lingerie->id, 'display_order' => 2]);
        CategoryModel::create(['slug' => 'lingerie-homewear', 'name' => 'Homewear', 'parent_id' => $lingerie->id, 'display_order' => 3]);

        $maison = CategoryModel::create(['slug' => 'linge-de-maison', 'name' => 'Linge de maison', 'description' => 'Draps, taies et parures pour une chambre soignée.', 'display_order' => 3]);
        $encens = CategoryModel::create(['slug' => 'encens-parfums', 'name' => 'Encens & parfums', 'description' => 'Encens et senteurs pour la maison.', 'display_order' => 4]);
        $accessoires = CategoryModel::create(['slug' => 'accessoires', 'name' => 'Accessoires', 'description' => 'Les détails qui complètent une tenue ou un intérieur.', 'display_order' => 5]);

        // ── Produits ─────────────────────────────────────────────────────
        $img = fn (string $seed) => "https://picsum.photos/seed/{$seed}/900/1125";

        // Vêtements, rattachés à leur sous-catégorie quand c'est pertinent
        $this->product($vetementsFemmes->id, 'robe-wax-manches-longues', 'Robe wax manches longues',
            'Robe mi-longue en wax authentique, coupe cintrée et manches longues.',
            2500000, 3200000, [$img('robe-wax-1'), $img('robe-wax-2')], 10, true, false,
            [['label' => 'Taille', 'value' => 'S', 'stock' => 3], ['label' => 'Taille', 'value' => 'M', 'stock' => 5], ['label' => 'Taille', 'value' => 'L', 'stock' => 2]]);

        $this->product($vetementsHommes->id, 'ensemble-boubou-brode', 'Ensemble boubou brodé',
            'Ensemble traditionnel boubou brodé main, tissu bazin riche.',
            4800000, null, [$img('boubou-1')], 6, false, false,
            [['label' => 'Taille', 'value' => 'M', 'stock' => 2], ['label' => 'Taille', 'value' => 'L', 'stock' => 3], ['label' => 'Taille', 'value' => 'XL', 'stock' => 1]]);

        $this->product($vetementsFemmes->id, 'top-satin-manches-ballon', 'Top satin manches ballon',
            'Top en satin fluide à manches ballon, col rond.',
            1600000, null, [$img('top-1')], 4, false, true,
            [['label' => 'Taille', 'value' => 'S', 'stock' => 4], ['label' => 'Taille', 'value' => 'M', 'stock' => 0]]);

        // Lingerie, rattachée à sa sous-catégorie
        $this->product($lingerieEnsembles->id, 'ensemble-lingerie-dentelle-bordeaux', 'Ensemble lingerie dentelle bordeaux',
            'Ensemble deux pièces en dentelle fine, coloris bordeaux.',
            1800000, null, [$img('lingerie-1'), $img('lingerie-2')], 10, true, true,
            [['label' => 'Taille', 'value' => '85B', 'stock' => 4], ['label' => 'Taille', 'value' => '90B', 'stock' => 4], ['label' => 'Taille', 'value' => '90C', 'stock' => 2]]);

        $this->product($lingerieNuit->id, 'ensemble-lingerie-satin-ivoire', 'Ensemble lingerie satin ivoire',
            'Nuisette et culotte assortie en satin ivoire, finitions dentelle délicate.',
            2100000, null, [$img('lingerie-3')], 3, false, false,
            [['label' => 'Taille', 'value' => 'S', 'stock' => 0], ['label' => 'Taille', 'value' => 'M', 'stock' => 3]]);

        // Linge de maison, encens, accessoires : pas de sous-catégorie, restent sur la racine
        $this->product($maison->id, 'parure-drap-percale-terracotta', 'Parure de drap percale terracotta',
            'Parure complète en percale de coton 100%, coloris terracotta.',
            3500000, 4200000, [$img('draps-1'), $img('draps-2')], 10, false, false,
            [['label' => 'Dimension', 'value' => '140x190 cm', 'stock' => 6], ['label' => 'Dimension', 'value' => '160x200 cm', 'stock' => 4]]);

        $this->product($maison->id, 'parure-drap-lin-lave-sable', 'Parure de drap lin lavé sable',
            'Lin lavé teint dans la masse, coloris sable.',
            4500000, null, [$img('draps-3')], 7, true, true, []);

        $this->product($encens->id, 'coffret-encens-bois-de-santal', 'Coffret encens bois de santal',
            'Coffret de 20 bâtonnets d\'encens au bois de santal.',
            750000, null, [$img('encens-1')], 15, false, false, []);

        $this->product($encens->id, 'coffret-encens-fleur-oranger', 'Coffret encens fleur d\'oranger',
            'Bâtonnets d\'encens artisanaux, senteur florale et fraîche.',
            750000, 900000, [$img('encens-2')], 0, false, false, []);

        $this->product($accessoires->id, 'sac-cabas-raphia-naturel', 'Sac cabas raphia naturel',
            'Sac cabas tressé main en raphia naturel, anses en cuir.',
            1500000, null, [$img('sac-1'), $img('sac-2')], 8, true, false, []);

        $this->product($accessoires->id, 'foulard-soie-imprime-wax', 'Foulard en soie imprimé wax',
            'Foulard 100% soie, imprimé exclusif inspiré des motifs wax.',
            950000, null, [$img('foulard-1')], 10, false, true,
            [['label' => 'Couleur', 'value' => 'Bordeaux', 'stock' => 5], ['label' => 'Couleur', 'value' => 'Ocre', 'stock' => 5]]);

        $this->product($encens->id, 'boite-encens-musc-blanc', 'Boîte encens musc blanc',
            'Encens en poudre au musc blanc, senteur poudrée et enveloppante.',
            600000, null, [$img('encens-3')], 12, false, false, []);
    }

    private function product(
        int $categoryId, string $slug, string $name, string $description,
        int $priceCents, ?int $compareAtPriceCents, array $images,
        int $stock, bool $featured, bool $isNew, array $variants,
    ): void {
        $product = ProductModel::create([
            'slug' => $slug,
            'name' => $name,
            'description' => $description,
            'category_id' => $categoryId,
            'price_cents' => $priceCents,
            'compare_at_price_cents' => $compareAtPriceCents,
            'stock' => $stock,
            'images' => $images,
            'featured' => $featured,
            'is_new' => $isNew,
            'is_published' => true,
        ]);

        if (!empty($variants)) {
            $product->variants()->createMany($variants);
        }
    }
}