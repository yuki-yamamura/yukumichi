---
name: review
description: Runs a fixed panel of six perspective-based reviewer subagents (Correctness, Refactoring, Spec, QA, Guideline, Nits) in parallel over the current branch's pull request, then aggregates findings into a unified report categorized by severity. Use when asked to review a pull request, run code review, or get feedback on PR changes in this project.
---

# Review

Orchestrate a fixed panel of perspective-based reviewer subagents to produce a unified code review report for the current branch's pull request.

Unlike domain-specialist review (the global `ultra-review` skill), every reviewer here is a **general reviewer** that reads the **entire change** through one lens. All six lenses always run, regardless of which files changed. Review value comes from independent perspectives applied to the whole change, not from filtering by file domain.

## Context

$ARGUMENTS

## Prerequisites

1. Verify a pull request exists for the current branch (draft or open): `gh pr view --json number,title,body,url`. If none exists, **stop** and tell the user that this skill requires a pull request for the current branch.
2. Identify `{feature-name}` for the working directory `./tmp/{feature-name}/` (derive it from the branch or linked issue; ask the user if unclear). Ensure `./tmp/{feature-name}/review/` exists.

## Perspectives

Six lenses, **all always run in parallel** — one subagent per lens. Each subagent is a general-purpose reviewer given a per-lens prompt template; **never** map a lens to a specialist agent (do not use the project's `*-reviewer` agents here).

| # | Lens        | Focus                                                                          | Prompt template            |
| - | ----------- | ------------------------------------------------------------------------------ | -------------------------- |
| 1 | Correctness | Bugs, logic errors, security vulnerabilities (high-confidence only, low noise) | `references/correctness.md` |
| 2 | Refactoring | Naming, design principles, simplification, reuse/duplication                   | `references/refactoring.md` |
| 3 | Spec        | Implementation & tests vs requirements; distinguish impl-gap vs test-gap       | `references/spec.md`        |
| 4 | QA          | Test adequacy, edge cases, reliability, maintainability                        | `references/qa.md`          |
| 5 | Guideline   | CLAUDE.md, wiki/guideline, DDD/ROP patterns, stack & convention alignment      | `references/guideline.md`   |
| 6 | Nits        | Typos, dead code, leftover artifacts, staleness                                | `references/nits.md`        |

The Nits lens exists so low-value findings are captured **without** diluting the other lenses: the other five must not report nit-level findings, and nit findings stay in their own report section.

## Workflow

### Phase 1: Understand the context

Read everything a human reviewer assigned to this task would read:

- The PR title, body, and diff (`gh pr view`, `gh pr diff`)
- Linked GitHub issues, and any links referenced from the PR or issues (web articles, docs)
- Files and notes under `./tmp/{feature-name}/`

### Phase 2: Launch all six subagents in parallel

For each lens, read its prompt template from `references/{lens}.md`, fill in the placeholders (PR context, feature name, output path), and launch one general-purpose subagent with the filled prompt.

- Launch all six in a single message so they run concurrently.
- Verify every subagent started and produced its output file at `./tmp/{feature-name}/review/{lens}-review.md` — if any failed to start or produced no output, retry it.

### Phase 3: Aggregate results

Collect findings from `./tmp/{feature-name}/review/{lens}-review.md` for all six lenses.

Categorize by severity:

- ❌ **Critical** — must-fix problems
- ⚠️ **Minor** — non-critical improvements
- ℹ️ **Info** — clarifications and questions

Preserve attribution on every finding: `[Lens] finding description (file:line)`.

When multiple lenses report the same finding, merge into one entry and list all reporting lenses. Keep Nits findings in their own dedicated section, outside the severity lists.

### Phase 4: Report

Save the unified report to `./tmp/{feature-name}/review/report.md` following `references/report-template.md`, then summarize it to the user: overall assessment, per-severity counts, and the most significant findings.

This skill ends at the report — do not apply fixes.
