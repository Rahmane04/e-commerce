/**
 * Types purement liés à la présentation (navigation, layout...).
 * À ne pas confondre avec les types du domaine (src/domain), qui décrivent
 * des concepts métier (Product, Cart...) indépendants de l'UI.
 */
export interface NavLink {
  label: string;
  href: string;
}
