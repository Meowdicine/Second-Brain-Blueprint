---
title: Markdown Preview - Restore Default Behavior
date: 2025-01-09
tags: [system, cursor, markdown, preview, restore]
---

# Markdown Preview - Restore Default Behavior (Markdown 预览 - 恢复默认行为)

Configuration changes to restore default Markdown preview behavior (恢复默认 Markdown 预览行为的配置更改).

## Problem (问题)

1. **"Assertion Failed" errors** when opening Markdown files in preview mode (以预览模式打开 Markdown 文件时出现 "Assertion Failed" 错误)
2. **Right-click menu preview option missing** (右键菜单预览选项丢失)
3. **Files were previously opening correctly** (文件之前可以正常打开)

## Solution: Restore Default Behavior (解决方案：恢复默认行为)

### Changes Made (已做出的更改)

1. **Disabled Editor Associations** (禁用编辑器关联): Comment out `workbench.editorAssociations` for `*.md` — files now open in **source code mode by default**.
2. **Disabled Auto-Preview** (禁用自动预览): Comment out `markdown-preview-enhanced.openPreviewPaneAutomatically` and `markdown.extension.preview.autoShowPreviewToSide` — restored manual preview via right-click and shortcuts.

### Methods to Open Preview (打开预览的方法)

- **Right-click** on file → "Open Preview" or "Markdown: Open Preview"
- **Shortcuts**: `Ctrl+Shift+V` (preview), `Ctrl+K V` (preview to side)
- **Command Palette**: "Markdown: Open Preview" or "Open Preview to the Side"

### If Menu Option is Missing

- **Reload Window**: `Ctrl+Shift+P` → "Developer: Reload Window"
- **Check extensions**: Markdown Preview Enhanced / Markdown All in One installed and enabled

## Related Notes

- [[MARKDOWN_PREVIEW_SETUP|Markdown Preview Setup Guide]] - Complete setup guide (完整设置指南)
- [[MARKDOWN_WRITING_BEST_PRACTICES|Markdown Writing Best Practices]] - Best practices to avoid errors (避免错误的最佳实践)

---

Tags: #system #cursor #markdown #preview #restore #default-behavior
