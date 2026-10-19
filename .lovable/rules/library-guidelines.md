# Netcon — Guidelines

## Components

The design system exports these components — import them from `@ws-f849229effde83fbe1c1/0b12b832-408c-41d2-b1c3-a5260c1d457b` and compose them before building anything from scratch:

`AccordionContent`, `AccordionItem`, `AccordionTrigger`, `Accordion`, `Button`, `CollapsibleContent`, `CollapsibleTrigger`, `Collapsible`, `Constants`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`, `Dialog`, `Flag`, `Gauge`, `InfoPanel`, `LanguageProvider`, `LanguageSelector`, `Odometer`, `PublicDirectory`, `ServerManager`, `SettingsDashboard`, `SettingsPanel`, `Switch`, `WelcomeScreens`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-f849229effde83fbe1c1/0b12b832-408c-41d2-b1c3-a5260c1d457b/styles.css` (source — preferred import)
- `@ws-f849229effde83fbe1c1/0b12b832-408c-41d2-b1c3-a5260c1d457b/dist/tokens.css` (auto-generated flat list of CSS custom properties — a raw-values fallback only; does NOT carry framework-specific wiring that the source files above provide)

