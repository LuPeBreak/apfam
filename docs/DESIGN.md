# DESIGN.md — Sistema de Design APFAM

> Este documento é o **contexto de design obrigatório** para qualquer IA ou desenvolvedor trabalhando neste projeto.
> Leia este arquivo antes de criar ou modificar qualquer componente de UI.

---

## 1. Identidade Visual

O APFAM é um portal institucional de uma associação de agricultores familiares.
O visual deve transmitir **confiança, natureza e comunidade** — nada de corporativo frio.

- **Tom geral**: Quente, acolhedor, natural
- **Fontes**: Geist Sans (corpo) + Geist Mono (código)
- **Ícones**: Lucide React (exclusivamente)
- **Animações**: Framer Motion — suaves, sem exagero

---

## 2. Paleta de Cores (oklch — Tailwind v4)

> **Regra**: SEMPRE use variáveis CSS semânticas. NUNCA use hex ou cores arbitrárias.

### Tokens Principais

| Token | Uso | Valor (modo claro) |
|---|---|---|
| `bg-primary` | NavBar, botões CTA, destaques | Verde folha `oklch(0.45 0.14 145)` |
| `text-primary-foreground` | Texto sobre primary | Quase branco |
| `bg-secondary` | Elementos terrosos, badges | Tom terroso `oklch(0.55 0.12 60)` |
| `bg-background` | Fundo da página | Off-white bege `oklch(0.98 0.01 90)` |
| `text-foreground` | Texto principal | Quase preto `oklch(0.2 0.02 90)` |
| `bg-card` | Cards, panels | Branco puro |
| `text-muted-foreground` | Labels, textos secundários | Cinza médio |
| `bg-muted` | Fundos de inputs, áreas neutras | Bege suave |
| `border` | Bordas padrão | `oklch(0.85 0.02 90)` |
| `destructive` | Delete, erros | Vermelho |

### Dark Mode
O projeto suporta dark mode via classe `.dark`. Todas as variáveis acima têm valores correspondentes definidos em `globals.css`.
Use sempre `text-foreground`, `bg-background` etc. — **nunca** hardcode cores para um modo só.

---

## 3. Setup Técnico

```json
// components.json
{
  "style": "new-york",
  "tailwind": { "cssVariables": true },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}
```

- **Tailwind**: v4 com `@import "tailwindcss"` (não config file clássico)
- **Shadcn**: style `new-york`, CSS Variables habilitado
- **Border radius padrão**: `--radius: 0.5rem` (sm, md, lg, xl via calc)

---

## 4. Padrões de Componentes

### 4.1 Navbar (Área Pública)
```
- Sticky top-0, z-50
- bg-primary (verde), shadow-md
- Height: h-20
- Logo APFAM branca à esquerda
- Links com hover: text-white + bg-white/10 + rounded-md
- CTA à direita: bg-white text-primary (invertido)
- Mobile: Sheet (drawer lateral) com mesmo estilo
```

### 4.2 Hero Section
```
- Height: h-[80vh] min-h-[600px]
- Background image full-cover com gradient overlay: from-black/60 via-black/40 to-background
- Conteúdo centralizado com Framer Motion: initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} duration 0.8s
- Logo APFAM branca grande no centro
- Dois botões: primário (rounded-full, bg-primary) + secundário (glassmorphism)
```

### 4.3 Glassmorphism
Usado em botões secundários sobre imagens e elementos flutuantes:
```css
backdrop-blur-sm border-white/30 bg-white/10 hover:bg-white/20
```

### 4.4 Cards (Admin Dashboard)
```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">Label</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-bold">{count}</div>
  </CardContent>
</Card>
```

### 4.5 Layout Admin
```
- Sidebar fixa: w-64, hidden md:block, fixed inset-y-0 z-50
- Main content: flex-1 md:pl-64
- Container interno: py-6 px-4 md:px-8
- Títulos de página: text-3xl font-bold text-primary
```

### 4.6 Botões
| Variante | Uso |
|---|---|
| `default` (bg-primary) | Ação principal (salvar, criar) |
| `outline` | Ação secundária |
| `destructive` | Deletar |
| `ghost` | Ações discretas (ícones de ação em tabelas) |

Botões CTA na área pública: `rounded-full`, `px-8 py-6 h-auto`, com efeito `hover:-translate-y-1`.

---

## 5. Padrão de Formulários

### Stack de Formulários
- `react-hook-form` com `Controller` para todos os campos
- `zod` para validação (schemas em `lib/schemas.ts`)
- Componentes `Field` customizados do projeto (não usar os Shadcn Form direto)

### Padrão de Campo
```tsx
<Controller
  name="fieldName"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field label="Label" error={fieldState.error?.message}>
      <Input {...field} placeholder="..." />
    </Field>
  )}
/>
```

### Upload de Imagem
- Input `type="file"` com preview
- Upload via Server Action para `/public/uploads/` (armazenamento local)
- Preview com `next/image` após upload

---

## 6. Padrão de Tabelas (Admin)

- `@tanstack/react-table` para todas as tabelas
- Colunas tipadas com `ColumnDef<T>`
- Busca via URL search params (não estado local)
- Componente `DataTable` reutilizável

---

## 7. Animações (Framer Motion)

### Padrão de Entry Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

### Regras
- Duração máxima: 0.8s para hero, 0.5s para elementos de página
- Easing: `easeOut` sempre
- Stagger em listas: `delay: index * 0.1`
- **Não usar** em elementos do admin — animações só na área pública

---

## 8. Container e Espaçamento

```css
/* Container padrão */
margin-inline: auto;
padding-inline: 1rem;

/* Espaçamento entre seções da Home */
py-16 md:py-24

/* Gap entre cards no grid */
gap-6

/* Grid responsivo padrão */
grid md:grid-cols-3 gap-6
grid md:grid-cols-4 gap-6 (dashboard admin)
```

---

## 9. Área Pública vs. Admin — Decisões Visuais

| Aspecto | Área Pública | Admin |
|---|---|---|
| Animações | Sim (Framer Motion) | Não |
| Navbar | Verde com logo | Sidebar branca/dark |
| Background | Bege off-white | Background neutro |
| Botões CTA | `rounded-full`, grandes | `rounded-md`, compactos |
| Cards | Com hover effects | Cards simples Shadcn |
| Tipografia | Variada, expressiva | Limpa, funcional |

---

## 10. Assets Estáticos

- **Logo branca** (para fundo verde): `/public/apfam-branca.png`
- **Logo escura** (para fundo claro): verificar se existe `/public/apfam-dark.png`
- Imagens de upload: `/public/uploads/[categoria]/[filename]`

---

## 11. Checklist antes de criar um componente

- [ ] Estou usando variáveis CSS (`text-primary`, `bg-background`) e não hex?
- [ ] Usei `lucide-react` para ícones?
- [ ] O componente Shadcn foi instalado via CLI (`npx shadcn@latest add ...`)?
- [ ] Formulários usam `Controller` + `Field` + `zod`?
- [ ] Animações só na área pública?
- [ ] Dark mode funciona (sem cores hardcoded)?
