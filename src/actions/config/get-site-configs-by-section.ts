"use server";

import { prisma } from "@/lib/prisma";
import { SITE_CONFIG_FIELDS, type SiteConfigItem } from "@/lib/site-config";

export async function getSiteConfigsBySection(section: string) {
  const sectionFields = SITE_CONFIG_FIELDS[section];
  if (!sectionFields) return [];

  const fields: SiteConfigItem[] = Object.values(sectionFields).map(
    (field) => ({
      key: field.key,
      value: field.default ?? "",
      type: field.type,
      label: field.label,
      section,
      default: field.default ?? "",
    }),
  );

  const dbValues = await prisma.siteConfig.findMany({
    where: { key: { in: fields.map((f) => f.key) } },
  });

  const dbMap = Object.fromEntries(dbValues.map((c) => [c.key, c.value]));

  return fields.map((field) => ({
    ...field,
    value: dbMap[field.key] ?? field.default,
  }));
}
