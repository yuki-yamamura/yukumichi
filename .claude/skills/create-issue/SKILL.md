---
name: create-issue
description: Create a GitHub issue following the project template and conventions. Use this skill when the user explicitly asks to create an issue, file an issue, or open an issue. Do not trigger on general task discussions unless the user says to create/file/open an issue.
disable-model-invocation: true
---

# Create Issue

Create a well-structured GitHub issue that follows the project's template and conventions.

## Prerequisites

Read `CONTRIBUTING.md` to confirm the current conventions before proceeding.

## Workflow

### Phase 1: Understand the request

The user may provide varying amounts of context — from a vague idea to a detailed specification. Your job is to ask questions until you have enough information to fill every required section of the issue template confidently.

You need to determine:

1. **Title** — a concise, descriptive summary
2. **Overview** — what and why
3. **Scope** — what's included (and implicitly, what's not)
4. **Acceptance Criteria** — verifiable conditions for done
5. **Note** — optional constraints, gotchas, or context worth calling out
6. **References** — related links, docs, prior issues (if any)
7. **Labels** — one or more labels (see `CONTRIBUTING.md` for the current label set)

Use AskUserQuestion to fill gaps. Ask only what you cannot reasonably infer from the conversation. Group related questions into a single AskUserQuestion call rather than asking one at a time.

If the conversation already contains enough context (e.g., the user described the feature in detail before saying "create an issue for this"), skip straight to creation.

### Phase 2: Create the issue

Once you have a clear picture, create the issue using `gh issue create`. Do not ask for confirmation — the user trusts you to get it right based on the conversation.

```bash
gh issue create \
  --title "<title>" \
  --label "<label1>,<label2>" \
  --assignee "yuki-yamamura" \
  --body "$(cat <<'EOF'
## Overview

<what and why>

## Scope

<brief outline of deliverables>

## Acceptance Criteria

- [ ] <verifiable condition>

## Note

<optional: constraints, gotchas — omit this section entirely if not needed>

## References

<related links — omit this section entirely if none>
EOF
)"
```

### Phase 3: Report

After creation, report the issue URL and number to the user.

## Conventions

- **Title**: plain descriptive text, no prefix or special formatting
- **Labels**: every issue must have at least one label (refer to `CONTRIBUTING.md` for the current set)
- **Assignee**: always `yuki-yamamura`
- **Sections**: omit Note and References if they would be empty rather than leaving placeholder text
