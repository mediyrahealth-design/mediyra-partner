# Design Brief

## Direction

Mediyra Lab admin & partner portal — B2B healthcare platform for lab administrators and collection centers. Combines professional trust with modern Material Design; prioritizes data clarity, operational efficiency, and confident decision-making.

## Tone

Clean, serious, trustworthy professional with contemporary edge. Medical blue conveys healthcare authority; generous spacing and rounded corners reduce clinical coldness while maintaining professional focus.

## Differentiation

Hierarchical card-based layout with intentional surface elevation—admin dashboard uses stat cards (trend-focused), data tables (content-dense), and workflow sections (actions-oriented). Medical blue + teal accent system signals trust; color-matched shadows (not pure black) create premium depth distinct from generic SaaS.

## Color Palette

| Token      | OKLCH         | Role                           |
| ---------- | ------------- | ------------------------------ |
| background | 0.98 0.008 230 | Off-white, cool undertone      |
| foreground | 0.18 0.015 230 | Deep blue-gray text             |
| card       | 1.0 0.004 230 | Pure white surfaces             |
| primary    | 0.48 0.16 250  | Medical blue, authority/trust   |
| accent     | 0.6 0.15 170   | Teal, secondary actions/status  |
| muted      | 0.94 0.01 230  | Subtle sections, disabled       |
| destructive | 0.55 0.22 25  | Errors, warnings, destructive   |

## Typography

- Display: Space Grotesk — geometric sans-serif, headings, dashboards, admin titles
- Body: Figtree — professional readability, labels, table text, form inputs
- Mono: GeistMono — numeric data, lab references, invoice/report IDs
- Scale: Page title `text-4xl font-bold tracking-tight`, section `text-2xl font-bold`, stat value `text-3xl md:text-4xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Stat cards and tables use color-matched medical-blue shadows (`0 2px 6px rgba(72,126,176,0.1)`); header elevated with primary background + shadow; sidebar anchored with primary tint; borders reinforce separation via cool gray without visual heaviness.

## Structural Zones

| Zone       | Background                | Border           | Notes                          |
| ---------- | ------------------------- | ---------------- | ------------------------------ |
| Admin Header | bg-primary              | none             | White text, blue, navigation anchor |
| Sidebar    | bg-sidebar                | border-r         | Blue-tinted nav, icon + label  |
| Main Content | bg-background           | —                | Off-white, scrollable sections |
| Stat Cards | bg-card                   | border-border    | White, elevated, hover effect  |
| Data Tables | bg-card                  | border-b per row | Striped alt rows via bg-muted  |

## Component Patterns

- **Login Form:** Centered card, input fields with pl-10 for left icons (no overlap), blue button, forgot password link
- **Stat Cards:** Grid `sm:grid-cols-2 lg:grid-cols-4`, trend icon top-right, value/label bottom, hover lift
- **Data Tables:** Striped rows (alternating bg-muted/50), action buttons (View, Edit, Delete), status badges (success/warning/error)
- **Buttons:** Primary blue, accent teal; rounded-lg, hover via opacity, no shadows on text buttons
- **Forms:** Rounded-lg inputs, focus ring primary, error state red border + destructive text

## Admin Sections

- **Dashboard:** 4 stat cards (Total Bookings, Today's Samples, Pending Reports, Monthly Revenue) with sparkline or trend indicator
- **Booking Management:** Table with Patient ID, Name, Partner, Tests, Date, Status; inline actions for details/status update
- **Report Management:** PDF upload section, report history, audit trail
- **Payment Management:** Partner earnings, invoice generation, payment status tracking

## Motion

- Cards: `animate-fade-in` 0.3s, `animate-slide-up` 0.3s on dashboard load
- Hover: `transition-smooth` 0.3s on buttons, cards, rows
- Constraints: No bouncy/decorative animations; motion is functional only

## Responsive

Mobile-first (`sm:` tablet, `md:` desktop); sidebar collapses on mobile, stat cards stack, tables scroll horizontally on small screens.

## Signature Detail

Medical blue primary with teal accents and cool gray neutrals; premium depth via color-matched shadows; generous spacing (gap-6 sections, px-6 content padding) creates breathing room distinct from dense healthcare software.

