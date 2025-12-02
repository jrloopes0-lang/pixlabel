# PIXELLAB – Plataforma Oficial de Gestao Farmaceutica

## Overview

PIXELLAB (previously known as CAF Intelligence Suite) is the official pharmaceutical management platform for Campo Alegre (SC). The system operates under the **PIXELLAB** brand with a focus on **Health & Data Intelligence**.

The system's core purpose is to automate manual Excel-based workflows for inventory data import, calculating purchase needs (3/6/9/12 months horizons), generating supplier-specific orders, and tracking the entire acquisition cycle. It also supports the "Programa Medicamento Social (PMS)" for patient-specific medication tracking.

Key capabilities include:
- Importing inventory data via Excel/CSV or copy-paste.
- Calculating purchase requirements based on consumption and stock.
- Grouping items by supplier for order generation.
- Tracking order statuses from draft to received.
- Monitoring critical stock levels and consumption trends across four health units.
- Providing a central dashboard for decision-making with primary and secondary panels, offering insights into stock behavior, unit requests, top-consumed medicines, and financial aspects of purchases.

## Brand Identity

- **Name**: PIXELLAB
- **Tagline**: Health & Data Intelligence
- **Color Palette**:
  - Deep Blue: #0E1226 (primary dark background)
  - Clinical Blue: #3EC6FF (accent/highlights)
  - Tech Purple: #6B40FF (brand accent, used in "LAB" text)
  - Magenta: #FF2CA6 (PMS module accent)
  - Data Yellow: #FFB84D (alerts/warnings)
- **Logo Files** (in `/public/`):
  - `logo_pixellab_dark.svg` - Full logo for dark backgrounds
  - `logo_pixellab_light.svg` - Full logo for light backgrounds
  - `logo_pixellab_favicon.svg` - Favicon version
  - `logo_pixellab_symbol.svg` - Symbol-only version for sidebar/compact spaces

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core System Design

The **Tabela Mestra de Medicamentos** (`items` table) is the central core and absolute single source of truth. It serves as the official catalog, basis for all reports, stock management, dispensation, integration with Delta-Tracking, and procurement planning. All modules must reference this master table, ensuring data consistency.

**Unified Medication Registry**: The route `/medicamentos-mestres` is the exclusive medication management interface. Legacy URLs (`/estoque/medicamentos`, `/cadastros/medicamentos`) automatically redirect to maintain backward compatibility.

Data Hierarchy (Priority Order):
1.  **Primary Source (100% reliable)**: Master Medicines Table, actual unit stock, registered dispensations, internal histories. These data always prevail.
2.  **Secondary Source (reference only)**: Delta-Tracking (Portal da Transparencia) for trends and alerts, never replacing official data.
3.  **Ignored (Future Phases)**: CIS Nordeste, CIN Catarinense.

### Dashboard Central (Decision-Making Table)

The Central Dashboard is the primary interface, structured into:
-   **Primary Panels**: Focus on high-priority decision-making data like stock behavior, unit requests, most requested medications, and financial purchasing panels.
-   **Secondary Panels**: Tactical support including Delta-Tracking integration (as a secondary tool), expiry management, inventory accuracy, supplier performance, and loss/obsolescence tracking.

Mandatory Functionalities: Automatic alerts (critical stock, validity, rupture), operational risk KPIs, financial impact ranking, supply flow per unit, item sufficiency forecasts (2-6 months), spending/purchase indicators, strategic signaling (color-coded), and consumption trends.

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite.
**UI Component System**: shadcn/ui (Radix UI + Tailwind CSS) for a utility-first, data-dense interface.
**State Management**: TanStack Query for server state, react-hook-form with Zod for form state.
**Routing**: React Router for client-side navigation.
**Design Principles**: Professional healthcare aesthetic, high information density, persistent sidebar (260px), mobile-first responsive design (iPhone 16 / iOS Safari optimized), minimal clicks.
**Mobile Optimization**: Responsive breakpoints, mobile drawer navigation, accessible touch targets, card-based tables on mobile, collapsible filters.
**Global Search**: CTRL+K command palette for quick navigation across all pages.

### Backend Architecture

**Runtime**: Node.js with Express.js (ESM modules).
**API Design**: RESTful API endpoints, protected by authentication middleware.
**Request Handling**: JSON body parsing, multer for file uploads, xlsx library for spreadsheet parsing.
**Development/Production**: Vite for dev, pre-built static assets from `dist/public` for production.
**Error Handling**: Centralized JSON error responses, request logging.

### Authentication & Authorization

**Provider**: Pluggable OIDC or custom provider (current scaffold uses cookie sessions for local/dev).
**Session Management**: `express-session` with optional PostgreSQL store (connect-pg-simple), secure HTTP-only cookies.
**User Model**: Email, name, profile, role (`administrator` | `operator`).
**Authorization**: Role-based access control with dedicated middleware.

### Data Storage

**Database**: PostgreSQL via Neon serverless driver.
**ORM**: Drizzle ORM for type-safe access.
**Schema Design**:
-   `items`: **TABELA MESTRA** (Official medication catalog).
-   `users`, `units`, `suppliers`, `orders`, `orderItems`, `medicationMapping`, `importHistory`, `auditLogs`, `sessions`.
-   **PMS Tables**: `pacientes_pms`, `evolucoes_pms`, `fornecimentos_pms`, `recibos_pms`, `anexos_pms`.
**Data Integrity**: UUID primary keys, foreign key relationships, timestamp tracking, JSONB fields, referential integrity (PMS and dispensations always reference `items.id`).
**Migrations**: Drizzle Kit for schema management.

### PMS Module (Programa Medicamento Social)

The PMS module provides comprehensive patient medication management:

**Frontend Pages** (`client/src/pages/programa-social/`):
- `/programa-social` - Main dashboard with 4 KPIs, 6-month trend chart, scheduled pickups, quick access navigation
- `/programa-social/pacientes/novo` - New patient registration with 5 tabs (Dados Pessoais, Documentos, Parecer Social, Evolucao, Medicamentos Autorizados)
- `/programa-social/dispensar/:id` - Medication dispensation workflow for specific patient
- `/programa-social/negativas` - Track medication denials (social, pharmaceutical, administrative types)
- `/programa-social/faltas` - Track patient absences (did not pick up medication)
- `/programa-social/relatorios` - Comprehensive reporting with monthly, per-patient, cost, and top medications views

**Backend Endpoints** (`server/src/routes/pms.ts`):
- `GET /api/pms/dashboard-resumido` - Dashboard KPIs and monthly dispensation trends
- `GET/POST /api/pms/pacientes` - Patient CRUD operations
- `GET/POST /api/pms/pacientes/:id/fornecimentos` - Dispensation records
- `GET/POST /api/pms/pacientes/:id/evolucoes` - Clinical evolutions and social assessments
- `GET/POST /api/pms/negativas` - Medication denial tracking (with type filtering)
- `GET/POST /api/pms/faltas` - Patient absence tracking
- `GET /api/pms/recibos/:id/pdf` - PDF receipt generation

## External Dependencies

**Database Service**: Neon serverless PostgreSQL (requires `DATABASE_URL`).

**Authentication Service**: Pluggable OIDC provider (configure issuer/client env vars as needed).

**AI Integration**: Perplexity API for medication queries and clinical information.

**File Processing**:
-   `xlsx` library for Excel/CSV parsing.
-   `multer` for multipart form data uploads.
-   `pdfkit` for PDF generation.

**UI Component Libraries**:
-   Radix UI primitives (`@radix-ui/*`).
-   Lucide React for iconography.
-   Recharts for dashboard visualizations.

**Build Tools**: Vite, esbuild, TypeScript compiler, Tailwind CSS with PostCSS.

**Development Tools**: Standard Vite/TypeScript toolchain.
