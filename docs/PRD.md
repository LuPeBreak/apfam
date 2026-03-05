# Product Requirements Document (PRD) - APFAM Portal

## 1. Overview
The **APFAM Portal** (Association of Family Farmers of Santa Rita and Region) is a web platform designed to connect local farmers with the community, promote events, market agricultural products, and strengthen family farming. The system features a public institutional interface and an administrative panel for content management.

## 2. Personas and Users
*   **Visitor**: Unauthenticated user. Accesses only the public area. Seeks information about events, products, and producers. Has no account in the system.
*   **User**: Authenticated administrator with content management permissions. Can perform full CRUD on Products, Events, Associates, and Categories. Cannot manage other user accounts.
*   **Admin**: Authenticated administrator with full permissions. Has all the same access as a User, plus the ability to manage other user accounts (create, edit, ban/unban, reset passwords).

## 3. Information Architecture (Sitemap)

### Public Area
*   **Home** (`/`): Institutional presentation, product highlights, recent events, and featured associates.
*   **About** (`/sobre` - *Section on Home*): Association history and mission.
*   **Products** (`/produtos`): Complete product catalog with category filters.
    *   **Product Detail** (`/produtos/[slug]`): Detailed information, photos, and contact link (WhatsApp).
*   **Events** (`/eventos`): Calendar of fairs and activities.
    *   **Event Detail** (`/eventos/[slug]`): Date, location, description, and photos.
*   **Associates** (`/associados`): List of member producers.
    *   **Associate Profile** (`/associados/[slug]`): Biography, location, and linked products.
*   **Contact** (`/contato`): Direct contact form and location information.

### Administrative Area (Restricted Access — `user` and `admin` roles)
*   **Dashboard** (`/dashboard`): Overview and quick metrics.
*   **Associates** (`/dashboard/associados`): CRUD (Create, Read, Update, Delete) of producers.
*   **Events** (`/dashboard/eventos`): Agenda and event management.
*   **Products** (`/dashboard/produtos`): Product catalog management and linking with categories/associates.
*   **Categories** (`/dashboard/categorias`): Management of product categories (e.g., Dairy, Vegetables).
*   **Users** (`/dashboard/usuarios`): Management of user accounts (`admin` role only).
*   **Profile** (`/dashboard/perfil`): Own profile update (name and password).

---

## 4. Functional Requirements

### 4.1. Institutional Module (Public)
*   **FR-01**: The system must display a home page with modular sections (Hero, Services, Featured Products, Recent Events).
*   **FR-02**: The system must allow fluid navigation between sections.
*   **FR-03**: The contact form must send emails to the administration and include anti-spam protection (Honeypot).
*   **FR-04**: Detail pages (Product, Event, Associate) must have friendly URLs (Slugs) for better indexing and sharing.
*   **FR-05**: The system must display correct OpenGraph metadata (Title, Description, Image) when sharing links on social networks.
*   **FR-06 (Search & Filtering)**: Public listing pages (Products, Events, Associates) must include a real-time text search bar. The Product list must also include a multi-select category filter.

### 4.2. Management Module (Admin)
*   **FR-07 (Authentication)**: Access to the dashboard must be protected by login (Email/Password via Better Auth). Sessions are persisted server-side via HttpOnly cookies. The Next.js middleware must protect all `/dashboard/*` routes and redirect unauthenticated users to `/login`. The authenticated user's role (`user` or `admin`) must be available server-side for permission checks.
*   **FR-08 (Product Management)**: The admin must be able to **Create, Edit, and Delete** products with name, description, price (optional), image, and categories. The Slug must be generated automatically.
*   **FR-09 (Event Management)**: The admin must be able to **Create, Edit, and Delete** events with date, time, location, and cover image.
*   **FR-10 (Associate Management)**: The admin must be able to **Create, Edit, and Delete** producers with photo (avatar), biography, and location.
*   **FR-11 (Category Management)**: The admin must be able to **Create, Edit, and Delete** product categories (e.g., Dairy, Vegetables) to organize the catalog.
*   **FR-12 (Image Upload)**: The system must allow image uploads for Products, Events, and Associates. Images are stored locally on the server (`/public/uploads/`). When a record is deleted, its associated image file must also be removed from disk.

### 4.3. User Management Module (`admin` role only)
*   **FR-13 (List Users)**: The Admin must be able to view all registered accounts, including their name, email, role, status (active/banned), and creation date.
*   **FR-14 (Create User)**: The Admin must be able to create new accounts with a name, email, initial password, and role (`user` or `admin`).
*   **FR-15 (Edit User)**: The Admin must be able to edit the name, email, and role of other accounts.
*   **FR-16 (Ban / Unban User)**: The Admin must be able to ban (block access) or unban a user. A banned user must not be able to log in.
*   **FR-17 (Reset Password)**: The Admin must be able to set a new password for any user without requiring the user's current password.
*   **FR-18 (Self-action Protection)**: A logged-in user must not be able to ban or delete their own account.
*   **FR-19 (Implementation)**: The User Management module must be implemented using the **Better Auth Admin Plugin**.

---

## 5. Non-Functional Requirements (NFR)

### 5.1. Performance & SEO
*   **NFR-01**: The site must have high loading performance (Core Web Vitals), utilizing image optimization (`next/image`) and hybrid rendering (SSR/ISR).
*   **NFR-02**: All public pages must be optimized for search engines (SEO).

### 5.2. Security
*   **NFR-03**: Sensitive data (passwords, API keys, auth secrets) must be strictly managed via server environment variables (`lib/env.ts`).
*   **NFR-04**: The administrative panel must validate the user session on the server (Cookies) to prevent unauthorized access. Authorization must never rely on client-side state.
*   **NFR-05**: API routes and Server Actions must validate input data (Zod) to prevent injection or malformed data.
*   **NFR-06**: Passwords must never be stored in plain text. Better Auth handles password hashing (bcrypt) by default.
*   **NFR-07**: `admin` role permission must be verified server-side in every Server Action that performs user management operations (FR-13 through FR-18). A `user` role must never be able to reach these actions.
*   **NFR-08**: File uploads must be validated server-side for MIME type, file extension (jpg, png, webp), and maximum size (5MB).

### 5.3. Tech Stack
*   **Frontend**: Next.js 15 (App Router), React, Tailwind CSS v4, Shadcn UI, Framer Motion.
*   **Authentication**: Better Auth with Admin Plugin (email/password).
*   **Database ORM**: Prisma with PostgreSQL (dedicated database instance).
*   **File Storage**: Local server storage (`/public/uploads/`), mapped as a Docker volume in Coolify to persist across redeploys.
*   **Email**: Nodemailer (SMTP).
*   **Language**: TypeScript (Strict Mode).
*   **Deploy**: Docker / Coolify (standalone build support).

## 6. Glossary
*   **Slug**: User-friendly part of the URL identifying a resource (e.g., `/eventos/food-fair` instead of `/eventos/123`).
*   **Honeypot (Anti-Spam)**: A security mechanism used in the contact form. It consists of a hidden field (`_honey`) that is invisible to human users but visible to automated bots. If a bot fills out this field, the system detects it as spam and silently rejects the submission, protecting the admin's inbox without requiring intrusive Captchas.
*   **Better Auth Admin Plugin**: An official Better Auth plugin that provides built-in server actions for user management (ban, create, reset password), with automatic role verification.
*   **Standalone Build**: A Next.js build mode that produces a self-contained Node.js server, ideal for Docker/Coolify deployment.
*   **Visitor**: An unauthenticated user with access to the public area only. Not stored in the database.
*   **User** (role): An authenticated account with content management permissions (CRUD on products, events, associates, categories). Cannot manage other users.
*   **Admin** (role): An authenticated account with full permissions — everything a `user` can do plus user account management (FR-13 through FR-18).
