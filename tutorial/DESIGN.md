# Design System Inspired by Dribbble

## 1. Visual Theme & Atmosphere

Dribbble's design system embodies a sophisticated, creative-first aesthetic that celebrates visual inspiration and professional discovery. The palette balances deep, immersive dark tones with vibrant accent pinks, creating a sense of energy and focus that keeps the viewer's attention on the work being showcased. The typography is clean and modern, using Mona Sans throughout to establish a unified, approachable voice. The overall atmosphere is premium yet welcoming—designed to attract both seasoned designers and emerging talent while maintaining an air of professional credibility and artistic excellence.

**Key Characteristics**
- Deep, dark backgrounds (near-black) create dramatic contrast for content
- Strategic use of hot pink accents (`#EA4C89`) for call-to-action and interactive elements
- Generous whitespace and subtle purple-gray neutrals guide visual hierarchy
- Rounded, pill-shaped buttons emphasize friendly, modern interaction patterns
- Smooth micro-interactions and minimal shadows convey sophistication and refinement
- Monochromatic dark theme punctuated by high-contrast accent colors

## 2. Color Palette & Roles

### Primary
- **Deep Navy** (`#0D0C22`): Primary background and base color for the design system; used dominantly across all surfaces
- **Almost Black** (`#060318`): Secondary dark background for depth and layering; used in darker UI zones and header areas
- **Pure Black** (`#000000`): High-contrast text and bold elements requiring maximum legibility

### Accent Colors
- **Hot Pink** (`#EA4C89`): Primary call-to-action buttons, interactive highlights, and brand accent; draws user attention to key actions
- **Electric Purple** (`#3E34D3`): Secondary accent for featured content and interactive states; creates visual interest in galleries

### Interactive
- **Muted Purple** (`#655C7A`): Hover states, disabled states, and secondary interactive elements
- **Dark Purple-Gray** (`#524B63`): Tertiary interactive states and subtle UI elements
- **Charcoal** (`#3A3546`): Icon backgrounds and contained interactive zones

### Neutral Scale
- **Pure White** (`#FFFFFF`): Primary text on dark backgrounds, high-contrast content areas
- **Off-White** (`#FDFCFB`): Subtle background tint for card surfaces and contained sections
- **Light Lavender** (`#FAF9FB`): Secondary background variation for alternating card sections
- **Very Light Gray** (`#F3F3F6`): Tertiary background and input field backgrounds
- **Cool Gray** (`#F3F3F4`): Light surface for secondary content areas
- **Light Border Gray** (`#E7E7E9`): Dividing lines, borders, and subtle separators
- **Dark Gray** (`#262627`): Secondary text and muted UI elements

### Surface & Borders
- **Border Light** (`#E7E7E9`): Input borders, card separators, and subtle dividing lines
- **Subtle Dark** (`#3D3D4E`): Internal container backgrounds and layered depth

### Shadow Colors
- **Dropdown Shadow**: `rgba(0, 0, 0, 0.01) 0px 2px 2px 0px` — minimal, barely perceptible elevation for dropdowns
- **Button Shadow**: `rgba(6, 3, 24, 0.1) 0px 2px 4px 0px` — subtle depth for primary buttons

## 3. Typography Rules

### Font Family
**Primary**: Mona Sans (https://fonts.googleapis.com/)  
**Fallback Stack**: `Mona Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | Mona Sans | 48px | 600 | 51.84px | 0px | Hero headings and page titles; sets bold visual anchor |
| Heading Large / H2 | Mona Sans | 16px | 400 | 21px | 0px | Section headers and subsection titles |
| Heading Medium / H3 | Mona Sans | 15px | 500 | 21px | 0px | Card titles, component headers |
| Body / P | Mona Sans | 16px | 450 | 28px | 0px | Standard paragraph text and descriptions |
| Button / CTA | Mona Sans | 13px | 600 | 13px | 0px | All button and call-to-action text; bold for emphasis |
| Label / Caption | Mona Sans | 16px | 500 | 22px | 0px | Form labels and secondary captions |
| Input / Placeholder | Mona Sans | 14px | 400 | 28px | 0px | Input field text and placeholder copy |
| Link / Tag | Mona Sans | 12px | 500 | 12px | 0px | Inline links and tag elements |

### Principles
- **Weight Hierarchy**: Heavier weights (600) reserved for headlines and CTAs to create visual emphasis; lighter weights (400) for body text maximize readability
- **Line Height**: Generous line heights (1.5–1.75x font size) improve reading comfort across all text roles
- **Consistency**: Mona Sans used exclusively to maintain a cohesive, modern aesthetic throughout
- **Contrast**: Dark text on light backgrounds, light text on dark backgrounds, ensuring WCAG AA compliance
- **Scale**: Limited to 6 primary sizes (48px, 16px, 15px, 16px, 14px, 13px, 12px) to reduce visual fragmentation

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background**: `#FFFFFF`
- **Text Color**: `#0D0C22`
- **Font Size**: `12px`
- **Font Weight**: `500`
- **Font Family**: `Mona Sans`
- **Padding**: `0px 16px`
- **Border Radius**: `1e+07px` (pill-shaped)
- **Border**: `1px solid transparent`
- **Height**: `32px`
- **Line Height**: `12px`
- **Box Shadow**: `none`
- **Hover State**: Background `#F3F3F6`, text color `#0D0C22`
- **Active State**: Background `#E7E7E9`, text color `#060318`

#### Secondary Button
- **Background**: `rgba(0, 0, 0, 0)` (transparent)
- **Text Color**: `#0D0C22`
- **Font Size**: `12px`
- **Font Weight**: `500`
- **Font Family**: `Mona Sans`
- **Padding**: `0px 16px`
- **Border Radius**: `1e+07px`
- **Border**: `1px solid #E7E7E9`
- **Height**: `32px`
- **Line Height**: `12px`
- **Box Shadow**: `none`
- **Hover State**: Background `#F3F3F6`, border `#D0D0D5`
- **Active State**: Background `#E7E7E9`, text color `#060318`

#### Icon Button (Small)
- **Background**: `#3D3D4E`
- **Text Color**: `#9E9EA7`
- **Font Size**: `13px`
- **Font Weight**: `600`
- **Font Family**: `Mona Sans`
- **Padding**: `0px`
- **Border Radius**: `50%` (circular)
- **Border**: `1px solid transparent`
- **Height**: `24px`
- **Width**: `24px`
- **Line Height**: `13px`
- **Box Shadow**: `none`
- **Hover State**: Background `#524B63`, text color `#FFFFFF`

#### Ghost Button
- **Background**: `rgba(0, 0, 0, 0)` (transparent)
- **Text Color**: `#0D0C22`
- **Font Size**: `13px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `6px 6px`
- **Border Radius**: `0px`
- **Border**: `0px solid transparent`
- **Height**: `auto`
- **Line Height**: `normal`
- **Box Shadow**: `none`
- **Hover State**: Text color `#EA4C89`

### Cards & Containers

#### Standard Card
- **Background**: `#FFFFFF`
- **Text Color**: `#0D0C22`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `20px`
- **Border Radius**: `12px`
- **Border**: `1px solid #E7E7E9`
- **Box Shadow**: `rgba(6, 3, 24, 0.1) 0px 2px 4px 0px`
- **Line Height**: `28px`
- **Hover State**: Shadow `rgba(6, 3, 24, 0.15) 0px 4px 8px 0px`

#### Dark Card
- **Background**: `#0D0C22`
- **Text Color**: `#FFFFFF`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `20px`
- **Border Radius**: `12px`
- **Border**: `1px solid #3D3D4E`
- **Box Shadow**: `rgba(0, 0, 0, 0.3) 0px 2px 4px 0px`
- **Line Height**: `28px`

#### Elevated Container
- **Background**: `#060318`
- **Text Color**: `#FFFFFF`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `32px`
- **Border Radius**: `12px`
- **Border**: `1px solid #3A3546`
- **Box Shadow**: `rgba(0, 0, 0, 0.5) 0px 4px 12px 0px`
- **Line Height**: `28px`

### Inputs & Forms

#### Text Input
- **Background**: `#FFFFFF`
- **Text Color**: `#0D0C22`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `18px 20px 18px 44px` (left padding for icon)
- **Border Radius**: `12px`
- **Border**: `1px solid #E7E7E9`
- **Height**: `56px`
- **Line Height**: `28px`
- **Box Shadow**: `none`
- **Placeholder Color**: `#9E9EA7`
- **Focus State**: Border `#3E34D3`, box shadow `0px 0px 0px 3px rgba(62, 52, 211, 0.1)`
- **Disabled State**: Background `#F3F3F6`, text color `#9E9EA7`, border `#E7E7E9`

#### Search Input (Compact)
- **Background**: `rgba(0, 0, 0, 0)` (transparent)
- **Text Color**: `#060318`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `0px 0px 0px 24px`
- **Border Radius**: `12px`
- **Border**: `0px solid transparent`
- **Height**: `54px`
- **Line Height**: `28px`
- **Box Shadow**: `none`
- **Focus State**: Background `#F3F3F6`

#### Textarea
- **Background**: `#FFFFFF`
- **Text Color**: `#0D0C22`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `18px 20px`
- **Border Radius**: `12px`
- **Border**: `1px solid #E7E7E9`
- **Min Height**: `120px`
- **Line Height**: `28px`
- **Box Shadow**: `none`
- **Focus State**: Border `#3E34D3`, box shadow `0px 0px 0px 3px rgba(62, 52, 211, 0.1)`

### Navigation

#### Primary Navigation
- **Background**: `rgba(0, 0, 0, 0)` (transparent)
- **Text Color**: `#060318`
- **Font Size**: `16px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `0px 16px`
- **Border Radius**: `0px`
- **Border**: `0px solid transparent`
- **Height**: `30px`
- **Line Height**: `28px`
- **Box Shadow**: `none`
- **Hover State**: Text color `#EA4C89`, border bottom `2px solid #EA4C89`
- **Active State**: Text color `#EA4C89`, border bottom `2px solid #EA4C89`

#### Dropdown Menu
- **Background**: `#FFFFFF`
- **Text Color**: `#0D0C22`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Font Family**: `Mona Sans`
- **Padding**: `8px 0px`
- **Border Radius**: `12px`
- **Border**: `1px solid #E7E7E9`
- **Box Shadow**: `rgba(0, 0, 0, 0.01) 0px 2px 2px 0px`
- **Item Padding**: `12px 16px`
- **Hover Item Background**: `#F3F3F6`

### Badge

#### Default Badge
- **Background**: `#E7E7E9`
- **Text Color**: `#0D0C22`
- **Font Size**: `12px`
- **Font Weight**: `500`
- **Font Family**: `Mona Sans`
- **Padding**: `4px 8px`
- **Border Radius**: `4px`
- **Border**: `0px solid transparent`
- **Height**: `auto`
- **Line Height**: `12px`

#### Accent Badge
- **Background**: `#EA4C89`
- **Text Color**: `#FFFFFF`
- **Font Size**: `12px`
- **Font Weight**: `600`
- **Font Family**: `Mona Sans`
- **Padding**: `4px 8px`
- **Border Radius**: `4px`
- **Border**: `0px solid transparent`
- **Height**: `auto`
- **Line Height**: `12px`

## 5. Layout Principles

### Spacing System

**Base Unit**: `4px`

**Scale**:
- `4px` — Micro spacing for tight component groups
- `8px` — Padding within small components
- `12px` — Gap between inline elements
- `16px` — Standard padding, horizontal spacing
- `20px` — Card padding, medium spacing
- `24px` — Gap between major content sections
- `28px` — Vertical rhythm spacing
- `32px` — Large padding for containers
- `36px` — Gap between major layout sections
- `40px` — Extra-large padding for hero sections
- `72px` — Gap for significant layout breaks
- `116px` — Gap for full-width section separations

**Usage Context**:
- `8px–16px`: Form inputs, button padding, small cards
- `16px–24px`: Card padding, section margins
- `24px–36px`: Between content blocks and sections
- `40px–72px`: Between hero sections and major layout zones
- `116px`: Page-level section breaks and full-width gaps

### Grid & Container

**Max Width**: `1200px` for primary content container  
**Gutter Width**: `16px–24px` depending on breakpoint  
**Column Strategy**: 12-column flexible grid for desktop; 1–2 columns for mobile  
**Section Pattern**: Full-width background with centered max-width inner container

**Container Breakpoints**:
- Desktop (1024px+): `1200px` max-width, 24px gutters, 12-column layout
- Tablet (768px–1023px): `100% – 32px`, 8-column layout, 16px gutters
- Mobile (< 768px): `100% – 16px`, single column, 8px gutters

### Whitespace Philosophy

Generous whitespace creates breathing room and establishes visual hierarchy. Spacing between elements is intentional, never crowded. Large gaps between sections (36px–72px) separate conceptual zones. Padding within cards and containers (20px–32px) creates internal breathing room. This approach emphasizes content quality and reduces cognitive load.

### Border Radius Scale

- `4px` — Badges, small tags, compact components
- `8px` — Medium components, accent UI elements
- `12px` — Primary cards, containers, input fields
- `50%` — Circular buttons, avatar images, icon buttons
- `1e+07px` — Pill-shaped buttons (functionally infinite radius)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| **Flat / Base** | No shadow, `box-shadow: none` | Backgrounds, large surfaces, text-only regions |
| **Raised / Level 1** | `rgba(0, 0, 0, 0.01) 0px 2px 2px 0px` | Dropdowns, subtle elevation for secondary elements |
| **Lifted / Level 2** | `rgba(6, 3, 24, 0.1) 0px 2px 4px 0px` | Default buttons, standard cards, interactive elements |
| **Elevated / Level 3** | `rgba(6, 3, 24, 0.15) 0px 4px 8px 0px` | Card hover states, modals (non-overlay), emphasized containers |
| **Floating / Level 4** | `rgba(0, 0, 0, 0.3) 0px 4px 12px 0px` | Dark cards, floating action buttons, overlay-adjacent elements |
| **Modal / Level 5** | `rgba(0, 0, 0, 0.5) 0px 8px 24px 0px` | Modal dialogs, notification toasts, highest-priority overlays |

**Shadow Philosophy**: Shadows are minimal and restrained, using very low opacity (0.01–0.5) to create subtle depth without visual heaviness. Shadows increase in blur radius and opacity proportionally to elevation level. The dark navy base color is incorporated into shadow colors to maintain design cohesion while preserving contrast.

## 7. Do's and Don'ts

### Do
- **Use `#0D0C22` and `#060318`** as the primary background foundation for all dark-themed surfaces
- **Apply `#EA4C89` (hot pink)** exclusively to primary CTAs, interactive highlights, and brand moments that demand user attention
- **Maintain the pill-shaped button style** (`1e+07px` border radius) for all primary actions to reinforce Dribbble's modern, friendly aesthetic
- **Ensure minimum 48px touch targets** for all interactive elements on mobile and touch devices
- **Use Mona Sans exclusively** across all typography roles; never introduce additional font families
- **Pair dark backgrounds with white text** (`#FFFFFF` on `#0D0C22`/`#060318`) for maximum contrast and legibility
- **Implement generous whitespace** (24px–36px) between major content sections to create visual breathing room
- **Apply subtle shadows** (Level 1–2) to cards and inputs to create mild depth without overwhelming the interface
- **Use `#E7E7E9` for borders** on light containers and `#3D3D4E` for borders on dark containers to maintain hierarchy
- **Test color combinations** for WCAG AA compliance (4.5:1 contrast ratio for text, 3:1 for graphics)

### Don't
- **Don't use `#EA4C89` (hot pink) excessively**; reserve it for primary CTAs, badges, and moments that require urgency or brand emphasis
- **Don't introduce new colors** outside the defined palette; treat the 16 colors as a complete, finite system
- **Don't use shadows stronger than Level 2** for standard components; reserve Levels 3–5 for emphasis states and modals only
- **Don't create buttons with border radius values between `8px–20px`**; use only `4px` (badges), `8px` (small components), `12px` (containers), `50%` (circles), or `1e+07px` (pills)
- **Don't apply padding less than `8px`** to interactive elements; maintain minimum 8px internal spacing for clickability and usability
- **Don't mix font weights arbitrarily**; use only 400 (body), 450 (default), 500 (labels/links), and 600 (headings/buttons)
- **Don't implement line heights lower than 1.25x** font size; prioritize readability with 1.5x–1.75x for body text
- **Don't change input border radius**; all text inputs, textareas, and select fields must use `12px`
- **Don't nest dropdowns or floating elements** more than 2 levels deep; keep navigation hierarchy flat and scannable
- **Don't disable form elements** without providing a visual reason (tooltip, message) explaining why the element is unavailable

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|-----------------|-------|-------------|
| **Mobile** | < 768px | Single column, 8px gutters, 16px horizontal padding, stacked navigation, touch targets 48px minimum |
| **Tablet** | 768px–1023px | 2-column grid, 16px gutters, 24px horizontal padding, simplified navigation, reduced spacing (16px–24px) |
| **Desktop** | 1024px–1199px | 3-column grid, 16px gutters, 24px horizontal padding, full navigation, standard spacing |
| **Large Desktop** | 1200px+ | 12-column grid, 24px gutters, 40px horizontal padding, full-width layouts, optimal spacing (24px–36px) |

### Touch Targets

- **Minimum Interactive Area**: `48px × 48px` for all touchable elements (buttons, links, form inputs)
- **Spacing Between Targets**: Minimum `8px` gap between adjacent interactive elements
- **Icon Buttons**: `24px × 24px` minimum (primary), `32px × 32px` preferred (secondary)
- **Link Text**: Ensure underlined or visually distinct; minimum `44px` clickable area around inline links
- **Form Inputs**: `56px` height for text inputs, search fields, textareas (optimal for touch)

### Collapsing Strategy

**Navigation**: 
- Desktop: Horizontal pill-style menu with dropdown submenus
- Tablet: Horizontal menu collapses to hamburger icon; menu drawer slides from left
- Mobile: Full-screen hamburger menu with vertical navigation

**Cards & Grid**:
- Desktop (12 cols): 4 cards per row, full width with spacing
- Tablet (8 cols): 2 cards per row, reduced padding (20px → 16px)
- Mobile (single col): 1 card per row, full width minus 16px gutters

**Typography**:
- Desktop: H1 `48px`, body `16px`
- Tablet: H1 `36px`, body `15px`
- Mobile: H1 `28px`, body `14px`

**Spacing**:
- Desktop: `24px–36px` between sections, `32px` card padding
- Tablet: `16px–24px` between sections, `20px` card padding
- Mobile: `12px–16px` between sections, `16px` card padding

**Buttons & Inputs**:
- Desktop: `32px` height, `12px` font size
- Mobile: `48px` height, `14px` font size (increased for touch accuracy)

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary Background**: Deep Navy (`#0D0C22`) — dominant base for dark-themed layouts
- **Secondary Background**: Almost Black (`#060318`) — layered depth, header/footer areas
- **Primary CTA / Accent**: Hot Pink (`#EA4C89`) — call-to-action buttons, interactive highlights
- **Secondary Accent**: Electric Purple (`#3E34D3`) — featured content, secondary CTAs
- **Heading Text**: Pure White (`#FFFFFF`) on dark backgrounds; Deep Navy (`#0D0C22`) on light backgrounds
- **Body Text**: Pure White (`#FFFFFF`) on `#0D0C22`; Deep Navy (`#0D0C22`) on `#FFFFFF`
- **Neutral Border**: Light Border Gray (`#E7E7E9`) — dividing lines, card separators
- **Disabled / Muted**: Muted Purple (`#655C7A`) — hover states, secondary interactive
- **Input Background**: Pure White (`#FFFFFF`) — form fields, search inputs
- **Icon Background**: Charcoal (`#3A3546`) — contained icon zones, dark accents

### Iteration Guide

1. **All backgrounds are either `#0D0C22` (primary) or `#060318` (secondary).** Text defaults to `#FFFFFF` on dark backgrounds. Light backgrounds are `#FFFFFF`, text is `#0D0C22`.

2. **Primary CTAs always use `#EA4C89` with pill-shaped radius (`1e+07px`).** Secondary CTAs use white background (`#FFFFFF`) with dark text (`#0D0C22`) and pill radius.

3. **Typography exclusively uses Mona Sans.** Font weights are 400 (body), 450 (default), 500 (labels), 600 (headings). Sizes: 48px (H1), 16px (H2/label), 15px (H3), 14px (input), 13px (button), 12px (link).

4. **All cards and containers use `12px` border radius.** Badges use `4px`. Circular icons use `50%`. Pill buttons use `1e+07px`.

5. **Input fields are always `56px` height, white background, `#E7E7E9` border, `12px` radius, `18px` top/bottom padding, `20px` side padding.** Focus state adds `3px` blur shadow in brand purple (`rgba(62, 52, 211, 0.1)`).

6. **Shadows scale from Level 1 (minimal) to Level 5 (modal).** Standard cards use Level 2: `rgba(6, 3, 24, 0.1) 0px 2px 4px 0px`. Never use custom shadows; choose from the 5-level system.

7. **Spacing follows the 4px-based scale**: 8px, 12px, 16px, 20px, 24px, 28px, 32px, 36px, 40px, 72px, 116px. Use these exclusively; never invent intermediate values.

8. **Navigation links default to dark text (`#060318`), 400 weight, 16px size.** Hover/active state: text becomes hot pink (`#EA4C89`), add bottom border `2px solid #EA4C89`.

9. **Mobile-first responsive design.** Desktop max-width is `1200px` centered. Touch targets minimum `48px × 48px`. Gutters: 8px (mobile), 16px (tablet), 24px (desktop).

10. **Dark cards use `#0D0C22` background, `#FFFFFF` text, `#3D3D4E` border.** Light cards use `#FFFFFF` background, `#0D0C22` text, `#E7E7E9` border. Maintain this light/dark card distinction consistently.