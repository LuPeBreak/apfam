export interface SiteConfigField {
  key: string;
  type: "text" | "textarea" | "image" | "array";
  label: string;
  default?: string;
}

export interface SiteConfigItem {
  key: string;
  value: string;
  type: "text" | "textarea" | "image" | "array";
  label: string;
  section: string;
  default: string;
}

export const SITE_CONFIG_FIELDS: Record<
  string,
  Record<string, SiteConfigField>
> = {
  home: {
    heroTitle: {
      key: "home_hero_title",
      type: "text",
      label: "Título Principal",
      default: "Alimento Puro, Cultivo com Tradição.",
    },
    heroSubtitle: {
      key: "home_hero_subtitle",
      type: "textarea",
      label: "Subtítulo",
      default:
        "A APFAM conecta você aos melhores produtos da agricultura familiar de Santa Rita de Cássia e região. Frescor, qualidade e respeito à natureza.",
    },
    heroBadge: {
      key: "home_hero_badge",
      type: "text",
      label: "Texto do Badge",
      default: "Do campo direto para a sua mesa",
    },
    heroBackground: {
      key: "home_hero_background",
      type: "image",
      label: "Imagem de Fundo",
      default: "/images/hero-bg.webp",
    },
    aboutTitle: {
      key: "home_about_title",
      type: "text",
      label: "Título - Sobre",
      default: "Semeando o futuro, cultivando a tradição.",
    },
    aboutDescription: {
      key: "home_about_description",
      type: "textarea",
      label: "Descrição - Sobre",
      default:
        "A APFAM nasceu da união de trabalhadores rurais de Santa Rita de Cássia e região com um objetivo comum: fortalecer a agricultura familiar, promover a sustentabilidade e levar comida de verdade para a mesa das pessoas.",
    },
    aboutImage: {
      key: "home_about_image",
      type: "image",
      label: "Imagem - Sobre",
      default: "/images/about-farmer.webp",
    },
    aboutBenefits: {
      key: "home_about_benefits",
      type: "array",
      label: "Benefícios - Sobre",
      default: JSON.stringify([
        "Qualidade direto da terra",
        "Apoio à economia local",
        "Cultivo com respeito ao meio ambiente",
        "Sem atravessadores",
      ]),
    },
    featuredProductsTitle: {
      key: "home_featured_products_title",
      type: "text",
      label: "Título - Produtos em Destaque",
      default: "Destaques da Nossa Terra",
    },
    featuredProductsDescription: {
      key: "home_featured_products_description",
      type: "textarea",
      label: "Descrição - Produtos em Destaque",
      default:
        "Cultivados com carinho pelas nossas famílias associadas. Conheça alguns dos produtos mais procurados.",
    },
    featuredEventsTitle: {
      key: "home_featured_events_title",
      type: "text",
      label: "Título - Eventos",
      default: "Próximos Eventos e Feiras",
    },
    featuredEventsDescription: {
      key: "home_featured_events_description",
      type: "textarea",
      label: "Descrição - Eventos",
      default:
        "Encontre nossos produtores nas feiras da região e participe de workshops sobre agricultura sustentável.",
    },
    featuredAssociatesTitle: {
      key: "home_featured_associates_title",
      type: "text",
      label: "Título - Produtores",
      default: "Conheça as mãos que alimentam nossa região",
    },
    featuredAssociatesBadge: {
      key: "home_featured_associates_badge",
      type: "text",
      label: "Badge - Produtores",
      default: "Quem Planta",
    },
  },
  produtos: {
    title: {
      key: "produtos_title",
      type: "text",
      label: "Título",
      default: "Nossos Produtos",
    },
    description: {
      key: "produtos_description",
      type: "textarea",
      label: "Descrição",
      default:
        "Descubra os cultivos e preparos feitos com carinho pelas nossas famílias associadas, direto do campo para a sua mesa.",
    },
    heroImage: {
      key: "produtos_hero_image",
      type: "image",
      label: "Imagem de Capa",
      default: "/images/products-banner.webp",
    },
  },
  eventos: {
    title: {
      key: "eventos_title",
      type: "text",
      label: "Título",
      default: "Feiras e Eventos",
    },
    description: {
      key: "eventos_description",
      type: "textarea",
      label: "Descrição",
      default:
        "Acompanhe onde nossos produtos estarão disponíveis e participe de nossas atividades e capacitações regionais.",
    },
    heroImage: {
      key: "eventos_hero_image",
      type: "image",
      label: "Imagem de Capa",
      default: "/images/events-banner.webp",
    },
  },
  associados: {
    title: {
      key: "associados_title",
      type: "text",
      label: "Título",
      default: "Produtores Associados",
    },
    description: {
      key: "associados_description",
      type: "textarea",
      label: "Descrição",
      default:
        "Conheça de perto as mãos, o suor e a dedicação de quem cultiva os alimentos que chegam frescos à sua mesa todos os dias.",
    },
    heroImage: {
      key: "associados_hero_image",
      type: "image",
      label: "Imagem de Capa",
      default: "/images/associates-banner.webp",
    },
  },
};

export type SiteConfigSection = keyof typeof SITE_CONFIG_FIELDS;
