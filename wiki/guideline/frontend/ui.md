---
paths: "apps/web/src/components/ui/**/*.{ts,tsx,css}"
---

# UI Component Guidelines

The project mirrors the latest [shadcn/ui](https://ui.shadcn.com) components (Base UI variant) into `apps/web/src/components/ui/` and rewrites the styles in CSS Modules.

## Rationale

- shadcn/ui ships high-quality, accessible component implementations and Tailwind v4 design tokens we want to reuse.
- We do not want a hard dependency on Tailwind CSS. Writing the styles in CSS Modules (pure CSS, no Tailwind directives) keeps the styling layer resilient to upstream churn.

## Stack

- **Headless layer**: [`@base-ui/react`](https://base-ui.com). The Base UI variant of shadcn/ui — not Radix UI.
- **Visual layer**: CSS Modules per component (`{component}.module.css`).
- **Design tokens**: CSS custom properties in `apps/web/src/app/globals.css`, mirroring shadcn/ui's Tailwind v4 tokens (`--primary`, `--background`, `--radius`, etc.). When a converted component needs a token shadcn introduced, add it here in both light and dark modes.
- **Reset CSS**: [`@unocss/reset`](https://www.npmjs.com/package/@unocss/reset) — `tailwind-v4.css` is imported at the top of `globals.css`. This matches the baseline that converted shadcn components assume.

## Icon Libraries

The project uses two icon libraries.

| Library        | Package                 | Use                                                                                    |
| -------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| Lucide React   | `lucide-react`          | Icons inside shadcn/ui components.                                                     |
| Phosphor Icons | `@phosphor-icons/react` | Used intentionally to improve visibility in cases where Lucide React does not suffice. |

## Component Structure

```
apps/web/src/components/ui/
└── {component}/
    ├── {component}.tsx           # Component (Base UI primitive + CSS Modules)
    ├── {component}.module.css    # CSS Modules
    ├── {component}.stories.tsx   # Storybook
    └── index.ts                  # Barrel
```
