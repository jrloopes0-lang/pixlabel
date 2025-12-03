# PIXELLAB Command Center Homepage - Implementation Guide

## Overview

The PIXELLAB Command Center homepage is the main entry point for the pharmaceutical management system, designed as a visual command center that gives users an instant overview of all critical operations.

## Conceptual Design: "3 Spheres Architecture"

### Central Hub: CAF (Central de Abastecimento Farmacêutico)
The large blue sphere at the center represents the core of the system - the pharmaceutical supply center that connects all operations.

**Key Metrics Displayed:**
- Total Stock Value: R$ 1.234.567
- Monthly Position: +12%
- Turnover Rate: 2.3x/month

### Three Connected Subsystems

#### 🟢 Programa Social (Green Sphere)
**Purpose:** Vulnerable patients + judicial actions
**Navigation:** `/sesi`
**Metrics:**
- Active Patients: 342
- Judicial Actions: 18
- Medications Distributed: 1,847

#### 🟠 Componente Estratégico (Orange Sphere)
**Purpose:** Public health program management
**Navigation:** `/estoque`
**Metrics:**
- Active Programs: 8
- Compliance Rate: 96%
- Adherence Rate: 87%

#### 🟣 Gestão Global (Purple Sphere)
**Purpose:** Global operations, inventory, suppliers
**Navigation:** `/pedidos`
**Metrics:**
- Suppliers in Contract: 23
- Critical Alerts: 5
- Total Turnover: 2.1x

## Visual Design

### Color Palette

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| CAF Central | Deep Blue | `#0052CC` | Trust, authority |
| Programa Social | Green | `#2EA43F` | Wellness, life |
| Componente Estratégico | Orange | `#FF6E40` | Energy, management |
| Gestão Global | Purple | `#7C3AED` | Unity, synthesis |
| Critical Alert | Red | `#DC2626` | Urgency |
| Success | Green | `#10B981` | Compliance |

### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** Bold, 2xl-4xl sizes
- **Body Text:** Regular, 0.875rem
- **Metrics:** Bold, 2xl-3xl sizes with color coding

## Layout Zones

### Zone 1: Executive Header
```
┌─────────────────────────────────────────────────────┐
│ 🔬 PIXELLAB | [Date/Time] | [User: Nilson] [⚙️]     │
└─────────────────────────────────────────────────────┘
```
- Real-time clock (updates every second)
- User profile with avatar
- Settings access

### Zone 2: Sphere Visualization
```
            🔵 CAF CENTRAL
           /   |   |   \
          /    |   |    \
    🟢 Social  🟠 Estratégico  🟣 Global
```
- Central sphere: 224x224px (desktop)
- Small spheres: 160x160px (desktop)
- Breathing animation: 4s cycle
- Alert badges: Pulse animation for alerts
- Hover: Shows detailed metrics
- Click: Navigates to respective module

### Zone 3: Dashboard Cards
Four interactive cards displaying:
1. **Weekly Consumption** - Top 3 medications
2. **Stock Status** - Critical alerts with color coding
3. **Financial** - Monthly spending vs budget
4. **Subsystems** - Real-time status of all modules

### Zone 4: Intelligent Footer
- Last update timestamp
- Quick action buttons (Import CSV, Generate Report, Support)

## Animations & Interactions

### Breathing Animation
```css
@keyframes breathing {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.02) translateY(-4px); }
}
```
- Duration: 4 seconds
- Easing: ease-in-out
- Applied to all spheres

### Hover Effects
- Sphere scales to 110%
- Shadow intensifies
- Metrics overlay appears
- Transition: 500ms

### Click Navigation
Each sphere navigates to its respective module:
- CAF Central → `/estoque`
- Programa Social → `/sesi`
- Componente Estratégico → `/estoque`
- Gestão Global → `/pedidos`

## Responsive Design

### Mobile (<768px)
- Single column layout
- Spheres stack vertically
- Header simplified (hide date on small screens)
- Cards full width

### Tablet (768-1024px)
- 2-3 column grid for cards
- Spheres in row layout
- Full header visible

### Desktop (>1024px)
- Full 4-column card grid
- Optimal sphere spacing
- All features visible

## Mock Data Structure

Located at: `client/src/data/data-mock.json`

The mock data structure follows the API contract that will be implemented in Phase 3:

```json
{
  "caf": { ... },
  "programa_social": { ... },
  "componente_estrategico": { ... },
  "gestao_global": { ... },
  "consumo_semanal": [...],
  "alertas_criticos": [...],
  "financeiro": { ... }
}
```

## Future Enhancements

### Phase 2: API Integration
- Replace mock data with real API calls
- Implement WebSocket for real-time updates
- Add loading states and error handling

### Phase 3: Advanced Features
- Sound effects on clicks (optional)
- Keyboard shortcuts (1, 2, 3 for quick navigation)
- Fullscreen mode for presentations
- Historical data mini-graphs
- Customizable dashboard widgets

### Phase 4: User Preferences
- Save preferred metrics to display
- Custom alert thresholds
- Dashboard layout customization

## Technical Implementation

### Files
- **Component:** `client/src/pages/HomeCommandCenter.tsx`
- **Styles:** `client/src/index.css` (breathing animation)
- **Mock Data:** `client/src/data/data-mock.json`
- **Router:** Updated in `client/src/App.tsx`

### Dependencies
- React 18
- wouter (routing)
- Tailwind CSS
- lucide-react (icons)

### Key Functions
- `formatTime()` - Real-time clock display
- `formatDate()` - Portuguese date formatting
- `Sphere` component - Reusable sphere with hover effects

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast WCAG AA compliant
- Focus indicators on all interactive elements

## Performance

- No external API calls (mock data)
- Optimized animations (GPU-accelerated)
- Lazy-loaded components
- Minimal re-renders with React hooks

## Maintenance

### Updating Mock Data
Edit `client/src/data/data-mock.json` with new values.

### Changing Colors
Update the inline styles in `HomeCommandCenter.tsx` or add to `tailwind.config.ts`.

### Adding New Spheres
Duplicate the `<Sphere>` component and update:
1. Title
2. Color
3. Metrics array
4. Navigation path

## Testing Checklist

- [ ] All spheres display correctly
- [ ] Hover effects work on all spheres
- [ ] Navigation works for each sphere
- [ ] Clock updates every second
- [ ] Alert badges display correct counts
- [ ] Cards show proper data
- [ ] Footer buttons render
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1920px)
- [ ] Animations don't cause performance issues
- [ ] TypeScript compiles without errors

## Support

For questions or issues with the homepage implementation, contact the development team or refer to:
- Main project docs: `/docs/`
- Design guidelines: `/design_guidelines.md`
- Project summary: `/PROJECT_SUMMARY.md`

---

**Last Updated:** December 3, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
