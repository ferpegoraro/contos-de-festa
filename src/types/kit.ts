export interface KitType {
  id: string;
  slug: string;
  name: string;
  /** Preço do aluguel — todos os kits deste tipo herdam (salvo promoção). */
  price: number;
  /** Itens inclusos em todos os kits deste tipo. */
  items: KitItem[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface KitImage {
  id: string;
  kitId: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

/** Item do catálogo — cadastrado uma vez e reutilizado pelos tipos de kit. */
export interface Item {
  id: string;
  name: string;
}

/** Ligação item ↔ tipo de kit (VO no backend — sem id próprio). */
export interface KitItem {
  itemId: string;
  name: string;
  quantity: number | null;
}

export interface Kit {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string | null;
  /** Preço efetivo calculado pela API: priceOverride ?? kitType.price. */
  price: number;
  /** Preço promocional — null herda o preço do tipo. */
  priceOverride: number | null;
  featured: boolean;
  kitTypeId: string;
  categoryId: string;
  kitType: KitType;
  category: Category;
  images: KitImage[];
}
