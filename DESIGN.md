# Design Brief

## Direction

Mediyra Lab — B2B partner app for collection centers. Professional healthcare trust combined with modern Android-inspired Material Design; prioritizes clarity, efficiency, and partner confidence.

## Tone

Clean, serious, trustworthy professional with a modern edge. Medical blue primary conveys healthcare credibility while avoiding clinical coldness; generous spacing and rounded corners soften formality.

## Differentiation

Card-based layout mimicking native Android Material Design with deliberate surface elevation—each UI zone has intentional background treatment (header raised, alternating content layers, grounded footer). Medical blue accent hierarchy signals trust without compromise on contemporary aesthetics.

## Color Palette

| Token      | OKLCH         | Role                           |
| ---------- | ------------- | ------------------------------ |
| background | 0.98 0.008 230 | Clean off-white, cool undertone |
| foreground | 0.18 0.015 230 | Deep blue-gray text             |
| card       | 1.0 0.004 230 | Pure white card surfaces        |
| primary    | 0.48 0.16 250  | Medical blue, trust/authority   |
| accent     | 0.6 0.15 170   | Teal secondary actions          |
| muted      | 0.94 0.01 230  | Subtle backgrounds              |
| destructive | 0.55 0.22 25  | Error/warning states            |

## Typography

- Display: Space Grotesk — clean geometric sans-serif for headings, modern tech aesthetic
- Body: Figtree — highly readable sans-serif, professional warmth, UI labels
- Mono: JetBrains Mono — lab reference data, numeric displays
- Scale: Hero `text-4xl md:text-5xl font-bold tracking-tight`, H2 `text-2xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Cards elevated via subtle medical-blue tinted shadows (`shadow-card: 0 2px 6px rgba(72, 126, 176, 0.1)`); depth created through surface hierarchy, not layered transparency. Borders use cool gray to reinforce separation without heaviness.

## Structural Zones

| Zone       | Background           | Border        | Notes                          |
| ---------- | -------------------- | ------------- | ------------------------------ |
| Header     | bg-primary           | none          | White text, blue background    |
| Navigation | bg-sidebar           | border-b      | Blue navigation, icon + label  |
| Content    | bg-background        | —             | Cool off-white, section cards  |
| Footer     | bg-muted/30          | border-t      | Grounded, muted background     |

## Spacing & Rhythm

Spacious breathing room (gap-6 between card sections, px-4 md:px-6 content padding); micro-spacing via `gap-3` within cards. 8px, 12px, 16px, 24px, 32px baseline. Alternating background colors (card vs. muted) in scrollable lists create rhythm and reduce monotony.

## Component Patterns

- Buttons: Rounded-lg (12px), medical blue primary, teal accent; hover via opacity 90%, active 80%
- Cards: Rounded-lg, white background, subtle shadows, padding-6, border-light-gray
- Badges: Pill-shaped (`rounded-full`), size-appropriate (success/warning/error color coding)
- Forms: Rounded-lg inputs with focus ring (primary-colored), error state via destructive badge + red border

## Motion

- Entrance: `animate-fade-in` (0.3s), `animate-slide-up` (0.3s) for cards on page load
- Hover: `transition-smooth` (0.3s) on buttons, cards, interactive elements
- Decorative: None—motion is reserved for purposeful interactions only

## Constraints

- No unnecessary gradients; use color elevation only
- No bouncy animations—medical context demands restraint
- Maintain high contrast (WCAG AA+ compliance) in all color pairs
- Mobile-first responsive: `sm:`, `md:` breakpoints for tablet/desktop adaptation

## Signature Detail

Medical blue primary hue (250°) paired with cool gray neutrals and teal accents creates healthcare trust without sterility. Card elevation via color-matched shadows (not pure black) makes the UI feel premium and intentional—distinct from generic SaaS design.

