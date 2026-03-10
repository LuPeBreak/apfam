export type ProductModel = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl: string | null;
  featured: boolean;
  categories: { category: { id: string; name: string } }[];
};

export type AssociateModel = {
  id: string;
  name: string;
  slug: string;
  location: string;
  bio?: string | null;
  avatarUrl: string | null;
};

export type EventModel = {
  id: string;
  name: string;
  slug: string;
  date: Date;
  location: string;
  imageUrl: string | null;
  description?: string | null;
};
