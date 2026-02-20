# Sentinnelle IA - Workspace Guidelines

A modern React 18 + TypeScript + Vite portfolio/landing page for Sentinnelle IA mentoring platform with animation-first design.

## Sobre o Curso

**Sentinnelle IA** é uma mentoria prática e guiada passo a passo, desde a escolha do arsenal de ferramentas até o deploy na Vercel. O curso é 100% ao vivo via Google Meet, com foco em desenvolvimento moderno assistido por IA.

**Formato do Curso:**
- Aulas ao vivo via Google Meet
- Aula de apresentação inicial para conhecer a metodologia
- Garantia de 24 horas para solicitação de reembolso após a aula de apresentação
- Cobertura das 10 principais provedoras de cloud e suas características
- Do setup do ambiente ao primeiro deploy em produção

**Pré-requisitos:**
- Um computador com acesso à internet que consiga rodar o VS Code
- Isso é tudo! O curso é acessível para iniciantes

## Parceiros Tecnológicos

**NVIDIA Cloud:**
- Infraestrutura cloud otimizada para workloads de IA
- Acesso a GPUs de última geração para treinamento e inferência
- Documentação: https://docs.nvidia.com/cloud/
- Recursos para desenvolvedores disponíveis na plataforma

**Google Developers:**
- Ferramentas de desenvolvimento e APIs do ecossistema Google
- Integração com Google Cloud Platform, Firebase e serviços relacionados
- Documentação: https://developers.google.com/
- Recursos de aprendizado e boas práticas

> **Nota:** Estes parceiros fornecem infraestrutura, ferramentas e documentação de apoio. O curso NÃO oferece certificados, credenciais oficiais ou qualificações formais dessas plataformas.

## Code Style

**React & JSX:**
- Use functional components with TypeScript types (e.g., `FC` from React)
- Export unnamed components directly: `export default function ComponentName() {}`
- Use `const Component: FC = () => {}` pattern when exporting named components
- Prefer explicit `React.MouseEvent<HTMLElement>` type annotations for event handlers
- Use inline state management with `useState` for local form/UI state

**TypeScript:**
- Strict mode enabled (`"strict": true` in tsconfig.json)
- Import types in one line: `import type { FC } from 'react'` (optional; inline is common)
- Use `type` keyword for defining component props interfaces (not `interface`)

**Styling:**
- **CSS in JS:** No CSS-in-JS library; relies on Tailwind CSS with custom classes
- **Tailwind Config:** Uses neon-colored theme (neon-400, neon-500, neon-600)
- **Common patterns:**
  - Glass morphism: `glass-card` (defined in CSS/project)
  - Neon glows: `shadow-[0_0_20px_rgba(34,197,94,0.5)]`
  - Responsive breakpoints: `hidden md:flex`, `md:text-7xl lg:grid-cols-2`
  - Animations use `transition-all duration-300`, `hover:scale-[1.02]`

**Naming Conventions:**
- Components: PascalCase (`Navbar.tsx`, `LeadPage.tsx`)
- Utilities/helpers: camelCase (`smoothScrollTo` in `/utils/scroll.ts`)
- CSS classes: kebab-case (`text-neon-500`, `glass-card`)

## Architecture

**Project Structure:**
```
components/     → Reusable UI components (Navbar, Hero, Projects, etc.)
pages/          → Full-page components (LeadPage.tsx - mentorship page)
utils/          → Helper functions (scroll.ts)
root level      → App entry (App.tsx), config (vite.config.ts, tsconfig.json)
```

**Routing:**
- Uses React Router DOM v6 (`BrowserRouter`, `Routes`, `Route`)
- Main routes: `/` (HomePage), `/mentoria` (LeadPage)
- HomePage component in App.tsx composes all home section components
- Link navigation available via `<Link>` component from router (used in Navbar, LeadPage)

**Key Components:**
- `Background.tsx` → Full-screen animated background (reused across pages)
- `Navbar.tsx` → Fixed navigation with scroll detection, mobile menu toggle, smooth scroll handler
- `LeadPage.tsx` → Mentorship registration page with form state management
- Lazy-loaded `Projects` component in HomePage for performance

**Animations:**
- All animations use **Framer Motion** (`framer-motion` package)
- Import pattern: `import { motion, AnimatePresence } from 'framer-motion'`
- Common usage: `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />`
- Use `viewport={{ once: true }}` for scroll-triggered animations
- Mobile menu uses `<AnimatePresence>` for exit animations

**Scroll Behavior:**
- `utils/scroll.ts` exports `smoothScrollTo(targetId)` function
- Handles navigation from routes to anchor sections (e.g., `#ecosystem` → `ecosystem` div id)
- Used in Navbar for link clicks; includes delay when changing routes

## Build and Test

**Package Manager:** pnpm (see `pnpm-lock.yaml`)

**Environment:**
- Create `.env.local` file with `GEMINI_API_KEY` (required for API calls)
- Vite exposes via `process.env.GEMINI_API_KEY` and `process.env.API_KEY`

**Commands:**
```bash
pnpm install              # Install dependencies
pnpm run dev             # Start dev server (http://localhost:3000)
pnpm run build           # Build for production
pnpm run preview         # Preview production build locally
```

**Development Server:**
- Port: 3000
- Host: 0.0.0.0 (accessible from network)
- Vite HMR enabled by default

**Build Output:**
- Target: ES2022
- Module: ESNext
- Output format: ES modules
- No tests configured (no Jest, Vitest, etc.)

## Project Conventions

**Language & Localization:**
- UI text is primarily **Portuguese (Brazilian)** with some emojis
- Example: "🏠 Início", "🎓 Mentoria", "Revolução em IA"
- Comments in code can be Portuguese or English

**Form Handling (LeadPage):**
- Form fields: `nome`, `email`, `whatsapp`, `nivel` (programming level)
- State stored in `formData` object
- Submit handler logs to console; no backend integration visible
- Post-submit shows success modal with checkmark icon
- LGPD (Brazilian privacy law) notice required in UI

**Link Handling Patterns:**
- Navigation checks `location.pathname` to avoid full page reload on same route
- Anchor clicks on LeadPage: smooth scroll after route change (with timeout fallback)
- Mobile menu closes after link click

**Accessibility:**
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`
- `aria-label` used on interactive elements (e.g., mobile menu toggle)
- `for` labels linked to form inputs

**Performance:**
- `Projects` component lazy-loaded with `React.lazy()` + `Suspense`
- Suspense fallback shows animated "CARREGANDO MÓDULOS..." text
- Navbar scroll listener uses `requestAnimationFrame` with throttling flag to avoid jank

## Integration Points

**External Libraries:**
- **React Router DOM:** Routing and navigation (`Link`, `useLocation`, `useNavigate`)
- **Framer Motion:** All animations and transitions (`motion`, `AnimatePresence`)
- **Lucide React:** Icon library (arrow, menu, check, star, shield, users, zap, etc.)
- **Vite:** Build tool with React plugin (`@vitejs/plugin-react`)

**Cloud & IA Resources:**
- NVIDIA Cloud: GPUs e infraestrutura para IA
- Google Cloud Platform: Serviços cloud e deploy
- 10 principais provedoras de cloud cobertas no curso

**API Integration:**
- Gemini API key passed via environment variable from Vite config
- Currently used in components via `process.env.GEMINI_API_KEY` (not yet integrated with API calls in visible code)

**Meta & SEO (LeadPage):**
- Dynamically sets `document.title` and meta description on component mount
- Scroll to top on page load: `window.scrollTo(0, 0)`

## Security

**Environment Variables:**
- `GEMINI_API_KEY` must be set in `.env.local` (not committed to repo)
- Keep API keys out of source code; Vite config safely uses `loadEnv` to inject at build time

**Form Data:**
- LeadPage form includes LGPD compliance notice
- Form data logged to console for inspection; implement server-side validation before real backend integration

**XSS Prevention:**
- React's JSX automatically escapes content by default
- No use of `dangerouslySetInnerHTML` in visible code
- Form inputs are controlled components (no raw innerHTML)

## Key Files Reference

- **Main entry:** [App.tsx](../App.tsx) — routes and HomePage composition
- **Config:** [vite.config.ts](../vite.config.ts) — build and environment setup
- **Types:** [tsconfig.json](../tsconfig.json) — TypeScript strict mode, jsx, paths
- **Anchor scroll helper:** [scroll.ts](../utils/scroll.ts) — smooth scroll implementation
- **Navigation example:** [Navbar.tsx](../components/Navbar.tsx) — route + anchor link patterns
- **Form page:** [LeadPage.tsx](../pages/LeadPage.tsx) — state management and submit patterns
