import { notFound } from "next/navigation";
import { productRepository } from "@/infrastructure/repositories/api-product-repository";
import { categoryVisuals } from "@/lib/category-visuals";
import { CategoryView } from "@/components/category/category-view";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray[0];

  // Catégorie virtuelle "nouveautés"
  const isNouveautes = slug === "nouveautes";

  const allCategories = await productRepository.findCategories().catch(() => []);
  const category = isNouveautes
    ? { slug: "nouveautes", name: "Nouveautés", description: "Nos dernières arrivées.", subcategories: [] }
    : allCategories.find((c) => c.slug === slug);

  if (!category) notFound();

  const visual = categoryVisuals[slug] ?? categoryVisuals["vetements"];

  const products = isNouveautes
    ? (await productRepository.findAll().catch(() => [])).filter((p) => p.isNew)
    : await productRepository.findByCategory(slug).catch(() => []);

  return (
    <CategoryView
      category={category}
      products={products}
      visual={visual}
      slugArray={slugArray}
    />
  );
}
