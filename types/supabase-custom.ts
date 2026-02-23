export interface DatabaseEvent {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  image_url: string;
  slug: string;
}

export interface DatabaseCategory {
  id: string;
  name: string;
}

export interface DatabaseProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  slug: string;
  created_at: string;
}

// Basic types
export interface DatabaseAssociate {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string;
  slug: string;
  created_at: string;
}

// Join types
export interface ProductWithCategories extends DatabaseProduct {
  product_categories: {
    category_id: string;
    categories: DatabaseCategory; 
  }[];
}

export interface ProductWithCategoriesAndAssociates extends ProductWithCategories {
  associate_products: {
    associate_id: string; // This might be missing if we select through the join table directly without selecting the join table fields? No, usually distinct.
                         // Actually the query select `associate_products(associates(...))` returns an array of objects which contain `associates`.
    // If the query is `associate_products(associates(...))`, the result structure depends on if it's many-to-many via a join table.
    // Assuming `associate_products` IS the join table.
    associates: {
      id: string;
      name: string;
      slug: string;
      location: string | null;
      avatar_url: string;
    };
  }[];
}

export interface ProductWithAssociateNames extends ProductWithCategories {
  associate_products: {
    associates: {
      name: string;
    };
  }[];
}

export interface AssociateWithProducts {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string;
  slug: string;
  created_at: string;
  associate_products: {
    product_id: string;
    products: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface ProductJoinCategory {
    category_id: string;
    categories: DatabaseCategory;
}
