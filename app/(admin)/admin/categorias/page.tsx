import { CategoriesTable } from "@/components/tables/CategoriesTable";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
import { DatabaseCategory } from "@/types/supabase-custom";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    // Handle error appropriately, maybe show an error message component
  }

  // Cast to Category[] to ensure type compatibility
  // Cast to Category[] to ensure type compatibility
  const formattedCategories: Category[] = (categories as unknown as DatabaseCategory[] || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
      </div>
      
      <CategoriesTable initialData={formattedCategories} />
    </div>
  );
}
