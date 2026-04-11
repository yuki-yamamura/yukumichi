---
name: create-pr
description: Create a GitHub pull request following the project template and conventions. Use this skill when the user explicitly asks to create a PR, open a PR, or submit a pull request. Do not trigger on general code discussions unless the user says to create/open/submit a PR.
---

# Create PR

Create a well-structured GitHub pull request that follows the project's template and conventions.

## Prerequisites

Read `CONTRIBUTING.md` to confirm the current conventions before proceeding.

## Workflow

### Step 1: Ensure a branch exists

Check the current branch:

```bash
git branch --show-current
```

**If on a feature branch** (matches `<category>/#<number>` pattern):
- Extract the issue number from the branch name (e.g., `feat/#58` → `58`).

**If on `main`**:
- An issue must exist before creating a PR. Ask the user which issue this PR is for, or suggest using the `create-issue` skill if there is no issue yet.
- Once the issue number is known, create and switch to a branch following the naming convention:

```bash
git switch -c <category>/#<issue-number>
```

Choose the category based on the issue context (refer to `CONTRIBUTING.md` for the branch naming convention).

### Step 2: Ensure the branch is pushed

Check if the remote tracking branch exists:

```bash
git ls-remote --heads origin "$(git branch --show-current)"
```

If no remote branch exists, push with upstream tracking:

```bash
git push -u origin "$(git branch --show-current)"
```

### Step 3: Collect commits

Gather the commit list since diverging from main:

```bash
git log main..HEAD --oneline --no-decorate
```

Each line becomes an entry in the Changes section. Write commit hashes as plain text (no backticks) so GitHub auto-links them.

### Step 4: Write the overview

Summarize the PR based on:
- The related issue (fetch it with `gh issue view <number>`)
- The commit messages and diff

The overview should explain what was done and why, in a few sentences. Include the issue link as `- Closes #<number>`.

### Step 5: Create the PR

```bash
gh pr create \
  --assignee "yuki-yamamura" \
  --title "<descriptive title>" \
  --body "$(cat <<'EOF'
## Overview

<description and reasoning>

- Closes #<issue-number>

## Changes

- <hash>: <commit message>
- <hash>: <commit message>
EOF
)"
```

Title should be plain descriptive text — no issue number prefix, no special formatting.

### Step 6: Report

After creation, report the PR URL to the user.

## Conventions

- **Title**: plain descriptive text
- **Overview**: description, reasoning, and issue link with `- Closes #<number>`
- **Changes**: list commits with hashes (no backticks, so GitHub auto-links them)
- **Assignee**: always `yuki-yamamura`
