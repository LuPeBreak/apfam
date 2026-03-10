import { prisma } from "@/lib/prisma";

export async function getAssociateBySlug(slug: string) {
  if (!slug) return null;

  try {
    const associate = await prisma.associate.findUnique({
      where: {
        slug,
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return associate;
  } catch (error) {
    console.error(`Error fetching associate by slug ${slug}:`, error);
    return null;
  }
}
