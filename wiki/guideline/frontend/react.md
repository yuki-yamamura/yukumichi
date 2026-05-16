---
paths: "apps/web/src/**/*.tsx"
---

# React Guidelines

## Component Structure

You must follow this exact structure for all React components:

```tsx
// 1. "use client" directive (for client components)
"use client";

// 2. External library imports (node_modules, runtime dependencies)
import { useEffect } from "react";

// 3. Internal library imports with absolute path (@/)
import { someUtil } from "@/lib/utils";

// 4. Internal library imports with relative path (./)
import { SubComponent } from "./sub-component";

// 5. Type imports (absolute path first, then relative path)
import type { SomeType } from "@/path/to/types";
import type { PropsWithChildren } from "react";

// 6. Style imports
import styles from "./component-name.module.css";

// 7. Props type definition
type Props = PropsWithChildren<{
  name: string;
}>;

// 8. Component implementation (exported as named export)
export function ComponentName({ name, children }: Props) {
  // 1. Hook calls
  const {
    data: { items },
    isLoading,
  } = useQuery();

  // 2. Computed values and derived state
  const filteredItems = items.filter((item) => item.isActive);
  const displayText = isLoading ? "Loading..." : `Found ${filteredItems.length} items`;

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. useEffect hooks
  useEffect(() => {
    // Effect logic
  }, []);

  // 5. JSX
  return <div className={styles.module}>{/* Content */}</div>;
}
```

You must follow these component conventions:

- Use early returns when possible instead of conditional rendering in JSX
- Keep JSX as pure markup as much as possible, but use inline callback functions when it's simple (e.g. `(isOpen: boolean) => setIsOpen(false)`)
- Use named exports for components unless the library or framework requires default exports

## Props Conventions

### Naming

You must follow these naming conventions:

- Name `Props` unless two or more components are in the same file
- Name `**Props` if two of more components in the same file

```tsx
// ✅ Correct - Use `Props` if there's one component in the file
type Props = {
  items: Item[];
  onItemClick: (item: Item) => void;
  title: string;
};

// ✅ Correct - Use `**Props` if there's some components in the same file
type UserListItemProps = { ... }
```

### Type Utilities

You must use these React type utilities when applicable:

- Use `PropsWithChildren<T>` when component accepts children
- Use `ReactNode` for props that accept any JSX elements
- Use `ComponentProps<'element'>` to inherit HTML element attributes

## Event Handler Conventions

You must follow these event handler conventions:

- Use `handle` prefix for event handler function names (e.g., `handleClick`, `handleOpenChange`)
- Use `on` prefix for event handler props (e.g., `onOpenChange`, `onClick`)
- Define event handlers outside of JSX when possible, but use inline callback functions when it's simple or used inside a loop block

Example of correct event handler implementation:

```tsx
type Props = {
  onOpenChange: (isOpen: boolean) => void;
};

export function SomeDialogComponent({ onOpenChange }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //  ✅ Correct - Define handler outside JSX
  const handleOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <FormComponent />
    </Dialog>
  );
}
```

Exception for loops and simple cases:

```tsx
//  ✅ Acceptable - Handler in loop
{
  items.map((item) => (
    <Button key={item.id} type="button" onClick={() => handleItemClick(item.id)}>
      {item.name}
    </Button>
  ));
}

//  ✅ Acceptable - Extremely simple handler
<Button type="button" onClick={() => setIsOpen(true)}>
  Open
</Button>;
```

## Directory Structure

You must follow these directory structure patterns:

### Standard Component Structure

Place each component in its own directory. The directory is exposed via a barrel `index.ts` that re-exports from a file named after the directory:

```
component-name/
├── index.ts                       # Barrel file
├── component-name.tsx             # Component implementation
├── component-name.module.css      # Component-specific styles
├── component-name.stories.tsx     # Storybook stories (if needed)
├── component-name.test.tsx        # Tests (if needed)
└── child-component-name/          # Child component (if needed, same pattern)
    ├── index.ts
    ├── child-component-name.tsx
    ├── child-component-name.module.css
    ├── child-component-name.stories.tsx
    └── child-component-name.test.tsx
```

Barrel file:

```ts
// index.ts
export { ComponentName } from "./component-name";
```

### Container/Presenter Pattern Structure

In this project the Container / Presenter pattern is reserved exclusively for separating a network boundary.
That means the Container performs the data fetch (typically on the server via React Server Components) and the Presenter renders the result.

Reference: <https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_2_container_presentational_pattern>

You must follow these naming conventions:

- Use `{ComponentName}Container` for the container component in `container.tsx`
- Use `{ComponentName}Presenter` for the presenter component in `presenter.tsx`
- Export the container with the original component name (without suffix) in the barrel file

Directory structure:

```
component-name/
├── index.ts                       # Barrel file
├── container.tsx                  # Component having async/await, executed in server-side
├── presenter.tsx                  # Component having `use client` directive, executed in the browser
├── presenter.module.css           # Component-specific styles
├── presenter.stories.tsx          # Storybook stories (if needed)
├── presenter.test.tsx             # Tests (if needed)
└── child-component-name/          # Child component (if needed, follows the standard pattern)
    ├── index.ts
    ├── child-component-name.tsx
    ├── child-component-name.module.css
    └── child-component-name.test.tsx
```

Example implementation:

```tsx
// container.tsx - Server Component
import { UserProfilePresenter } from "./presenter";

import type { UserId } from "@/features/account/types/api";

type Props = {
  userId: UserId;
};

export async function UserProfileContainer({ userId }: Props) {
  const user = await fetchUser(userId);

  return <UserProfilePresenter user={user} />;
}
```

```tsx
// presenter.tsx - Client Component
"use client";

import type { User } from "@/features/account/types/api";

import styles from "./presenter.module.css";

type Props = {
  user: User;
};

export function UserProfilePresenter({ user }: Props) {
  return (
    <div className={styles.base}>
      <h1>{user.name}</h1>
    </div>
  );
}
```

```tsx
// index.ts - Barrel file
export { UserProfileContainer as UserProfile } from "./container";
```

## Component Variants

You must follow these variant conventions:

- Use Class Variance Authority for component variants
- Define variant function that handles class variants, also name it as the same name as its component

Example variant implementation:

```typescript
import { cva } from "class-variance-authority";

import type { VariantProps } from "class-variance-authority";

import styles from "./tag.module.css";

const tag = cva(styles.base, {
  defaultVariants: {
    variant: "primary",
  },
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
  },
});

type Props = {
  label: string;
} & VariantProps<typeof tag>;

export function Tag({ label, variant }: Props) {
  return <div className={tag({ variant })}>{label}</div>;
}
```
