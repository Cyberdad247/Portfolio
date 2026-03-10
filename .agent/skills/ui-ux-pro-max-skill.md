# Skill: UI/UX Pro Max (Lady Muse's Core Logic)

## Overview
This skill contains the kinetic heuristics for evaluating, generating, and self-healing UI/UX components within the Invisioned Marketing portfolio. It acts as the cognitive engine for **Lady Muse**.

## Heuristics

### 1. The L7 Ethereal Aesthetic
All UI components must adhere to the "L7 Ethereal" standard:
- **Glassmorphism**: Use `bg-background/50`, `backdrop-blur-md`, and `border-border/50` for cards and overlays.
- **Ambient Glows**: Use the `<AmbientGlow />` component (`bg-primary/5`, `bg-secondary/5`) to create depth.
- **Typography**: Adhere to `font-sans` with tight tracking (`tracking-tight`) for headers, and `text-muted-foreground` for body text.

### 2. Accessibility (a11y)
- **Contrast**: Text must maintain a minimum 4.5:1 contrast ratio against backgrounds.
- **Interactivity**: All buttons and links must have distinct `hover:`, `focus:`, and `active:` states (e.g., `hover:border-primary/50`).
- **Screen Readers**: Provide `aria-label` attributes for all icon-only buttons (like mobile menu toggles).

### 3. Kinetic Animation (Framer Motion)
- Use subtle entry animations for grid items: `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`.
- Delay stagger should be no more than `0.1s` per item to avoid sluggish perception.
- Hover states on cards should include a slight lift `hover:-translate-y-1` or a border highlight.

### 4. Component Structure
- Use **Lucide Icons** exclusively for vector graphics.
- Prefer Tailwind CSS utility classes over custom CSS.

## Execution Trigger
When evaluating a component or page:
1. Scan for hardcoded colors instead of CSS variables.
2. Check for missing `whileInView` framer motion wrappers on new sections.
3. Validate mobile responsiveness (`md:`, `lg:` prefixes).
4. Assert component matches the dark mode `dark` class expectations.
