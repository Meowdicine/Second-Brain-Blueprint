---
title: Launchpad Guide
date: 2026-04-16
tags: [system, guides, launchpad, starter]
---

# Launchpad Guide

The starter has three launchpad surfaces.

They are related, but they do different jobs.

## 1. Public Homepage

- File: `README.md`
- Purpose: explain what the repository is and how to start
- Audience: first-time visitors, fork users, and public readers

This is the public-facing launchpad.

## 2. Markdown Execution Surface

- File: `DASHBOARD.md`
- Purpose: turn the current week into a concrete working set
- Audience: the owner of the private instance and any agent helping maintain it

This is the Markdown launchpad.

## 3. Optional Dashboard Launchpad

- Surface: sidebar launchpad inside `dashboard/`
- Purpose: rank quick actions based on route, recent notes, and optional Google Tasks data
- Audience: users who want a visual control surface

This is the interactive launchpad.

It should accelerate action, not replace the wiki.

## Design Rule

The launchpad is part of the control layer.

It can:

- open the next note
- surface the next action
- point to external tools
- route the user back into the wiki

It should not become the knowledge layer itself.

## Promotion Rule

Only promote a note, link, or tool into a launchpad surface when it is:

- high-frequency
- stable enough to stay visible
- useful for starting or resuming work
- aligned with the public/private boundary

## Current Starter Pattern

Use this order:

1. `README.md`
2. `DASHBOARD.md`
3. `INDEX.md`
4. starter area notes
5. optional dashboard launchpad

The first three must make sense even if the optional dashboard is never opened.

## Related Files

- [[WORKFLOW|Workflow]]
- [[LLM-WIKI-MAINTENANCE|LLM Wiki Maintenance Guide]]
- [[QUICK_REFERENCE|Quick Reference]]
- [[../../AGENTS|AGENTS]]
- [[../../PRIVACY|PRIVACY]]

---

**Last Updated**: 2026-04-16
