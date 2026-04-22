---
name: add-ui-component
description: Add a UI component to the project by fetching its source from the shadcn/ui GitHub repository (Base UI variant), converting Tailwind CSS to CSS Modules, generating Storybook stories covering all variants, and visually verifying the result against the original shadcn/ui design. Use this skill whenever the user wants to add a component from shadcn/ui (e.g., Button, Dialog, Select, Accordion, Tabs), create accessible UI primitives, or mentions converting shadcn components to CSS Modules. Also triggers when the user says things like "add a modal", "create a dropdown", "I need a date picker", or references any standard UI element that shadcn/ui provides.
---

# Add UI Component

Add a shadcn/ui component (Base UI variant) to the project by fetching its source, converting Tailwind CSS to CSS Modules, generating Storybook stories, and visually verifying the result.

This project uses **Base UI** (`@base-ui/react`) as the headless primitive layer — not Radix UI. Base UI is styling-agnostic by design: it exposes `data-*` attributes for state, accepts `className` props natively, and has no opinion on how styles are applied. This makes CSS Modules conversion straightforward because the behavioral layer already supports it.

## Coding Guidelines

Before creating any component, read and follow the frontend guidelines:

- `wiki/guideline/frontend/css.md` — CSS Modules conventions
- `wiki/guideline/frontend/react.md` — React component structure and patterns
- `wiki/guideline/frontend/typescript.md` — TypeScript naming and style rules

## Output Directory

All components go in `apps/web/src/components/ui/`, each in its own directory:

```
apps/web/src/components/ui/
└── button/
    ├── button.tsx
    ├── button.module.css
    ├── button.stories.tsx
    └── index.ts
```

Use kebab-case for all file names. Directories also use kebab-case.

## Workflow

### Step 1: Fetch the shadcn/ui Source (Base UI variant)

The Base UI components live in the shadcn/ui repository at `apps/v4/registry/bases/base/ui/`.

1. Fetch the component source via:
   ```
   https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/<component-name>.tsx
   ```
2. Also fetch any utilities the component depends on — typically the `cn()` function at `apps/v4/registry/bases/base/lib/utils.ts`.
3. Save the original source to `tmp/shadcn-source/<component-name>.tsx` for reference during conversion.

If the path has changed, fall back to the GitHub API search:

```
https://api.github.com/search/code?q=repo:shadcn-ui/ui+filename:<component>.tsx+path:bases/base/ui
```

### Step 2: Convert Tailwind CSS to CSS Modules

This is the core transformation. The goal is to produce visually identical output using CSS Modules instead of Tailwind utility classes.

Read `references/tailwind-to-css-modules.md` for the detailed conversion patterns before starting.

#### Conversion process

1. **Analyze the component** — identify all props, variants, states, and sub-components from the shadcn source. Pay attention to `data-slot` attributes — Base UI components use these extensively for styling hooks.

2. **Create the CSS Module** (`component-name.module.css`):
   - Map each Tailwind utility class to its CSS equivalent in semantic class names.
   - Use the project's existing design tokens (CSS custom properties) from `apps/web/src/app/globals.css` wherever possible. If a shadcn token is missing, add it to `globals.css` (both light and dark mode).
   - Leverage Base UI's `data-*` attributes for state styling — these work naturally with CSS Module selectors:
     ```css
     .trigger[data-popup-open] {
       /* styles when popup is open */
     }
     .content[data-side="top"] {
       /* position-aware styles */
     }
     ```
   - Handle interactive states (hover, focus, active, disabled) with pseudo-classes.
   - Handle dark mode consistently with the project's existing approach (check `globals.css` for the pattern).

3. **Create the component** (`component-name.tsx`):
   - Import the CSS Module: `import styles from './component-name.module.css'`
   - Use `cva` for variant-driven class mappings. Name the variant function the same as the component (per guideline):

     ```tsx
     import { cva } from "class-variance-authority";
     import type { VariantProps } from "class-variance-authority";
     import styles from "./button.module.css";

     const button = cva(styles.base, {
       variants: {
         variant: {
           default: styles.default,
           destructive: styles.destructive,
           outline: styles.outline,
         },
         size: {
           default: styles.medium,
           sm: styles.small,
           lg: styles.large,
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     });

     type Props = {
       label: string;
     } & VariantProps<typeof button>;

     export function Button({ label, variant, size }: Props) {
       return <button className={button({ variant, size })}>{label}</button>;
     }
     ```

   - Preserve the exact same public API (props, composition) as the shadcn original.
   - Import Base UI primitives from their sub-paths:
     ```tsx
     import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
     import { Select as SelectPrimitive } from "@base-ui/react/select";
     ```
   - Ensure every component that wraps an HTML element forwards its ref. Use `React.forwardRef` or accept `ref` as a prop (React 19 style). This is critical for composition — consumers need refs for focus management, measurements, and third-party library integration.
   - Re-export from an `index.ts` barrel file in the component directory.

4. **What NOT to do**:
   - Don't use `tailwind-merge` — it's unnecessary with CSS Modules.
   - Don't import from `@radix-ui/react-*` — this project uses Base UI exclusively.
   - Don't change the component's behavioral logic or accessibility attributes.
   - Don't invent new props or variants that aren't in the original.
   - Don't add inline styles as a substitute for CSS Module classes.

### Step 3: Generate Storybook Stories

Use the Storybook MCP to generate story files for the component.

1. Call the Storybook MCP tools to generate a story file based on the component source.
2. Ensure the generated stories cover **all variants and states**:
   - Every variant value (e.g., `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` for Button)
   - Every size value (e.g., `default`, `sm`, `lg`, `icon`)
   - Interactive states: hover, focus, active, disabled
   - Edge cases: long text, empty content, with icons, loading states (if applicable)
3. Each variant combination should be its own named Story for clarity in the Storybook sidebar.
4. Add a "Playground" story with all controls exposed via `argTypes` so developers can experiment interactively.

Story file location: `apps/web/src/components/ui/<component-name>/component-name.stories.tsx`

Stories use the **CSF Factory** pattern (Storybook 10+). Import the project's shared `preview` via the `#.storybook/preview` subpath import declared in `apps/web/package.json#imports`, then use `preview.meta(...)` and `meta.story(...)` to compose stories. Do not use the legacy `satisfies Meta<typeof X>` / `StoryObj<typeof meta>` forms — they were migrated away from in Storybook 10.

#### Story structure example

```tsx
import preview from "#.storybook/preview";

import { Button } from ".";

const meta = preview.meta({
  title: "UI/Button",
  component: Button,
});

export const Default = meta.story({
  args: {
    children: "Button",
  },
});

export const Destructive = meta.story({
  args: {
    variant: "destructive",
    children: "Delete",
  },
});

// ... all other variants
```

#### Layout-sensitive components

Components whose CSS relies on `width: 100%` or `container-type: inline-size` (e.g., Input, Textarea, Field, form fields in general) collapse to zero width under the default `layout: "centered"` setting. Constrain them via a meta-level decorator:

```tsx
const meta = preview.meta({
  title: "UI/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
});
```

This mirrors the pattern used by `Textarea`, `Input`, `Label`, and `Field` stories in this project.

### Step 4: Visual Verification

Compare the converted component against the original shadcn/ui design to ensure visual fidelity.

#### 4a. Capture the reference screenshot

1. Use chrome-devtools MCP to open a new page.
2. Navigate to the shadcn/ui docs page for the component: `https://ui.shadcn.com/docs/components/<component-name>`
3. Wait for the page to load fully.
4. Take a screenshot of the component preview section. Save it to `tmp/verification/<component-name>/reference.png`.

#### 4b. Capture the Storybook screenshot

1. Start the Storybook dev server if not already running:
   ```bash
   cd apps/web && npx storybook dev -p 6006 --no-open &
   ```
   Wait for the server to be ready (check `http://localhost:6006`).
2. Use chrome-devtools MCP to open a new page.
3. Navigate to the component's Default story in Storybook: `http://localhost:6006/iframe.html?id=ui-<component-name>--default`
4. Take a screenshot. Save it to `tmp/verification/<component-name>/storybook.png`.

#### 4c. Compare and adjust

1. Place the reference and Storybook screenshots side by side (present both to the user).
2. Check for discrepancies in:
   - Spacing and padding
   - Font size, weight, and line height
   - Colors (background, text, border)
   - Border radius and shadows
   - Interactive state styling (take additional screenshots with hover/focus states if needed — use chrome-devtools MCP hover/click tools)
3. If discrepancies are found, adjust the CSS Module and repeat the screenshot comparison.
4. The component does NOT need to be pixel-perfect — the goal is visual consistency in design language. Minor differences from the shadcn default are acceptable as long as the component looks intentional and polished.

### Step 5: Commit

Once verification passes, commit using the `commit` skill.

Stage these files:

- `apps/web/src/components/ui/<component-name>/` (all files in the directory)
- `apps/web/src/app/globals.css` (if design tokens were added)

Do NOT commit:

- `tmp/shadcn-source/` (raw reference files)
- `tmp/verification/` (screenshots)
