---
paths: "**/*.{ts,tsx}"
---

# TypeScript Coding Guidelines

## Return Type Annotations on Exported Functions

You must follow these return-type conventions:

- **Default**: annotate the return type on every exported function.
- **Workaround**: omit the return type only when the inferred type is unreasonable to hand-write.

### Default: annotate the return type

Annotate the return type on exported functions whenever the type can be written concisely.

- The annotation lets code easy to read.
- It preserves narrow literal types that would otherwise widen during inference not using redundant `satisfies` or `as const`.

### Workaround: omit the return type

Omit the return type only when annotating would force you to write an unreasonable return type. Because some inferred types are so much mess and we cannot to write.
