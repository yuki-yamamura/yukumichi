---
paths: "apps/web/src/**/*.stories.{ts,tsx}"
---

# Storybook Guidelines

## Purpose

Storybook owns the **visual layer** of frontend verification. It captures every meaningful visual state of a component in isolation, and Chromatic guards those captures against unintended regression on CI.

## Scope

Stories are required for components in the following directories:

| Directory                                                                                   | Required | Why                                                              |
| ------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `apps/web/src/components/ui/**/*.tsx`                                                       | Yes      | Shared UI primitives — Chromatic is the only visual contract.    |
| `apps/web/src/components/form/**/*.tsx/`                                                    | Yes      | Form field wrappers.                                             |
| `apps/web/src/components/icons/**/*.tsx`                                                    | Yes      | Icon components.                                                 |
| `apps/web/src/features/{feature}/components/{component-name}/*.tsx`                         | Yes      | Top-level feature components unless they are not RSC             |
| `apps/web/src/features/{feature}/components/{component-name}/{sub-component-name}/**/*.tsx` | Optional | Add a story only if the parent story cannot exhibit the variant. |

## Coverage

A story file must include at minimum:

- **Default**: the component as consumers use it with required props only.
- **Each variant** declared via `cva` or props (size, intent, density, etc.).
- **Each visually distinct state**: disabled, loading, error display, etc.
- **Boundary content** where the design depends on dynamic content shape (long text, empty content, icon-only variants).

## Verification

Two checks guard stories:

- **Build check**: This catches broken stories, missing imports, and misconfigured args.
- **Visual check (Chromatic)**: Chromatic publishes each story and produces a visual diff against the `main` baseline. Diffs are surfaced for human approval.
