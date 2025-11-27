import { MOCK_ASSOCIATES, MOCK_CATALOG } from "@/data/mocks";
import { AssociatesTable } from "@/components/admin/tables/AssociatesTable";

export default function AdminAssociatesPage() {
  // In a real app, this would be a DB call
  const associates = MOCK_ASSOCIATES;
  const catalog = MOCK_CATALOG;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Associados</h1>
      </div>

      <AssociatesTable initialData={associates} catalog={catalog} />
    </div>
  );
}
