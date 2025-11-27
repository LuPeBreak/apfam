import { Associate, Event, Product, Category } from "@/types";

// 0. Categories
export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Laticínios" },
  { id: "c2", name: "Hortaliças" },
  { id: "c3", name: "Mel" },
  { id: "c4", name: "Doces" },
  { id: "c5", name: "Artesanato" },
];

// 1. Central Product Catalog
export const MOCK_CATALOG: Product[] = [
  { 
    id: "p1", 
    name: "Queijo Minas Curado", 
    categoryIds: ["c1"],
    categoryNames: ["Laticínios"],
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
    description: "Queijo minas artesanal curado por 30 dias. Sabor marcante e textura firme.",
  },
  { 
    id: "p2", 
    name: "Requeijão da Roça", 
    categoryIds: ["c1"],
    categoryNames: ["Laticínios"],
    imageUrl: "https://images.unsplash.com/photo-1624806992066-5d5462433d96?w=800&q=80",
    description: "Requeijão cremoso feito no tacho de cobre. Receita tradicional da família.",
  },
  { 
    id: "p3", 
    name: "Cesta de Orgânicos", 
    categoryIds: ["c2"],
    categoryNames: ["Hortaliças"],
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80",
    description: "Seleção semanal de hortaliças frescas e orgânicas da estação.",
  },
  { 
    id: "p4", 
    name: "Tomate Cereja", 
    categoryIds: ["c2"],
    categoryNames: ["Hortaliças"],
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
    description: "Tomates cereja doces e suculentos, perfeitos para saladas.",
  },
  { 
    id: "p5", 
    name: "Cenoura", 
    categoryIds: ["c2"],
    categoryNames: ["Hortaliças"],
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    description: "Cenouras frescas, crocantes e ricas em betacaroteno.",
  },
  { 
    id: "p6", 
    name: "Mel Silvestre", 
    categoryIds: ["c3"],
    categoryNames: ["Mel"],
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    description: "Mel puro de florada silvestre. Rico em nutrientes e sabor.",
  },
  { 
    id: "p7", 
    name: "Própolis Verde", 
    categoryIds: ["c3"],
    categoryNames: ["Mel"],
    imageUrl: "https://images.unsplash.com/photo-1555685812-4b943f3e9942?w=800&q=80",
    description: "Extrato de própolis verde, excelente para imunidade.",
  },
  { 
    id: "p8", 
    name: "Doce de Leite", 
    categoryIds: ["c4"],
    categoryNames: ["Doces"],
    imageUrl: "https://images.unsplash.com/photo-1571506538622-d3cf4eec01ae?w=800&q=80",
    description: "Doce de leite caseiro, cozido lentamente para atingir a cremosidade perfeita.",
  },
  { 
    id: "p9", 
    name: "Goiabada Cascão", 
    categoryIds: ["c4"],
    categoryNames: ["Doces"],
    imageUrl: "https://images.unsplash.com/photo-1594051515348-1188c0ce5032?w=800&q=80",
    description: "Goiabada cascão feita com frutas selecionadas e pouco açúcar.",
  },
  { 
    id: "p10", 
    name: "Compota de Figo", 
    categoryIds: ["c4"],
    categoryNames: ["Doces"],
    imageUrl: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
    description: "Figos em calda, preparados com frutas selecionadas do pomar.",
  },
  { 
    id: "p11", 
    name: "Cesta de Palha", 
    categoryIds: ["c5"],
    categoryNames: ["Artesanato"],
    imageUrl: "https://images.unsplash.com/photo-1584143976662-525239922259?w=800&q=80",
    description: "Cesta de palha trançada à mão, ideal para decoração ou piquenique.",
  },
];

// 2. Associates with linked products
export const MOCK_ASSOCIATES: Associate[] = [
  {
    id: "1",
    name: "João da Silva",
    bio: "Produtor de queijos artesanais há mais de 20 anos. Especialista em queijo minas curado e requeijão.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    products: [MOCK_CATALOG[0], MOCK_CATALOG[1]], // p1, p2
    location: "Estrada Municipal, km 5 - Zona Rural",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    bio: "Agricultora familiar dedicada ao cultivo de hortaliças orgânicas livres de agrotóxicos.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    products: [MOCK_CATALOG[2], MOCK_CATALOG[3], MOCK_CATALOG[4]], // p3, p4, p5
    location: "Rua das Flores, 123 - Centro",
  },
  {
    id: "3",
    name: "Carlos Mendes",
    bio: "Apicultor apaixonado pela preservação das abelhas e produção de mel puro.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    products: [MOCK_CATALOG[5], MOCK_CATALOG[6]], // p6, p7
    location: "Av. Principal, 450 - Bairro Alto",
  },
  {
    id: "4",
    name: "Ana Pereira",
    bio: "Doceira de mão cheia, resgatando receitas antigas de doces caseiros. Também faz artesanato.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    products: [MOCK_CATALOG[7], MOCK_CATALOG[8], MOCK_CATALOG[9], MOCK_CATALOG[10]], // p8, p9, p10, p11
    location: "Praça da Matriz, 88 - Centro",
  },
];

// Helper to link products back to associates for the catalog view
export const getProductsWithAssociates = () => {
  const productsWithAssociates: Product[] = [];
  MOCK_ASSOCIATES.forEach(associate => {
    associate.products.forEach(product => {
      // Find the product in the central catalog to ensure we have the latest data (like categoryNames)
      const catalogProduct = MOCK_CATALOG.find(p => p.id === product.id) || product;
      
      productsWithAssociates.push({
        ...catalogProduct,
        associateId: associate.id,
        associateName: associate.name,
      });
    });
  });
  return productsWithAssociates;
};

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Feira do Produtor",
    description: "Venha conhecer nossos produtos frescos diretamente da roça. Teremos barracas de frutas, verduras, queijos e muito mais.",
    date: "2023-11-15T09:00:00",
    location: "Praça Central",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
  },
  {
    id: "2",
    title: "Workshop de Queijos",
    description: "Aprenda a fazer queijo minas artesanal com o produtor João da Silva. Vagas limitadas!",
    date: "2023-11-20T14:00:00",
    location: "Sítio do João",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=80",
  },
  {
    id: "3",
    title: "Dia de Campo",
    description: "Visita técnica às propriedades rurais para conhecer as práticas de agricultura sustentável.",
    date: "2023-12-05T08:00:00",
    location: "Fazenda Esperança",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
];
