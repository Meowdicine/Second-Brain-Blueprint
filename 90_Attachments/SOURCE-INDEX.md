---
title: Source Index
date: 2026-04-15
tags: [sources, index, raw-materials]
---

# Source Index

Registry of raw source collections for the starter.

## Operating Rule

- Keep raw sources outside the repo by default.
- Register source collections here so agents can find them quickly.
- Keep notes, synthesis, templates, and workflow rules inside the wiki.
- Use `90_Attachments/` only for the index itself or rare local exceptions.

## Starter Example Collections

| Collection | Example Path | Type | Role | Status |
|---|---|---|---|---|
| `raw-sources/` | `/path/to/raw-sources/` | General source collection | Documents, exports, screenshots, PDFs | starter |
| `research/` | `/path/to/research/` | Topic source collection | Reading and source material for Learning | starter |
| `projects/` | `/path/to/project-sources/` | Project source collection | Project-specific raw material | starter |
| `assets/` | `/path/to/assets/` | Media collection | Images and reusable assets | starter |

Replace the example paths in your private instance.

## Registration Checklist

When a new source folder appears, record:

1. collection name
2. path
3. type
4. role
5. status

For each ingested source note, record the exact `raw_path:` in the note frontmatter.

## Related Files

- [[../99_System/Guides/LLM-WIKI-MAINTENANCE|LLM Wiki Maintenance Guide]]
- [[../99_System/Templates/Source-Ingest-Template|Source Ingest Template]]
- [[../99_System/LOG|System Log]]
