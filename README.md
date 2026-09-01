# La Boutique — V1 (démo, données mockées)

Boutique e-commerce mode / lingerie / maison. Cette V1 est une démo
front-end uniquement (Next.js + données locales), pensée pour être montrée
à la propriétaire avant de construire le vrai backend (Laravel, V2).

## Stack

- Next.js 16 (App Router, React Server Components par défaut)
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui (composants installés manuellement, voir note ci-dessous)
- Zustand (persist) pour le panier
- Données mockées locales (`src/data`)

## Pourquoi cette architecture ?

Le projet applique une version **légère** de Domain-Driven Design /
architecture hexagonale, pour deux raisons concrètes (pas pour la forme) :

1. **Centraliser les règles métier.** Le calcul des prix, des remises, du
   stock et du panier ne doit jamais être dupliqué dans des composants
   React — voir `src/domain`.
2. **Préparer la V2 sans réécrire le front.** Quand le vrai backend
   Laravel existera, seul `src/infrastructure/repositories` sera
   remplacé (un adapter `ApiProductRepository` implémentant le même
   port `ProductRepository`). Le domaine, l'application et l'UI ne
   changeront pas.

```
src/
├── domain/            Règles métier pures. Aucune dépendance à Next.js,
│                       Zustand ou une API. Testable sans framework.
│   ├── product/          Product, Category + règles (stock, remise...)
│   ├── cart/             Cart (agrégat), CartItem — fonctions immuables
│   └── shared/           Money (value object, calculs de prix centralisés)
│
├── application/       Orchestration. Définit des "ports" (interfaces)
│                       et des use-cases qui les consomment.
│   ├── ports/            Contrats (ex: ProductRepository)
│   ├── product/          Use-cases catalogue (recherche, filtres...)
│   └── cart/             Use-cases panier (ajout avec vérif. de stock)
│
├── infrastructure/    Implémentations concrètes des ports.
│   ├── repositories/     MockProductRepository (V1) → ApiProductRepository (V2)
│   └── store/            Zustand cart-store: relie le domain Cart à React
│
├── data/               Données mockées typées (produits, catégories)
├── types/              Types UI uniquement (pas de règles métier ici)
├── components/
│   ├── ui/               Primitives shadcn/ui, adaptées aux tokens de marque
│   ├── layout/           Header, navigation, panier
│   └── product/          Carte produit, etc.
└── app/                Routes Next.js (App Router)
```

**Règle simple à retenir en développant :** si vous écrivez un calcul de
prix, une vérification de stock ou une règle métier dans un composant
`.tsx`, c'est probablement au mauvais endroit — ça doit vivre dans
`src/domain` ou `src/application`.

## shadcn/ui — installation manuelle

Le CLI `shadcn` interroge `ui.shadcn.com`, injoignable depuis cet
environnement de build. Les composants (`Button`, `Badge` pour l'instant)
ont donc été écrits à la main en suivant le pattern shadcn standard
(CVA + Radix + `cn()`). Pour ajouter un nouveau composant sur une machine
avec accès réseau complet :

```bash
npx shadcn@latest add dialog sheet select dropdown-menu sonner
```

Sinon, les composants peuvent être copiés manuellement depuis
https://ui.shadcn.com/docs/components et adaptés aux tokens définis dans
`src/app/globals.css`.

## Design tokens

Palette et polices définies dans `src/app/globals.css` (variables CSS) et
`src/app/layout.tsx` (polices). Palette actuelle : ivoire chaud, bordeaux
profond (`--primary`), laiton (`--secondary`) — à valider/affiner lors de
la passe design system dédiée, avec la propriétaire de la boutique.

## Démarrer

```bash
npm install
npm run dev
```

## Prochaines étapes (dans l'ordre suggéré)

1. Design system complet (composants shadcn restants, états hover/disabled/loading)
2. Pages catégorie, produit, panier, commande (WhatsApp)
3. Tests des règles métier critiques (`src/domain/cart`, `src/domain/shared/money`)
4. V2 : backend Laravel (DDD + hexagonal), remplacement de `MockProductRepository`
