---
title: Wiki Lint Checklist
date: 2026-04-15
tags: [system, guides, lint]
---

# Wiki Lint Checklist

Use this checklist to keep the starter healthy as a persistent wiki.

## Weekly Checks

- Review notes with zero outbound links.
- Check whether recent source notes were integrated.
- Check for outdated paths, renamed folders, or stale rule references.
- Check whether recurring topics should become synthesis pages.
- Check whether `DASHBOARD.md` still matches the real current work.
- Append a `lint` entry to [[../LOG|System Log]] when done.

## Monthly Checks

- Review synthesis pages and update `last_reviewed`.
- Merge duplicate notes that cover the same topic.
- Archive dead-end drafts that never became useful knowledge.
- Review [[../../90_Attachments/SOURCE-INDEX|Source Index]] and remove stale entries.
- Review `README.md` and demote links that no longer deserve first-screen space.
- Confirm the starter still reads like a public template rather than a private instance.

## Fast Prompt

```text
Run a wiki lint pass on this repository.
Check for orphan notes, stale path references, duplicated topic pages, unintegrated source notes, missing synthesis pages, privacy-boundary violations, and launchpad drift.
Summarize findings, make safe fixes, and append the result to 99_System/LOG.md.
```
