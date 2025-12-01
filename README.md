# APFAM - Associação dos Produtores Familiares

Bem-vindo ao repositório oficial da plataforma web da APFAM. Este projeto visa conectar produtores familiares locais diretamente aos consumidores, promovendo a agricultura sustentável e o comércio justo.

> [!IMPORTANT]
> **Este projeto foi desenvolvido integralmente pela Antigravity AI**, como parte de um teste técnico das capacidades de desenvolvimento de software assistido por inteligência artificial, sob supervisão e fiscalização humana.

## 🚀 Sobre o Projeto

A plataforma APFAM é uma solução moderna e responsiva que permite:
-   **Consumidores**: Navegar por um catálogo de produtos frescos, encontrar produtores locais, visualizar eventos e entrar em contato direto.
-   **Produtores**: Terem seus perfis e produtos divulgados de forma profissional.
-   **Administradores**: Gerenciar todo o conteúdo do site (associados, produtos, eventos, categorias) através de um painel administrativo seguro.

## ✨ Funcionalidades

### Área Pública
-   **Home Page**: Destaques de produtos, eventos e associados com design premium.
-   **Catálogo de Produtos**: Busca avançada por nome e filtros por categoria. Visualização de detalhes e contagem de produtores.
-   **Perfil dos Associados**: Página detalhada com biografia, localização e lista de produtos do produtor.
-   **Agenda de Eventos**: Listagem de feiras e reuniões com busca integrada.
-   **Contato**: Formulário de contato direto com a associação.

### Painel Administrativo
-   **Dashboard**: Visão geral do sistema.
-   **Gestão de Associados**: Cadastro completo com upload de fotos.
-   **Gestão de Produtos**: Controle de catálogo com imagens e categorias.
-   **Gestão de Eventos**: Divulgação de datas e locais.
-   **Filtros Avançados**: Tabelas com busca inteligente para facilitar a gestão.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com as tecnologias mais recentes do ecossistema React/Next.js:

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
-   **Ícones**: [Lucide React](https://lucide.dev/)
-   **Animações**: [Framer Motion](https://www.framer.com/motion/)
-   **Banco de Dados & Auth**: [Supabase](https://supabase.com/)
-   **Formulários**: React Hook Form + Zod

## 🏁 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em seu ambiente local.

### Pré-requisitos
-   Node.js 18+ instalado.
-   Gerenciador de pacotes (npm, yarn ou pnpm).

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/apfam-antigravity.git
    cd apfam-antigravity
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as Variáveis de Ambiente:
    Crie um arquivo `.env.local` na raiz do projeto e preencha com suas credenciais do Supabase e configurações de contato:

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

    # Configurações de Contato (Exibição)
    NEXT_PUBLIC_CONTACT_EMAIL=contato@apfam.com.br
    NEXT_PUBLIC_CONTACT_PHONE=5524999999999
    NEXT_PUBLIC_CONTACT_WHATSAPP=5524999999999
    NEXT_PUBLIC_CONTACT_ADDRESS="Rua Exemplo, 123 - Centro, Cidade - RJ"

    # Configurações de Envio de Email (Opcional - para formulário funcionar)
    EMAIL_HOST=smtp.exemplo.com
    EMAIL_PORT=587
    EMAIL_USER=seu_usuario_smtp
    EMAIL_PASS=sua_senha_smtp
    EMAIL_FROM=noreply@apfam.com.br
    ```

4.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

5.  Acesse `http://localhost:3000` no seu navegador.

## 🗄️ Estrutura do Banco de Dados (Supabase)

O projeto requer as seguintes tabelas no Supabase:

-   `associates`: Armazena dados dos produtores.
-   `categories`: Categorias de produtos.
-   `products`: Catálogo de produtos.
-   `events`: Agenda de eventos.
-   `associate_products`: Tabela pivô (N:N) ligando produtores a produtos.
-   `product_categories`: Tabela pivô (N:N) ligando produtos a categorias.

**Storage**: É necessário um bucket público chamado `images` para upload de fotos.

## 📂 Estrutura de Pastas

-   `app/`: Rotas e páginas do Next.js (App Router).
    -   `(admin)/`: Rotas protegidas do painel administrativo.
    -   `(public)/`: Rotas públicas do site.
-   `components/`: Componentes React reutilizáveis.
    -   `ui/`: Componentes base do shadcn/ui.
    -   `custom/`: Componentes personalizados (ImageUpload, MultiSelect, etc).
    -   `admin/`: Componentes específicos da área administrativa.
-   `lib/`: Utilitários e configurações (cliente Supabase, utils).
-   `types/`: Definições de tipos TypeScript.
-   `middleware.ts`: Proteção de rotas administrativas.

---

Desenvolvido com 💚 para a APFAM.
