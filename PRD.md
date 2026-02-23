# Product Requirements Document (PRD) - APFAM Portal

## 1. Overview
The **APFAM Portal** (Association of Family Farmers of Santa Rita and Region) is a web platform designed to connect local farmers with the community, promote events, market agricultural products, and strengthen family farming. The system features a public institutional interface and an administrative panel for content management.

## 2. Personas and Users
*   **Visitor (Public)**: End consumer, community member, or potential partner. Seeks information about events, products, and producers.
*   **Administrator (Admin)**: Association manager. Responsible for registering and updating information about associates, events, and products on the portal.

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

### Administrative Area (Restricted Access)
*   **Dashboard** (`/admin`): Overview and quick metrics.
*   **Associates** (`/admin/associados`): CRUD (Create, Read, Update, Delete) of producers.
*   **Events** (`/admin/eventos`): Agenda and event management.
*   **Products** (`/admin/produtos`): Product catalog management and linking with categories/associates.
*   **Categories** (`/admin/categorias`): Management of product categories (e.g., Dairy, Vegetables).
*   **Profile** (`/admin/perfil`): Administrator profile update.

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
*   **FR-07 (Authentication)**: Access to the admin panel must be protected by login (Email/Password via Supabase Auth).
*   **FR-08 (Product Management)**: The admin must be able to **Create, Edit, and Delete** products with name, description, price (optional), image, and categories. The Slug must be generated automatically.
*   **FR-09 (Event Management)**: The admin must be able to **Create, Edit, and Delete** events with date, time, location, and cover image.
*   **FR-10 (Associate Management)**: The admin must be able to **Create, Edit, and Delete** producers with photo (avatar), biography, and location.
*   **FR-11 (Category Management)**: The admin must be able to **Create, Edit, and Delete** product categories (e.g., Dairy, Vegetables) to organize the catalog.
*   **FR-12 (Image Upload)**: The system must allow image uploads for Products, Events, and Associates (Supabase Bucket).

---

## 5. Non-Functional Requirements (NFR)

### 5.1. Performance & SEO
*   **NFR-01**: The site must have high loading performance (Core Web Vitals), utilizing image optimization (`next/image`) and hybrid rendering (SSR/ISR).
*   **NFR-02**: All public pages must be optimized for search engines (SEO).

### 5.2. Security
*   **NFR-03**: Sensitive data (passwords, API keys) must be strictly managed via server environment variables (`lib/env.ts`).
*   **NFR-04**: The administrative panel must validate the user session on the server (Cookies) to prevent unauthorized access.
*   **NFR-05**: API routes (e.g., email sending) must validate input data (Zod) to prevent injection or malformed data.
*   **NFR-06**: The database must use Row Level Security (RLS) to ensure that only admins can modify data, while the public has read-only permission.

### 5.3. Tech Stack
*   **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI, Framer Motion.
*   **Backend/BaaS**: Supabase (PostgreSQL, Auth, Storage).
*   **Language**: TypeScript (Strict Mode).
*   **Deploy**: Docker / Coolify (standalone build support).

## 6. Glossary
*   **Slug**: User-friendly part of the URL identifying a resource (e.g., `/eventos/food-fair` instead of `/eventos/123`).
*   **Honeypot (Anti-Spam)**: A security mechanism used in the contact form. It consists of a hidden field (`_honey`) that is invisible to human users but visible to automated bots. If a bot fills out this field, the system detects it as spam and silently rejects the submission, protecting the admin's inbox without requiring intrusive Captchas.

