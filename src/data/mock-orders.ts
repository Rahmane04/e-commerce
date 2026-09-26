import { Order } from "@/domain/order/order";

export const mockOrders: Order[] = [
  {
    id: "CMD-001",
    createdAt: "2026-08-28T10:30:00.000Z",
    status: "livree",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-08-28T10:30:00.000Z" },
      { status: "en_attente", changedAt: "2026-08-28T14:00:00.000Z" },
      { status: "en_attente", changedAt: "2026-08-29T09:00:00.000Z" },
      { status: "livree", changedAt: "2026-08-30T16:00:00.000Z" },
    ],
    customer: {
      fullName: "Aminata Diallo",
      phone: "77 123 45 67",
      email: "aminata.diallo@gmail.com",
      city: "Dakar",
      address: "15 Rue des Jasmins, Plateau",
      landmark: "Près de la mosquée",
    },
    items: [
      { productId: "p-01", productName: "Robe wax manches longues", variantLabel: "Taille M", quantity: 1, priceCents: 2500000 },
      { productId: "p-06", productName: "Coffret encens bois de santal", quantity: 2, priceCents: 750000 },
    ],
    totalCents: 4000000,
  },
  {
    id: "CMD-002",
    createdAt: "2026-09-01T08:15:00.000Z",
    status: "en_attente",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-09-01T08:15:00.000Z" },
      { status: "en_attente", changedAt: "2026-09-01T11:30:00.000Z" },
      { status: "en_attente", changedAt: "2026-09-02T10:00:00.000Z" },
    ],
    customer: {
      fullName: "Fatou Sow",
      phone: "76 987 65 43",
      city: "Thiès",
      address: "Quartier Mbour Thialy, Villa 7",
    },
    items: [
      { productId: "p-04", productName: "Parure de drap percale terracotta", variantLabel: "160x200 cm", quantity: 1, priceCents: 2400000 },
    ],
    totalCents: 2400000,
  },
  {
    id: "CMD-003",
    createdAt: "2026-09-02T14:45:00.000Z",
    status: "en_attente",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-09-02T14:45:00.000Z" },
      { status: "en_attente", changedAt: "2026-09-02T17:00:00.000Z" },
    ],
    customer: {
      fullName: "Rokhaya Mbaye",
      phone: "70 456 78 90",
      email: "rokhaya@outlook.com",
      city: "Dakar",
      address: "Cité Keur Gorgui, Apt 3B",
      notes: "Appeler avant la livraison",
    },
    items: [
      { productId: "p-02", productName: "Ensemble lingerie dentelle bordeaux", variantLabel: "90B", quantity: 1, priceCents: 1800000 },
      { productId: "p-22", productName: "Bougie relaxante", quantity: 1, priceCents: 720000 },
    ],
    totalCents: 2520000,
  },
  {
    id: "CMD-004",
    createdAt: "2026-09-03T09:00:00.000Z",
    status: "en_attente",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-09-03T09:00:00.000Z" },
    ],
    customer: {
      fullName: "Ibrahima Kane",
      phone: "78 321 09 87",
      city: "Saint-Louis",
      address: "Rue Khalifa Ababacar Sy",
    },
    items: [
      { productId: "p-08", productName: "Sac cabas raphia naturel", quantity: 1, priceCents: 1500000 },
      { productId: "p-24", productName: "Ceinture classique", quantity: 1, priceCents: 920000 },
    ],
    totalCents: 2420000,
  },
  {
    id: "CMD-005",
    createdAt: "2026-09-03T11:20:00.000Z",
    status: "en_attente",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-09-03T11:20:00.000Z" },
    ],
    customer: {
      fullName: "Mariama Bah",
      phone: "77 654 32 10",
      email: "mariama.bah@yahoo.fr",
      city: "Dakar",
      address: "Mermoz, Villa 42",
      landmark: "Face au supermarché Casino",
    },
    items: [
      { productId: "p-05", productName: "Parure de drap lin lavé sable", quantity: 1, priceCents: 2500000 },
    ],
    totalCents: 2500000,
  },
  {
    id: "CMD-006",
    createdAt: "2026-08-20T16:00:00.000Z",
    status: "livree",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-08-20T16:00:00.000Z" },
      { status: "livree", changedAt: "2026-08-21T09:30:00.000Z", note: "Client injoignable après 3 tentatives" },
    ],
    customer: {
      fullName: "Omar Ndiaye",
      phone: "76 111 22 33",
      city: "Ziguinchor",
      address: "Quartier Lyndiane",
    },
    items: [
      { productId: "p-15", productName: "T-shirt Paris Blanc", variantLabel: "Taille L", quantity: 2, priceCents: 1200000 },
    ],
    totalCents: 2400000,
  },
  {
    id: "CMD-007",
    createdAt: "2026-08-25T13:30:00.000Z",
    status: "livree",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-08-25T13:30:00.000Z" },
      { status: "en_attente", changedAt: "2026-08-25T15:00:00.000Z" },
      { status: "en_attente", changedAt: "2026-08-26T08:00:00.000Z" },
      { status: "livree", changedAt: "2026-08-27T14:00:00.000Z" },
    ],
    customer: {
      fullName: "Khady Fall",
      phone: "70 777 88 99",
      city: "Dakar",
      address: "Sacré-Cœur 3, Villa 18",
    },
    items: [
      { productId: "p-13", productName: "Set de serviettes de bain en coton bio", quantity: 1, priceCents: 2200000 },
      { productId: "p-21", productName: "Parfum d'intérieur premium", quantity: 1, priceCents: 890000 },
    ],
    totalCents: 3090000,
  },
  {
    id: "CMD-008",
    createdAt: "2026-09-03T18:05:00.000Z",
    status: "en_attente",
    statusHistory: [
      { status: "en_attente", changedAt: "2026-09-03T18:05:00.000Z" },
    ],
    customer: {
      fullName: "Sokhna Diop",
      phone: "77 000 11 22",
      email: "sokhna@gmail.com",
      city: "Dakar",
      address: "Point E, Rue 10",
    },
    items: [
      { productId: "p-17", productName: "Polo noir licorne", variantLabel: "Taille M", quantity: 1, priceCents: 750000 },
      { productId: "p-23", productName: "Collier élégant", quantity: 1, priceCents: 850000 },
    ],
    totalCents: 1600000,
  },
];
