# APFAM - Associação de Produtores Familiares de Santa Rita e Região

Bem-vindo ao repositório oficial da **APFAM**. Esta aplicação é um **Portal de Divulgação** moderno, desenvolvido para promover e dar visibilidade aos produtores associados, seus produtos e os eventos da associação, aproximando o campo da comunidade e fortalecendo a economia regional.

## 🚀 Tecnologias

A aplicação foi construída com as tecnologias mais modernas do ecossistema Web em 2025/2026:

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn UI](https://ui.shadcn.com/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) com [Prisma ORM](https://www.prisma.io/)
- **Autenticação**: [Better Auth](https://www.better-auth.com/) com RBAC (Role-Based Access Control)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Gerenciamento de Estado de Query**: [nuqs](https://nuqs.47ng.com/)
- **E-mails**: [Nodemailer](https://nodemailer.com/)

## 🏗️ Arquitetura e Segurança

### Segurança (Auth & RBAC)
A aplicação implementa um sistema robusto de controle de acesso:
- **Autenticação**: Gerenciada pelo Better Auth, garantindo sessões seguras e fluxos de login modernos.
- **Autorização (RBAC)**: Utiliza `withPermissions` para proteger Server Actions. As permissões são granulares para recursos como `associate`, `product`, `event` e `category`.
- **Validação de Variáveis de Ambiente**: Utiliza `@t3-oss/env-nextjs` para garantir que todas as variáveis críticas (.env) estejam presentes e válidas.

### Funcionalidades Principais
- **Divulgação de Produtores**: Páginas detalhadas para cada associado, destacando sua história e produção.
- **Vitrine de Produtos**: Catálogo completo dos produtos oferecidos pelos produtores da região.
- **Agenda de Eventos**: Portal para divulgação de feiras, workshops e eventos da associação.
- **Dashboard Administrativo**: Gestão completa de Associados, Produtos, Eventos e Usuários.
- **Upload Inteligente**: Processamento de imagens local com limpeza automática e vinculação segura aos registros.
- **Filtros Avançados**: Busca em tempo real por texto, categorias e datas específicas usando `nuqs` para persistência na URL.
- **SEO & Performance**: Renderização híbrida (Server/Client) otimizada para Core Web Vitals e indexação em motores de busca.

## 🛠️ Instalação e Configuração

Siga os passos abaixo para preparar o ambiente de desenvolvimento local:

1. **Clonar o Repositório**:
   ```bash
   git clone <repo-url>
   cd apfam
   ```

2. **Instalar Dependências**:
   ```bash
   pnpm install
   ```

3. **Configurar Variáveis de Ambiente**:
   Copie o arquivo `.env.example` para `.env` e preencha as credenciais necessárias

4. **Preparar o Banco de Dados**:
   Gere o client do Prisma e sincronize o schema:
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev  # Cria as tabelas e aplica as migrações
   ```

5. **Popular o Banco (Opcional)**:
   Para criar o usuário administrador inicial e preparar o banco para produção:
   ```bash
   pnpm prisma db seed
   ```

6. **Rodar o Servidor de Desenvolvimento**:
   ```bash
   pnpm dev
   ```

---
*Desenvolvido por [Luis Felipe de Paula Costa](https://github.com/LuPeBreak)*
