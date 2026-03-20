"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG_FIELDS, type SiteConfigItem } from "@/lib/site-config";

export const getSiteConfigs = withPermissions(
  [{ resource: "site-config", action: ["list"] }],
  async () => {
    const allFields: SiteConfigItem[] = [];

    for (const [section, fields] of Object.entries(SITE_CONFIG_FIELDS)) {
      for (const field of Object.values(fields)) {
        allFields.push({
          key: field.key,
          value: field.default ?? "",
          type: field.type,
          label: field.label,
          section,
          default: field.default ?? "",
        });
      }
    }

    const dbValues = await prisma.siteConfig.findMany({
      where: { key: { in: allFields.map((f) => f.key) } },
    });

    const dbMap = Object.fromEntries(dbValues.map((c) => [c.key, c.value]));

    return allFields.map((field) => ({
      ...field,
      value: dbMap[field.key] ?? field.default,
    }));
  },
);
