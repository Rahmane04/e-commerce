import { ProductRepository } from "@/application/ports/product-repository";
import { Cart, addItemToCart } from "@/domain/cart/cart";
import { isProductInStock, primaryProductImage } from "@/domain/product/product";

export interface AddProductToCartCommand {
  productId: string;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
}

export class OutOfStockError extends Error {
  constructor(productName: string) {
    super(`"${productName}" n'est plus disponible.`);
    this.name = "OutOfStockError";
  }
}

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produit introuvable.");
    this.name = "ProductNotFoundError";
  }
}

/**
 * Ajoute un produit au panier après vérification de sa disponibilité.
 * C'est le point d'entrée que l'UI (et plus tard une éventuelle API route)
 * doit appeler — jamais directement `addItemToCart`, pour ne pas contourner
 * la vérification de stock.
 */
export async function addProductToCart(
  repo: ProductRepository,
  cart: Cart,
  command: AddProductToCartCommand,
): Promise<Cart> {
  const products = await repo.findAll();
  const product = products.find((p) => p.id === command.productId);

  if (!product) throw new ProductNotFoundError();
  if (!isProductInStock(product)) throw new OutOfStockError(product.name);

  return addItemToCart(cart, {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    imageUrl: primaryProductImage(product).url,
    priceCents: product.priceCents,
    quantity: command.quantity,
    variantId: command.variantId,
    variantLabel: command.variantLabel,
  });
}
