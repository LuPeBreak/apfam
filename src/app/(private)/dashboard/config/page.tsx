import { getSiteConfigs } from "@/actions/config/get-site-configs";
import { ConfigTable } from "@/components/dashboard/config-table/config-table";

export default async function ConfigPage() {
  const configs = await getSiteConfigs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Site</h1>
        <p className="text-muted-foreground">Edite textos e imagens do site</p>
      </div>

      <ConfigTable configs={configs} />
    </div>
  );
}
