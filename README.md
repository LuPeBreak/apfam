# APFAM - Portal do Produtor e Associado

Bem-vindo ao repositório oficial da **APFAM** (Associação de Produtores e Familiares do Agro de Barra Mansa). Esta aplicação é uma plataforma moderna para gestão de associados, produtos, categorias e eventos, oferecendo transparência e facilidade de acesso à informação.

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
- **Dashboard Administrativo**: Gestão completa de Associados, Produtos e Eventos.
- **Upload Inteligente**: Processamento de imagens local com limpeza automática e vinculação segura aos registros.
- **Filtros Avançados**: Busca em tempo real por texto, categorias e datas específicas usando `nuqs` para persistência na URL.
- **SEO & Performance**: Renderização híbrida (Server/Client) otimizada para Core Web Vitals e indexação em motores de busca.

## 🛠️ Instalação e Configuração

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
   Copie o arquivo `.env.example` (se disponível) para `.env` e preencha as credenciais do banco de dados e autenticação.

4. **Preparar o Banco de Dados**:
   ```bash
   pnpm prisma generate
   # pnpm prisma migrate dev (Executado apenas em ambiente de desenvolvimento aprovado)
   ```

5. **Rodar o Servidor de Desenvolvimento**:
   ```bash
   pnpm dev
   ```

## 🧹 Boas Práticas e Padrões

- **Linting & Formatação**: Biome JS para garantir a consistência do código.
- **Clean Code**: Funções focadas, Server Actions tipadas e componentes reutilizáveis.
- **Tailwind v4**: Uso massivo de variáveis CSS nativas para temas claro/escuro.

---
*Desenvolvido pela Equipe APFAM / PMBM*
