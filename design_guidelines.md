# PIXELLAB - Plataforma Oficial de Gestao Farmaceutica
## Design Guidelines v2.0

### Design Approach
**Health & Data Intelligence** - PIXELLAB combines pharmaceutical precision with modern data visualization. Drawing from Linear's clarity and Notion's data organization, the platform prioritizes scannable interfaces for pharmaceutical professionals managing critical inventory data. This is a utility-first system where information density, operational speed, and clinical precision define every design decision.

---

### Brand Identity

**Name**: PIXELLAB
**Tagline**: Health & Data Intelligence
**Logo Usage**:
- Full logo (`logo_pixellab_dark.svg`) for dark backgrounds
- Full logo (`logo_pixellab_light.svg`) for light backgrounds
- Favicon (`logo_pixellab_favicon.svg`) for browser tabs
- Symbol only (`logo_pixellab_symbol.svg`) for sidebar/compact spaces

---

### Color System

**PIXELLAB Brand Palette**
- Deep Blue: `#0E1226` - Primary dark background, sidebar, landing page
- Clinical Blue: `#3EC6FF` - Accent highlights, links, info states
- Tech Purple: `#6B40FF` - Brand accent, "LAB" text, primary buttons
- Magenta: `#FF2CA6` - PMS module accent, special highlights
- Data Yellow: `#FFB84D` - Alerts, warnings, attention states

**Backgrounds**
- Page Background: `#f3f4f6` (light gray) - main content area in light mode
- Dark Mode Background: `#0E1226` - main background in dark mode
- Card/Panel White: `#ffffff` - data cards, modals, tables
- Card Dark: `#1a1f3c` - cards in dark mode
- Sidebar: Uses Deep Blue (`#0E1226`) in dark mode, light gray in light mode

**Status Colors** (Critical for pharmaceutical safety)
- Success/OK: `#10b981` (green) - adequate stock, completed actions
- Warning/Low: `#FFB84D` (Data Yellow) - approaching thresholds, requires attention
- Critical/Danger: `#ef4444` (red) - stockouts, critical alerts, destructive actions
- Info/Neutral: `#3EC6FF` (Clinical Blue) - metadata, secondary information

**Text Hierarchy**
- Primary Text Light: `#111827` (near black) - headers, key data in light mode
- Primary Text Dark: `#ffffff` - headers, key data in dark mode
- Secondary Text: `#6b7280` (medium gray) - labels, descriptions
- Tertiary Text: `#9ca3af` (light gray) - metadata, timestamps
- Brand Text: "PIXEL" in slate/white, "LAB" in Tech Purple (`#6B40FF`)

---

### Typography

**Font Stack**: Inter, Sora, Manrope (Google Fonts), falling back to system fonts

**Scale**:
- Page Titles: 1.875rem (30px), bold - dashboard headers
- Section Headers: 1.5rem (24px), semibold - card titles, modal headers
- Body/Data: 0.875rem (14px), regular - table content, form fields
- Labels/Badges: 0.75rem (12px), medium - status indicators, metadata

**Line Height**: 1.6 for pharmaceutical data readability

---

### Layout System

**Spacing Units**: 2, 4, 8, 12, 16, 24, 32 (Tailwind scale)
- Inline elements: 2, 4
- Component padding: 12, 16, 24
- Section gaps: 20, 32

**App Structure**:
- Fixed Sidebar: 260px left-aligned, adapts to light/dark mode
- Header: Full-width with PIXELLAB logo, breadcrumb navigation
- Content Area: Fluid width with 32px padding
- Cards: White/dark panels with 24px internal padding, 8px border-radius, subtle shadow

**Grids**:
- Dashboard Stats: 4-column responsive grid (1/2/4 cols mobile/tablet/desktop)
- Forms: 2-column (minmax(250px, 1fr)), single column on mobile
- Data Tables: Full-width with horizontal scroll on small screens

---

### Component Library

#### Navigation
**Sidebar** (260px)
- PIXELLAB logo at top (symbol + wordmark)
- Vertical nav list with icons + text
- Active state: Light blue background with accent text
- Hover: Elevated background state
- Icons from Lucide React

**Header Bar**
- PIXELLAB branding left-aligned
- Global search (CTRL+K) command palette
- User profile/settings icon right-aligned
- Theme toggle for dark/light mode
- Height: 64px with centered content

#### Data Display
**Tables** (High-density pharmaceutical data)
- Striped rows (alternating white/`#f9fafb`)
- Compact cell padding: 12px
- Sticky header row with semibold text
- Sortable columns with arrow icons
- Inline status badges in relevant columns

**Stat Cards**
- White/dark background with subtle shadow and border
- Large numeric value (2.5rem, bold)
- Descriptive label below (12px, gray)
- Icon top-right corner (outline style)
- Color accents using PIXELLAB palette

**Status Badges** (Pill-shaped, 9999px radius)
- Green badge: "Estoque OK" - `#10b981` background, white text
- Amber badge: "Estoque Baixo" - `#FFB84D` background, dark text
- Red badge: "Critico/Ruptura" - `#ef4444` background, white text
- Blue badge: Info states - `#3EC6FF` background, dark text
- Purple badge: PMS/Special - `#6B40FF` background, white text

#### Forms & Inputs
**Input Fields**
- Full-width, 0.75rem padding, 8px radius
- Border: 1px gray, focus: 2px Clinical Blue with subtle glow
- Labels above inputs (semibold, 14px)
- Error states: Red border with inline message below

**File Upload**
- Large drop zone with dashed border (2px, gray)
- Upload icon centered (40px)
- Drag-over state: Clinical Blue border + light blue background tint
- "Click or drag CSV/Excel files" instruction text

**Buttons**
- Primary: Tech Purple (`#6B40FF`) or gradient, white text, 8px radius
- Secondary: White/dark background, gray border, gray text
- Danger: Red (`#ef4444`) for delete/remove actions
- Success: Green (`#10b981`) for confirmations
- PMS: Magenta (`#FF2CA6`) for PMS module actions
- All buttons: Icon + text combination, medium weight text

#### Alerts & Feedback
**Alert Boxes** (4px left border accent)
- Success: Green left border, light green background tint
- Warning: Data Yellow border, light amber tint - for duplicate warnings
- Error: Red border, light red tint - for critical stock alerts
- Info: Clinical Blue border, light blue tint - for system messages

**Progress Indicators**
- Horizontal bar (8px height, gradient fill) for multi-step workflows
- Spinner (Tech Purple) for async operations
- Skeleton screens for loading tables

#### Overlays
**Modals**
- Centered, max-width 600px, dark backdrop (rgba(0,0,0,0.5))
- White/dark background, 16px radius
- Header: Semibold title + close X button
- Content area: 24px padding
- Footer: Right-aligned button group with 8px gap

---

### Key Interaction Patterns

**Multi-Step Workflows**: Progress bar at top, numbered steps, persistent "Save Draft" option

**Inline Editing**: Click row to expand detail panel with edit controls

**Bulk Actions**: Checkbox selection + action bar appears sticky at top

**Filtering**: Sticky filter bar with dropdowns (unit, supplier, date range) + search input

**Global Search**: CTRL+K command palette for quick navigation across all pages

**Duplicate Detection**: Modal alert with list of conflicts, option to proceed or cancel

---

### Data Visualization

**Dashboard Layout**:
- Row 1: 4 stat cards (Critical Items, Low Stock Count, Avg Consumption, Coverage Days)
- Row 2: Horizontal bar chart - Top 10 items by consumption
- Row 3: Line chart - 12-month stock sufficiency forecast
- Alert cards below: Critical stock warnings in accent-bordered panels

**Charts**: Use PIXELLAB color palette - Tech Purple primary, Clinical Blue secondary, gray axes, no decorative elements

**PMS Module Charts**: Use Magenta (`#FF2CA6`) as primary accent for patient-related visualizations

---

### Images & Media

**Landing Page**: Dark gradient background using Deep Blue (`#0E1226`), PIXELLAB logo centered

**Icons**: Lucide React icons for all interface elements

**Logo Usage**: PIXELLAB symbol for sidebar, full logo for landing/about dialogs

---

### Responsive Behavior

**Mobile (<768px)**: Sidebar becomes slide-out drawer, single-column layouts, horizontal scroll tables, 48px minimum tap targets

**Tablet (768-1024px)**: 2-column forms, 2-3 column stat grids, sidebar visible

**Desktop (>1024px)**: Full 4-column grids, expanded tables, all features visible

---

### Accessibility

- WCAG AA contrast ratios across all color combinations
- Focus indicators: 3px accent outline on all interactive elements
- Keyboard navigation for all workflows
- Form validation with clear inline error messages
- Tooltips for medical abbreviations
- Loading states for all async operations

---

### Module-Specific Styling

**PMS (Programa Medicamento Social)**
- Primary accent: Magenta (`#FF2CA6`)
- Patient cards with Magenta left border
- Dispensation receipts with PIXELLAB branding

**Delta-Tracking**
- Secondary tool styling, uses Clinical Blue (`#3EC6FF`)
- Data comparison tables with alternating row colors

**Mesa de Decisao**
- Decision-focused layout with prominent action buttons
- Tech Purple (`#6B40FF`) for primary decision actions
