# Invisioned Marketing -- Design System

> Reference document for maintaining visual consistency across the Tasha / Invisioned Marketing portfolio site.
> Stack: Next.js, Tailwind CSS v4, Framer Motion, Radix UI primitives.

---

## A. Color System

### CSS Custom Properties (globals.css)

The site ships a single dark theme (the `<html>` element carries `class="dark"` permanently).
All design tokens live in `:root` and are re-exported through `@theme inline` for Tailwind:

| Token                  | Value                       | Usage                        |
|------------------------|-----------------------------|------------------------------|
| `--background`         | `#09090b` (zinc-950)        | Page background              |
| `--foreground`         | `#fafafa`                   | Primary text                 |
| `--card`               | `rgba(24,24,27,0.7)`       | Card surfaces                |
| `--primary`            | `#a855f7` (purple-500)      | Brand accent, ring, CTA      |
| `--secondary`          | `#fde047` (yellow-300)      | Secondary accent             |
| `--muted`              | `#27272a` (zinc-800)        | Borders, dividers            |
| `--muted-foreground`   | `#a1a1aa` (zinc-400)        | Secondary text               |
| `--destructive`        | `#ef4444` (red-500)         | Error states                 |
| `--border`             | `#27272a`                   | Default border color         |
| `--ring`               | `#a855f7`                   | Focus ring                   |
| `--radius`             | `0.75rem`                   | Base border-radius           |

### Primary Gradient

The brand gradient runs from **rose-500** to **violet-600** and is the most repeated visual motif:

```
bg-gradient-to-r from-rose-500 to-violet-600     /* Horizontal, buttons/badges */
bg-gradient-to-br from-rose-500 to-violet-600    /* Diagonal, avatar rings */
bg-gradient-to-br from-rose-500/20 to-violet-600/20  /* Ghost icon containers */
```

### Semantic Status Colors

Used in the Tasha avatar and throughout the onboarding flow:

| State       | Text Class         | Dot / Glow Class       | Opacity Variant        |
|-------------|--------------------|------------------------|------------------------|
| Ready       | `text-emerald-400` | `bg-emerald-400`       | --                     |
| Listening   | `text-rose-400`    | `bg-rose-400`          | `bg-rose-500/25`       |
| Speaking    | `text-violet-400`  | `bg-violet-400`        | `bg-violet-500/25`     |
| Processing  | `text-amber-400`   | `bg-amber-400`         | `bg-amber-500/25`      |
| Error       | `text-rose-400`    | --                     | used for inline text   |
| Info/User   | `text-blue-200`    | `bg-blue-500/10`       | conversation bubbles   |

### Glassmorphism Opacity Tokens

These fractional opacities create the layered glass look on the dark zinc-950 base:

| Token               | Class                    | Purpose                              |
|----------------------|--------------------------|--------------------------------------|
| Surface L0           | `bg-white/[0.02]`       | Subtle info bars, phase info         |
| Surface L1           | `bg-white/[0.03]`       | Primary card background              |
| Surface L2           | `bg-white/[0.04]`       | Inner glow overlay                   |
| Surface L3           | `bg-white/[0.05]`       | Hover state for inputs/buttons       |
| Surface L4           | `bg-white/[0.08]`       | Active/hover on interactive cards    |
| Border resting       | `border-white/[0.06]`   | Internal dividers                    |
| Border default       | `border-white/[0.08]`   | Card and input borders               |
| Border hover         | `border-white/[0.1]`    | Card hover state                     |
| Border input hover   | `border-white/[0.15]`   | Input field hover                    |
| Border active color  | `border-rose-500/40`    | Recording state, focus ring          |
| Border active alt    | `border-violet-500/40`  | Speaking state                       |

---

## B. Typography

### Font Families

Loaded in `app/layout.tsx` via `next/font/google`:

| Family              | CSS Variable              | Tailwind Class | Role                              |
|---------------------|---------------------------|----------------|-----------------------------------|
| Inter               | `--font-inter`            | `font-sans`    | Body text, headings, descriptions |
| JetBrains Mono      | `--font-jetbrains-mono`   | `font-mono`    | Status labels, badges, UI chrome  |
| Playfair Display    | `--font-playfair`         | `font-serif`   | Reserved for editorial/hero use   |

### Type Scale

Sizes observed across components (actual Tailwind classes used):

| Class             | px   | Use Case                                          |
|-------------------|------|---------------------------------------------------|
| `text-[8px]`      | 8    | Conversation role labels ("You" / "Tasha")        |
| `text-[9px]`      | 9    | Status badges, section headers (mono, uppercase)  |
| `text-[10px]`     | 10   | Status indicator text, nav phase labels, counters |
| `text-[11px]`     | 11   | Sub-descriptions, strategy point body text        |
| `text-[12px]`     | 12   | Phase descriptions, conversation feed entries     |
| `text-[13px]`     | 13   | Body text in bubbles, form labels, card titles    |
| `text-sm`         | 14   | Nav links, button base text                       |
| `text-base`       | 16   | Avatar name, mobile nav links                     |
| `text-lg`         | 18   | Phase titles, modal headers, brand wordmark       |
| `text-3xl`        | 30   | Page-level headings (onboarding title)            |

### Tracking (Letter Spacing)

| Class                      | Usage                                              |
|----------------------------|----------------------------------------------------|
| `tracking-widest`          | Mono labels: status text, section tags, badges     |
| `tracking-[0.25em]`        | Subtitle taglines ("Voice-Powered Lead Intake")    |
| `tracking-wider`           | Button label text (mono, uppercase)                |
| `tracking-tight`           | Headings (h1, h2, h3), brand name                  |
| `tracking-tighter`         | Brand wordmark "Invisioned Marketing"              |

### Text Color Scale

| Class              | Usage                                 |
|--------------------|---------------------------------------|
| `text-white`       | Headings, active/focused labels       |
| `text-zinc-200`    | Strategy point titles                 |
| `text-zinc-300`    | Body text in bubbles, label text      |
| `text-zinc-400`    | Phase counters, resting button text   |
| `text-zinc-500`    | Descriptions, secondary info, taglines|
| `text-zinc-600`    | Section headers ("Recent"), muted UI  |

---

## C. Spacing & Layout

### Grid System

The primary content layout uses a 12-column CSS Grid with a 4/8 split:

```html
<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
  <div class="lg:col-span-4"><!-- Sidebar (Tasha avatar) --></div>
  <div class="lg:col-span-8"><!-- Main content (form) --></div>
</div>
```

On mobile (`< lg`), both columns stack to `grid-cols-1`.

### Container Widths

| Class          | Usage                                  |
|----------------|----------------------------------------|
| `max-w-6xl`    | Primary page container                 |
| `max-w-5xl`    | Navbar container                       |
| `max-w-lg`     | Modal dialog                           |
| `max-w-2xl`    | Progress bar section                   |
| `w-[92%]`      | Navbar width (with centering)          |

### Padding Tokens

| Pattern            | Usage                                     |
|--------------------|-------------------------------------------|
| `p-6`              | Card body, modal sections                 |
| `p-4`              | Voice controls card, transcript sections  |
| `p-3`              | Message bubbles, compact info displays    |
| `px-6 py-5`        | Card header sections                      |
| `px-6 py-4`        | Card footer / navigation bar              |
| `px-3 py-2`        | Compact info bars, conversation entries    |
| `px-3 py-1`        | Pill counters ("2/4")                     |
| `px-5 py-2`        | CTA pill buttons                          |
| `px-4 py-24`       | Page-level container padding              |
| `px-6 py-3`        | Navbar desktop padding                    |

### Gap Tokens

| Class     | Usage                                      |
|-----------|--------------------------------------------|
| `gap-[3px]`| Waveform bars                             |
| `gap-1`   | Icon + text in tiny labels                  |
| `gap-2`   | Badge groups, status indicators, grids      |
| `gap-3`   | Header icon + text, mobile nav links        |
| `gap-4`   | Avatar row, strategy point cards, main rows |
| `gap-8`   | Main grid columns, desktop nav links        |

---

## D. Component Patterns

### Glassmorphism Card

The foundational surface component. Used for the avatar panel, form card, transcript panel, and voice controls:

```html
<div class="relative overflow-hidden rounded-2xl border border-white/[0.08]
            bg-white/[0.03] shadow-2xl backdrop-blur-2xl">
  <!-- Top gradient line -->
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r
              from-transparent via-rose-500/60 to-transparent" />
  <!-- Inner glow overlay -->
  <div class="pointer-events-none absolute inset-0 bg-gradient-to-b
              from-white/[0.04] to-transparent" />
  <!-- Content sits at z-10 -->
  <div class="relative z-10 p-6">
    ...
  </div>
</div>
```

Key details:
- `backdrop-blur-2xl` creates the frosted glass effect
- `shadow-2xl` adds depth
- The top gradient line color varies: `via-rose-500/60` (avatar), `via-violet-500/60` (form)
- The inner glow uses `from-white/[0.04] to-transparent` for a subtle top highlight
- Content must be `relative z-10` to sit above the overlay

### Gradient Line Accent

A 1px decorative line that appears at the top of every glass card and modal:

```html
<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r
            from-transparent via-{color}/60 to-transparent" />
```

Color variants:
- `via-rose-500/60` -- avatar card, modal header
- `via-violet-500/60` -- form card

### Inner Glow Overlay

Creates a subtle top-down light wash inside glass panels:

```html
<div class="pointer-events-none absolute inset-0 bg-gradient-to-b
            from-white/[0.04] to-transparent" />
```

Always paired with `pointer-events-none` so it does not intercept clicks.

### Icon Container

Small rounded containers for phase/section icons:

```html
<div class="flex h-9 w-9 items-center justify-center rounded-lg
            bg-gradient-to-br from-rose-500/20 to-violet-600/20
            ring-1 ring-white/[0.08]">
  <Icon class="h-4 w-4 text-rose-400" />
</div>
```

Variant with `rounded-xl` and `h-10 w-10` for modal headers.

### Avatar Ring

The Tasha avatar uses a gradient border trick with nested rounded-full divs:

```html
<div class="relative flex h-full w-full items-center justify-center
            rounded-full bg-gradient-to-br from-rose-500 to-violet-600 p-[2px]">
  <div class="flex h-full w-full items-center justify-center
              rounded-full bg-zinc-950">
    <Icon class="h-6 w-6 text-rose-400" />
  </div>
</div>
```

The outer div provides the gradient, `p-[2px]` creates the border width, and the inner div restores the dark background.

### Button Variants

**Base (shadcn/ui):** `components/ui/button.tsx` uses `class-variance-authority` with variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.

**Gradient CTA** (applied via className override):

```html
<Button class="gap-2 bg-gradient-to-r from-rose-500 to-violet-600
               text-white shadow-lg shadow-rose-500/20
               transition-all hover:from-rose-600 hover:to-violet-700
               hover:shadow-rose-500/30 active:scale-[0.98]">
  <span class="font-mono text-[10px] uppercase tracking-wider">Continue</span>
  <ArrowRight class="h-4 w-4" />
</Button>
```

Full-width CTA variant adds `w-full py-6 font-bold`.

**Ghost Control Button** (voice controls):

```html
<Button variant="ghost"
  class="relative h-12 rounded-xl border transition-all duration-300
         border-white/[0.08] bg-white/[0.03] text-zinc-400
         hover:bg-white/[0.08] hover:text-white">
  <Mic class="mr-2 h-4 w-4" />
  <span class="font-mono text-[10px] uppercase tracking-wider">Speak</span>
</Button>
```

Active recording state swaps to `border-rose-500/40 bg-rose-500/10 text-rose-300`.

**Ghost Navigation:**

```html
<Button variant="ghost"
  class="gap-2 text-zinc-500 transition-all
         hover:bg-white/[0.05] hover:text-white">
```

### Badge Variants

**Base (shadcn/ui):** `components/ui/badge.tsx` -- variants: `default`, `secondary`, `destructive`, `outline`.

**Phase Badge** (outline with glass):

```html
<Badge variant="outline"
  class="shrink-0 border-white/10 bg-white/[0.04]
         font-mono text-[9px] text-zinc-400">
  P1
</Badge>
```

**Tool Badge** (colored outline):

```html
<Badge variant="outline"
  class="border-emerald-500/20 bg-emerald-500/5
         py-0 text-[8px] text-emerald-400">
  research
</Badge>
```

### Input Field Styling

All form inputs (Input, Textarea, Select) share this glassmorphic pattern:

```
border-white/[0.08] bg-white/[0.03] text-white backdrop-blur-sm
transition-all placeholder:text-zinc-600
hover:border-white/[0.15] hover:bg-white/[0.05]
focus-visible:border-rose-500/40 focus-visible:ring-rose-500/20
```

Select dropdown content: `border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl`.
Select items: `text-zinc-200 focus:bg-white/[0.08] focus:text-white`.

### Status Dot Indicator

Small colored dot positioned on the avatar to show current state:

```html
<div class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5
            rounded-full border-2 border-zinc-950 bg-emerald-400" />
```

State variations:
- Ready: `bg-emerald-400` (static)
- Listening: `animate-pulse bg-rose-400`
- Processing: `animate-bounce bg-amber-400`

### Ambient Glow

Large blurred circles placed behind page content for atmospheric depth (`components/ui/ambient-glow.tsx`):

```html
<div class="pointer-events-none absolute z-0 h-[50vw] w-[50vw]
            rounded-full blur-[150px] opacity-20 bg-rose-500/5" />
```

Positioned via utility classes: `left-[-10%] top-[-10%]` etc.
Typically placed in pairs (rose top-left, violet bottom-right).

### Pill Counter

Used for progress tracking ("2/4 answered"):

```html
<div class="flex items-center gap-2 rounded-full border border-white/[0.08]
            bg-white/[0.03] px-3 py-1">
  <CheckCircle2 class="h-3 w-3 text-emerald-400" />
  <span class="font-mono text-[10px] text-zinc-400">2/4</span>
</div>
```

### Phase Step Indicator

Active phase: `bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-background scale-110`.
Inactive phase: `border border-zinc-800 bg-zinc-900 text-zinc-500 ring-2 ring-background`.

---

## E. Animation & Interaction

### Hover Transitions

Standard hover pattern for glass surfaces:

```
transition-all duration-300
hover:border-white/[0.1] hover:bg-white/[0.04]    /* cards */
hover:border-white/[0.15] hover:bg-white/[0.05]   /* inputs */
hover:bg-white/[0.08] hover:text-white             /* buttons */
```

Text color transitions: `transition-colors duration-400` (navbar links).

### Active Scale Feedback

CTA buttons compress slightly on click:

```
active:scale-[0.98]
```

### Pulse Animations

Tailwind's built-in `animate-pulse` is used for:
- Recording status dot (`bg-rose-400`)
- Speaking status dot (via activity icon)
- Recording button inner glow (`bg-rose-500/5`)
- Avatar glow ring (`bg-rose-500/25` or `bg-violet-500/25`)

`animate-bounce` is used for the processing/thinking status dot (`bg-amber-400`).

`animate-spin` (slow) is used for the processing avatar glow ring (`bg-amber-500/25`).

### Waveform Bar Animation

When recording or speaking, 24 thin bars animate with staggered timing:

```html
<div class="flex items-center justify-center gap-[3px]">
  <!-- Per bar: -->
  <div class="w-[2px] rounded-full bg-rose-400/60"
       style="height: random(4-24)px;
              animation: pulse 0.3-0.7s ease-in-out infinite alternate;
              animation-delay: i * 0.03s;" />
</div>
```

Color switches to `bg-violet-400/60` when speaking.

### Custom Keyframe: glow-pulse

Defined in `globals.css` for ambient glow cycling:

```css
@keyframes glow-pulse {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.8; }
}
.animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
```

### Framer Motion -- Modal Spring

The Strategy Forge modal uses a spring transition:

```ts
initial={{ opacity: 0, scale: 0.9, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: 20 }}
transition={{ type: "spring", duration: 0.5 }}
```

### Framer Motion -- Staggered List Entry

Strategy points animate in with staggered delays:

```ts
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.12 + 0.2 }}
```

### Framer Motion -- Mobile Menu

```ts
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
transition={{ duration: 0.2 }}
```

### Framer Motion -- Navbar Color Transition

The navbar smoothly transitions between light (top) and dark (scrolled) states:

```ts
animate={{
  backgroundColor: scrolled ? "rgba(24,24,27,0.85)" : "rgba(255,255,255,0.7)",
  borderColor: scrolled ? "rgba(39,39,42,0.8)" : "rgba(228,228,231,0.8)",
}}
transition={{ duration: 0.4 }}
```

---

## F. Responsive Breakpoints

### Strategy

Mobile-first. Most layout shifts happen at the `lg` breakpoint (1024px).
The navbar switches at `md` (768px).

### Breakpoint Usage

| Breakpoint | Usage                                                      |
|------------|------------------------------------------------------------|
| Default    | Single-column grid, stacked avatar + form                  |
| `md`       | Navbar: show desktop links + CTA, hide hamburger           |
| `lg`       | 12-column grid activates (4/8 split), sidebar sticks       |

### Visibility Patterns

```
hidden md:flex          /* Desktop nav links */
hidden md:inline-block  /* Desktop CTA */
md:hidden               /* Mobile hamburger */
```

The avatar sidebar uses `sticky top-24` on desktop so it follows the user while scrolling the form.

---

## G. Dark Mode

### This IS Dark Mode

The site runs permanently in dark mode. The `<html>` element carries `class="dark"`, and `themeColor` in the viewport meta is set to `#09090B` (zinc-950).

There is no light mode toggle. The entire design system assumes a near-black background.

### Background Layering

From back to front on any glass card:

1. **Page base:** `#09090b` (zinc-950) -- set on `body`
2. **Ambient glow:** `bg-rose-500/5` or `bg-violet-600/5` at `opacity-20`, blurred 150px
3. **Card surface:** `bg-white/[0.03]` with `backdrop-blur-2xl`
4. **Inner glow:** `bg-gradient-to-b from-white/[0.04] to-transparent`
5. **Nested surfaces:** `bg-white/[0.02]` for info bars inside cards
6. **Borders:** `border-white/[0.06]` (internal) or `border-white/[0.08]` (outer)

### Text Contrast

On the zinc-950 base with glass surfaces:

| Element             | Color          | Approx Contrast | Notes                     |
|---------------------|----------------|-----------------|---------------------------|
| Headings            | `text-white`   | ~21:1           | Maximum contrast           |
| Body text           | `text-zinc-300` | ~10:1          | Comfortable reading        |
| Secondary text      | `text-zinc-400` | ~7:1           | Meets WCAG AA              |
| Descriptions        | `text-zinc-500` | ~4.5:1         | Meets WCAG AA (large text) |
| Muted labels        | `text-zinc-600` | ~3:1           | Decorative/supplementary   |
| Placeholders        | `text-zinc-600` | ~3:1           | Input hints                |

### Navbar Light-to-Dark Scroll Transition

The navbar is a special case -- it starts with a light glass appearance and transitions to dark on scroll via Framer Motion animated `backgroundColor` and `borderColor`. Text and CTA colors also swap:

- **Top of page:** white glass (`rgba(255,255,255,0.7)`), dark text (`text-zinc-900`), dark CTA
- **Scrolled:** dark glass (`rgba(24,24,27,0.85)`), light text (`text-white`), light CTA

---

## H. Scrollbar

Custom webkit scrollbar styling defined in `globals.css`:

```css
::-webkit-scrollbar       { width: 8px; }
::-webkit-scrollbar-track  { background: var(--background); }
::-webkit-scrollbar-thumb  { background: var(--muted); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }
```

---

## I. Naming Conventions

### CSS Variable Pattern
All shadcn/ui tokens use `--kebab-case` names without a namespace prefix.

### Component File Naming
- UI primitives: `components/ui/{name}.tsx` (button, badge, input, etc.)
- Feature components: `components/{feature}/{descriptive-name}.tsx`
- Pages: `app/{route}/page.tsx`

### Tailwind Class Ordering
The project uses Biome for formatting. Run `npx biome check --fix` to auto-sort and lint.

### Mono Label Convention
All small UI labels (status text, section headers, badges, button text) follow this pattern:

```
font-mono text-[9px] uppercase tracking-widest text-zinc-500
```

Size varies between `text-[8px]` and `text-[11px]` depending on prominence, but the `font-mono uppercase tracking-widest` trio is consistent.
