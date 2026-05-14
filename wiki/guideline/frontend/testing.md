---
paths: "apps/web/src/**/*.test.{ts,tsx}"
---

# Frontend Testing Guidelines

Tests follow the principles of Kent C. Dodds's [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications).

## Summary

| Layer       | Tool                                                | Examples                                                                   | What to cover                                                                     |
| ----------- | --------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Static      | TypeScript, ESLint                                  | `tsc --noEmit`, `eslint`                                                   | Type errors and lint violations caught as code is written                         |
| Unit        | Vitest (`.test.ts`)                                 | `utils/some-utility.test.ts`, `hooks/some-hook.test.ts`                    | Pure functions and custom hooks tested via `renderHook`                           |
| Integration | Vitest browser mode + Testing Library (`.test.tsx`) | `features/{feature}/components/{component-name}/{component-name}.test.tsx` | One component rendered with real dependencies, exercised through user interaction |
| E2E         | Playwright                                          | `apps/e2e/usecase/{test-cases,scenarios}/*.spec.ts`                        | Server Actions, browser features, and page-level UI behaviors                     |

## Unit (`**/*.test.ts`)

- Pure functions whose behavior is fully determined by their arguments.
- Custom hooks tested via `renderHook`.

## Integration (`**/*.test.tsx`)

### Shared UI (`components/**/*.tsx`)

Shared UI primitives under `components/` are intentionally kept free of complex branching logic, so a `.test.tsx` is not required. Storybook, combined with the Chromatic visual regression check on CI, covers verification.

### Feature-based UI (`features/{feature}/components/**/*.tsx`)

- Each top-level feature component requires a `.test.tsx`.
- Internal modules collocated under a feature component (children or helpers placed inside the same directory) may have their own tests when writing the parent test would force excessive setup.

## E2E (`apps/e2e/`)

Playwright drives browser-level tests. E2E covers what Vitest cannot:

- Server Actions invoked through the real form-post dispatch (redirect, `revalidatePath`); Vitest only sees them as plain function calls
- Browser-only features (real navigation, `window`, focus, scroll, history)
- Page-level UI and outcomes (URL transitions, toasts and other surface area that lives outside a single component tree)

## Vitest and Storybook

Vitest and Storybook verify different facets of the same component and are not interchangeable:

| Target                                                                                                                       | Tool                  |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Static visual states driven by props (initial render, variants, error display, disabled, etc.)                               | Storybook + Chromatic |
| User interaction (click, type, submit) and the resulting behavior — including text changes such as validation error messages | Vitest                |
