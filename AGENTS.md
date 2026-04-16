# AGENTS.md

This repository is a public-safe starter for an agent-maintained Markdown second brain.

Read these files before making changes:

- `README.md`
- `PRIVACY.md`
- `99_System/Agent-Kernel.md`
- `99_System/Guides/WORKFLOW.md`
- `99_System/Guides/QUICK_REFERENCE.md`

## Operating Rules

- Treat this repo as a framework layer, not as a personal instance.
- Do not add or preserve private identity, relationship, immigration, finance, or contact-network data in the public starter.
- Keep raw sources outside the wiki by default and register them through `90_Attachments/SOURCE-INDEX.md`.
- Maintain the wiki through ingest / query / lint loops rather than one-off chat outputs.
- Use `Work`, `Learning`, and `Operations` as the default starter areas unless the user asks to reshape them.
- Keep technical file names and interface names in English, even if note content is written in Chinese.

## Editing Priorities

1. Preserve the public-safe structure.
2. Keep the starter immediately usable after clone.
3. Prefer Markdown-first workflows over dashboard-first workflows.
4. Keep `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*`, and `99_System/Agent-Kernel.md` aligned.

## Do Not Do These By Default

- Do not commit secrets, OAuth tokens, or `.env` values.
- Do not reintroduce personal profile, immigration, or contact registry examples.
- Do not make the dashboard a required dependency for first-run onboarding.
