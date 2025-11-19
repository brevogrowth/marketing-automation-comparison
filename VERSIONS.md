# Two Versions of the Brevo KPI Benchmark

This project now includes **four different versions** of the Marketing KPI Benchmark page, all in **English**.

## Accessing the Versions

### Version 1 (V1) - Detailed Analysis Layout
**URL**: http://localhost:3002/ or http://localhost:3002/v1

**Layout**: Traditional detailed view with comprehensive sections
- Company profile sidebar
- Business assumptions refinement
- Funnel stage overview cards (4 categories)
- Complete KPI tables by category
- Personalized analysis with insights
- 3-priority action plan
- Email capture CTA

**Best for**: Deep dive analysis, comprehensive benchmarking

### Version 2 (V2) - Card-Based Grid Layout
**URL**: http://localhost:3002/v2

**Layout**: Card-based grid inspired by the screenshot provided
- Company profile card (TechFlow Solutions - B2B SaaS)
- Business assumptions at the top (as requested)
- 12 KPI cards in a 3-column grid
- Each card shows:
  - Target value
  - Low range with examples (red)
  - High range with examples (green)
  - Bad examples (gray, when applicable)
- Sources & References section at bottom

**Best for**: Quick scanning, visual comparison, card-based browsing

### Version 3 (V3) - Dashboard Score Layout
**URL**: http://localhost:3002/v3

**Layout**: Modern dashboard with category scores
- Hero section with overall health score
- Category-based scoring (Acquisition, Conversion, etc.)
- "What this means" & "Why it matters" insights
- Priority action items
- Brevo solution mapping

**Best for**: Executive summary, health check, actionable insights

### Version 4 (V4) - Interactive Workbench
**URL**: http://localhost:3002/v4

**Layout**: Split-screen interactive tool
- **Left Sidebar (Sticky)**: Configuration & Inputs. Always visible for tweaking assumptions.
- **Main Content**: Impact Dashboard & Results.
- **Features**:
  - Real-time impact simulation (visual only)
  - "Potential Revenue Uplift" calculator
  - Compact KPI rows with status indicators
  - Efficiency scores

**Best for**: "What-if" analysis, interactive exploration, power users

## Switching Between Versions

A **version switcher** appears in the header of all pages. Simply click the version name to navigate.

## Key Differences

| Feature | Version 1 | Version 2 | Version 3 | Version 4 |
|---------|-----------|-----------|-----------|-----------|
| **Industry** | Fashion E-com | B2B SaaS | Fashion E-com | B2B SaaS |
| **Layout** | Long scroll, tables | Grid of cards | Dashboard, scores | Split-screen (Sidebar + Main) |
| **Focus** | Comprehensive Data | Visual Comparison | Health & Action | Interactivity & Impact |
| **Key Element** | Detailed Tables | Red/Green Ranges | Category Scores | Sticky Input Sidebar |

## Components

### Shared Components
- `Header.tsx` - With version switcher
- `Card.tsx` - Reusable card component
- `SectionTitle.tsx` - Section titles

### Version Specifics
- **V1**: `HeroSection`, `SectorKpiSection`, `PersonalizedAnalysis`
- **V2**: `HeroSectionV2`, `KpiCard`, `CompanyProfileCard`
- **V3**: `HeroSectionV3`, `CategoryScore`, `KpiCardV3`
- **V4**: `SidebarInputs`, `ImpactDashboard`, `KpiRowV4`

## Technical Notes

- Built with Next.js 16 App Router
- TypeScript for type safety
- TailwindCSS v4 for styling
- All components are server components except where client interaction is needed
