---
paths: "apps/web/src/features/**/actions/*.ts"
---

# Next.js Guidelines

Server Actions live under `features/{feature}/actions/` and orchestrate mutation flows: validate form input, call the corresponding `api/` function, and apply the side effect.

## File Rules

One Server Action per file under `features/{feature}/actions/`.

```
features/{feature}/actions/
├── create-resource-action.ts        # exports createResourceAction
├── delete-resource-action.ts        # exports deleteResourceAction
└── update-resource-action.ts        # exports updateResourceAction
```

## Naming

| Semantics                          | Pattern                                      |
| ---------------------------------- | -------------------------------------------- |
| Create a resource                  | `create{Resource}Action`                     |
| Update a resource                  | `update{Resource}Action`                     |
| Delete a resource                  | `delete{Resource}Action`                     |
| Domain action with a distinct verb | the domain verb like `archiveResourceAction` |
