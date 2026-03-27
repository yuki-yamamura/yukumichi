---
paths: "apps/web/src/**/*.{ts,tsx}"
---

# TypeScript Coding Guidelines

## Naming Conventions

You must follow these naming conventions:

- Directory names: Use kebab-case
- File names: Use kebab-case
- React Component names: Use PascalCase
- Class and Enum names: Use PascalCase
- Type names: Use PascalCase
- Schema names: Use camelCase

### Boolean Variable Names

You must follow these boolean naming conventions:

- Always use affirmative prefixes (`is`, `has`, `can`, `should`, etc.)
- Never use ambiguous names without prefixes (avoid `open`, `active`, `visible`, etc.)

Common prefixes and their use cases:

- `is` - State or condition (most versatile)
  - Examples: `isActive`, `isLoading`, `isValid`
- `has` - Possession or presence
  - Examples: `hasError`, `hasPermission`
- `can` - Ability or permission
  - Examples: `canSubmit`, `canDelete`, `canAccess`
- `should` - Recommendation or preference
  - Examples: `shouldRender`, `shouldValidate`

#### Collection/Array Boolean Naming

When naming booleans that represent collection checks, align the name with the array method used:

- For `Array.prototype.every()` - use `isEvery` or `isEach` conventions
  - Examples: `isEveryMenuItemDisabled`, `isEachUserLoggedIn`
- For `Array.prototype.some()` - use `isSome` or `isAny` conventions
  - Examples: `isSomeUserActive`, `isAnyMenuItemSelected`

## Module System

You must follow these module conventions:

- Use named exports unless the library or framework requires default exports
- Write `export` at the beginning of the target function or constant declaration
- Never use relative path imports that go outside the current module (e.g., `../` is forbidden)
- Only use relative imports within the same module directory

Example of correct imports:

```typescript
// ✅ Correct - Use relative imports for same directory
import { Foo } from "./foo";

// ✅ Correct - Use absolute imports for parent directory
import { BarList } from "@/features/bar/components/bar-list";

// ❌ Incorrect - Do not use relative imports for parent directory
import { BarList } from "../bar-list";
```

## Function Definitions

You must follow these function conventions:

- Use function declarations for top-level/exported function definitions
- Use arrow functions for inner functions (event handlers, helper functions inside components/functions)

Example of correct function definitions:

```typescript
// ✅ Correct - Top-level exported function uses function expression
export function processUser(user: User) {
  // ✅ Correct - Inner helper function uses arrow function
  const formatName = (name: string) => {
    return name.trim().toUpperCase();
  };

  return {
    ...user,
    name: formatName(user.name),
  };
}

// ❌ Incorrect - Top-level function using arrow function
export const processUserBad = (user: User) => {
  // Implementation
};
```

## Type vs Interface

You must follow these type definition conventions:

- Use `type` instead of `interface` for type definitions
  - This prevents type modification and maintains code consistency
  - Interfaces can be extended/merged which can lead to unexpected behavior

## Enum and Options Pattern

You must follow these conventions for enums and options:

- Use `as const satisfies Record<string, EnumType>` for enum objects
- Use `as const satisfies Record<EnumType, string>` for option objects
- Define the enum type first, then the enum object, then the options object

Example of correct enum and options definitions:

```typescript
// Type definition first
export type PetType = "cat" | "dog" | "fish";

// Enum object with satisfies constraint
export const PetTypeEnum = {
  CAT: "cat",
  DOG: "dog",
  FISH: "fish",
} as const satisfies Record<string, PetType>;

// Options object with satisfies constraint
export const petTypeOptions = {
  cat: "black cat",
  dog: "shiba",
  fish: "black bass",
} as const satisfies Record<PetType, string>;
```

## Type Safety and Precision

You must follow these strict typing conventions:

- When the type is fat, use `Pick<Type, Keys>` to extract only required properties instead of passing entire objects
- Use indexed access types (e.g., `User["id"]`) instead of primitive types when referencing existing type properties
- Prefer the most specific type possible

Example of correct type precision:

```typescript
// ✅ Correct - Use Pick for specific properties
export function updateUserName(user: Pick<FatUser, "id" | "name">) {
  // Implementation
}

// ✅ Correct - Use indexed access types
export function findUserById(id: User["id"]) {
  // Implementation
}

// ❌ Incorrect - Avoid using entire type when only specific properties are needed
export function updateUserNameBad(user: User) {
  // Only uses id and name, but accepts entire User object
}

// ❌ Incorrect - Avoid primitive types when indexed access is available
export function findUserByIdBad(id: string) {
  // Should use User["id"] instead of string
}
```

## Programming Paradigm

You must follow these programming paradigm preferences:

- Prefer functional programming approaches over imperative/procedural code
- Prefer immutable operations over mutable operations
- Never use mutating methods (e.g. `Array.push()`, `Array.splice()`, etc.) when functional alternatives exist

Example of functional programming approach:

```typescript
// ✅ Correct - Functional approach
const activeUsers = users.filter((user) => user.isActive);
const userNames = users.map((user) => user.name);
const updatedUsers = users.map((user) => (user.id === targetId ? { ...user, isActive: true } : user));

// ❌ Incorrect - Imperative approach
const activeUsers = [];
for (const user of users) {
  if (user.isActive) {
    activeUsers.push(user);
  }
}

// ❌ Incorrect - Mutating operations
users.splice(index, 1);
users.sort((a, b) => a.id < b.id);
```

## Code Readability

You must prioritize natural language-like expressions:

- It's better to write conditions that can be read like natural language
- Use descriptive variable names that explain intent
- Prefer explicit comparisons over implicit boolean checks when clarity is important

Example of readable code:

```typescript
// ✅ Correct - Natural language-like conditions
if (1 <= price && price <= 1000) {
  // Handle price range
}

if (user.age >= MINIMUM_AGE) {
  // Handle eligible user
}

// ✅ Correct - Descriptive names
const hasValidEmail = email.includes("@");
const isWithinBudget = cost <= budget;

// ❌ Incorrect - Unclear conditions
if (price > 0 && price < 1001) {
  // Less clear range check
}

// ❌ Incorrect - Non-descriptive variable names
const emailValidation = email.includes("@");
const costFlag = cost <= budget;
```

## Default Value Handling

You must prefer nullish coalescing over ternary operators for default values:

- Use nullish coalescing (`??`) for default values when checking for null/undefined
- Use optional chaining (`?.`) with nullish coalescing for safe property access
- Only use ternary operators for conditional logic, not default values

Example of correct default value handling:

```typescript
// ✅ Correct - Nullish coalescing for default values
const userName = user?.name ?? "-";
const count = items?.length ?? 0;

// ❌ Incorrect - Ternary for simple default values
const userName = user?.name ? user.name : "-";

// ✅ Correct - Ternary for conditional logic (not default values)
const status = user.isActive ? "online" : "offline";
```
