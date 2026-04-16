---
title: LLM Wiki Maintenance Guide
date: 2026-04-15
tags: [system, guides, knowledge-management, LLM-wiki]
---

# LLM Wiki Maintenance Guide

This guide defines the maintenance loop that makes the starter behave like a persistent wiki.

## Architecture

- Raw-source layer: outside the repo by default
- Source registry: [[../../90_Attachments/SOURCE-INDEX|Source Index]]
- Wiki layer: notes inside this repository
- Operation history: [[../LOG|System Log]]
- Public homepage: `README.md`
- Markdown execution surface: `DASHBOARD.md`
- Optional interactive launchpad: `dashboard/`

## Ingest Loop

For every important new source:

1. confirm where the raw file actually lives
2. update [[../../90_Attachments/SOURCE-INDEX|Source Index]] if needed
3. create a source note from [[../Templates/Source-Ingest-Template|Source Ingest Template]]
4. update one or more existing wiki pages
5. create or update a synthesis page if the source changes the current model
6. append an entry to [[../LOG|System Log]]

## Source Note Rule

Every important source note should include:

- exact `raw_path`
- source type
- integration status
- related topics
- links to updated notes

The source note is the bridge between evidence and durable memory.

## Synthesis Rule

Promote recurring topics into living synthesis pages when:

- multiple sources keep touching the same topic
- a judgment is evolving over time
- contradictions or tradeoffs need to stay visible
- the topic will guide future action

Use [[../Templates/Synthesis-Note-Template|Synthesis Note Template]].

## Entrypoint Rule

Only promote a page into a launchpad surface when it is:

- high-frequency in real use
- useful as a starting point
- decision-shaping rather than merely descriptive
- stable enough to justify first-screen space

## Logging Rule

After ingest, lint, or a meaningful query that produces reusable knowledge:

- update [[../LOG|System Log]]
- prefer one short durable entry over chat-only memory

## Lint Rule

Run a health check at least weekly or monthly using [[WIKI-LINT-CHECKLIST|Wiki Lint Checklist]].

Minimum checks:

- source notes that were never integrated
- stale paths or outdated entrypoints
- duplicate topic pages
- privacy-boundary violations
- launchpad links that no longer reflect current priorities
