# Contributing

## Branch Naming

`<category>/#<issue-number>`

| Category   | Usage                   |
| ---------- | ----------------------- |
| `feat`     | New features            |
| `fix`      | Bug fixes               |
| `chore`    | Maintenance and tooling |
| `docs`     | Documentation           |
| `refactor` | Code restructuring      |

## Labels

Every issue must have one or more labels.

| Label   | Usage                                             |
| ------- | ------------------------------------------------- |
| `api`   | apps/api                                          |
| `web`   | apps/web                                          |
| `infra` | Infrastructure (Terraform/AWS)                    |
| `dx`    | Developer experience (CI, skills, project config) |

## Issues

Use the issue template. Title should be a plain descriptive title.

## Pull Requests

Use the PR template. Link the issue in the body with `Closes #<issue-number>`.

## TODO Comments

TODOs that reach `main` branch must track a real issue so concerns are never lost. Temporary notes on WIP branches are free-form.

- Use a JSDoc block with `@todo` for the description.
- Include `@see <issue URL>` pointing to the tracking issue.

```typescript
/**
 * @todo Replace with structured logging
 * @see https://github.com/yuki-yamamura/sanpo/issues/35
 */
```
