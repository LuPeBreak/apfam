export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryIds?: string[];
  categoryNames?: string[]; // Denormalized for display
  description?: string;
  imageUrl?: string;
  associateId?: string;
  associateName?: string;
  associateCount?: number;
}

export interface Associate {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  products: Product[]; // Products this associate sells
  location?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  location: string;
  imageUrl?: string;
}
