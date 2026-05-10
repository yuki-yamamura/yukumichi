---
paths: "**/*.{ts,tsx}"
---

# TypeScript Coding Guidelines

## Naming Conventions

- Directory names: kebab-case
- File names: kebab-case
- Class and Enum names: PascalCase
- Type names: PascalCase
- Schema names: camelCase

### Boolean Variable Names

Use affirmative prefixes (`is`, `has`, `can`, `should`, etc.). Avoid ambiguous names without prefixes such as `open`, `active`, or `visible`.

Common prefixes and their use cases:

- `is` — state or condition (most versatile)
  - Examples: `isActive`, `isLoading`, `isValid`
- `has` — possession or presence
  - Examples: `hasError`, `hasPermission`
- `can` — ability or permission
  - Examples: `canSubmit`, `canDelete`, `canAccess`
- `should` — recommendation or preference
  - Examples: `shouldRender`, `shouldValidate`

#### Collection/Array Boolean Naming

Align the name with the array method it summarises:

- For `Array.prototype.every()` — use `isEvery*` or `isEach*`
  - Examples: `isEveryUserActive`, `isEachItemValid`
- For `Array.prototype.some()` — use `isSome*` or `isAny*`
  - Examples: `isSomeUserActive`, `isAnyItemSelected`

## Module System

- Use named exports unless the library or framework requires default exports
- Place `export` directly on the function or constant declaration
- Forbid relative imports that ascend out of the current directory (`../` is forbidden)
- Use relative imports only for siblings or descendants

```typescript
// ✅ Correct - same directory
import { formatDate } from "./format-date";

// ✅ Correct - descendant directory
import { parseDate } from "./date/parse-date";

// ✅ Correct - other directory via absolute alias
import { formatDate } from "@/utils/format-date";

// ❌ Incorrect - parent traversal via relative path
import { formatDate } from "../utils/format-date";
```

## Function Definitions

- Use function declarations for top-level/exported functions
- Use arrow functions for inner functions (event handlers, helpers inside another function)

```typescript
// ✅ Correct - top-level uses function declaration
export function processUser(user: User) {
  // ✅ Correct - inner helper uses arrow function
  const formatName = (name: string) => name.trim().toUpperCase();

  return {
    ...user,
    name: formatName(user.name),
  };
}

// ❌ Incorrect - top-level using arrow function
export const processUserBad = (user: User) => {
  // ...
};
```

## Return Type Annotations on Exported Functions

- **Default**: annotate the return type on every exported function
- **Workaround**: omit the annotation only when the inferred type is too complex to write by hand

### Default: annotate the return type

Annotate the return type whenever it can be expressed concisely.

- Makes the call-site contract explicit without jumping into the body
- Preserves narrow literal types that would otherwise widen during inference, removing the need for redundant `satisfies` or `as const`

### Workaround: omit the return type

Omit the annotation only when writing it by hand would be unreasonable, e.g. types produced by complex generic inference.

## Type vs Interface

- Use `type` instead of `interface` for type definitions
  - Prevents declaration merging surprises (interfaces can be reopened anywhere in the project)
  - Keeps type definitions consistent

## Enum and Options Pattern

- Use `as const satisfies Record<string, EnumType>` for enum objects
- Use `as const satisfies Record<EnumType, string>` for option objects
- Define the enum type first, then the enum object, then the options object

```typescript
// 1. Type
export type PetType = "cat" | "dog" | "fish";

// 2. Enum object
export const PetTypeEnum = {
  CAT: "cat",
  DOG: "dog",
  FISH: "fish",
} as const satisfies Record<string, PetType>;

// 3. Options object
export const petTypeOptions = {
  cat: "black cat",
  dog: "shiba",
  fish: "black bass",
} as const satisfies Record<PetType, string>;
```

## Type Safety and Precision

- When a type has many fields, use `Pick<Type, Keys>` to extract only what is needed instead of accepting the full type
- Prefer the most specific type available

```typescript
// ✅ Correct - extract only the required fields
export function updateUserName(user: Pick<User, "id" | "name">) {
  // ...
}

// ✅ Correct - branded id over a bare string
export function findUserById(id: UserId) {
  // ...
}

// ❌ Incorrect - accepts the entire User when only id and name are needed
export function updateUserNameBad(user: User) {
  // ...
}

// ❌ Incorrect - bare primitive where a branded type exists
export function findUserByIdBad(id: string) {
  // ...
}
```

## Programming Paradigm

- Prefer functional approaches over imperative/procedural code
- Prefer immutable operations over mutating ones
- Avoid mutating array methods (`push`, `splice`, in-place `sort`, etc.) when functional alternatives exist

```typescript
// ✅ Correct - functional
const activeUsers = users.filter((user) => user.isActive);
const userNames = users.map((user) => user.name);
const updatedUsers = users.map((user) =>
  user.id === targetId ? { ...user, isActive: true } : user,
);

// ❌ Incorrect - imperative loop with push
const activeUsers = [];
for (const user of users) {
  if (user.isActive) {
    activeUsers.push(user);
  }
}

// ❌ Incorrect - mutating in place
users.splice(index, 1);
users.sort((a, b) => (a.id < b.id ? -1 : 1));
```

## Code Readability

- Write conditions that read like natural language
- Use descriptive variable names that explain intent
- Prefer explicit comparisons over implicit boolean checks when clarity helps

```typescript
// ✅ Correct - natural language range
if (1 <= price && price <= 1000) {
  // ...
}

if (user.age >= MINIMUM_AGE) {
  // ...
}

// ✅ Correct - descriptive names
const hasValidEmail = email.includes("@");
const isWithinBudget = cost <= budget;

// ❌ Incorrect - awkward range expression
if (price > 0 && price < 1001) {
  // ...
}

// ❌ Incorrect - vague names
const emailValidation = email.includes("@");
const costFlag = cost <= budget;
```

## Default Value Handling

- Use nullish coalescing (`??`) for default values when checking for `null`/`undefined`
- Combine optional chaining (`?.`) with `??` for safe property access
- Reserve ternaries for conditional logic, not defaults

```typescript
// ✅ Correct - nullish coalescing
const userName = user?.name ?? "-";
const count = items?.length ?? 0;

// ❌ Incorrect - ternary as default
const userName = user?.name ? user.name : "-";

// ✅ Correct - ternary for actual conditional
const status = user.isActive ? "online" : "offline";
```
