---
title: Writing Standards
date: 2025-01-04
tags: [style, standards, system]
---

# Writing Standards

This document defines the writing format and standards for notes, ensuring consistent note style.

> **Language Preference**: English as primary language, Chinese annotations for key points (英语为主，关键地方用括号中文注释)

## File Naming Standards

- Use meaningful file names
- Recommended format: `YYYY-MM-DD-Title.md` or `Title-Name.md` (English)
- Example: `2025-01-04-Project-Kickoff-Meeting.md`
- Avoid special characters, use hyphens `-` or underscores `_` for separation

## Markdown Format Standards

### Heading Levels
```markdown
# Level 1 Heading (Document Title - 文档标题)
## Level 2 Heading (Main Sections - 主要章节)
### Level 3 Heading (Subsections - 小节)
#### Level 4 Heading (Sub-subsections - 子小节)
```

### Date Format
- Standard format: `YYYY-MM-DD`
- Example: `2025-01-04`
- Annotate date in document header or metadata area

### Tags (Tags) - Obsidian Format
- **Format**: `#tagname` or `#tag/subtag` (nested tags - 嵌套标签)
- **Location**: End of document or in YAML front matter
- **Examples**:
  - `#project #meeting #important`
  - `#project-projectname` `#area-areaname`
  - `#PKM/Zettelkasten` (nested tag)
- **YAML Format**: `tags: [project, meeting, important]`

### Metadata Area (YAML Front Matter) - Obsidian Compatible
Use YAML Front Matter at the beginning of the document (Obsidian recommended):
```yaml
---
title: Note Title
date: 2025-01-04
tags: [project, meeting, important]
---
```

**Note**: YAML front matter is automatically recognized and processed in Obsidian.

**Important**: To avoid "Assertion Failed" errors in preview mode, ensure (重要：为避免预览模式中的 "Assertion Failed" 错误，请确保):
- YAML front matter starts and ends with `---` on separate lines (YAML front matter 在单独的行上以 `---` 开始和结束)
- Empty line after closing `---` (结束 `---` 后有空行)
- No tabs, use spaces only (不使用制表符，仅使用空格)
- Quote values with special characters (为包含特殊字符的值加引号)
- See [[99_System/Guides/MARKDOWN_WRITING_BEST_PRACTICES|Markdown Writing Best Practices]] for details (详见 Markdown 写作最佳实践)

## Writing Style

### Primary Language
- **Primary Writing Language**: English (主要写作语言：英语)
- **Annotation Language**: Chinese (注释语言：中文)
- **Technical Terms**: Key technical terms should be annotated with English in parentheses on first occurrence
- **Examples**:
  - Use Git repository (Git仓库) for version control
  - Write notes in Markdown format (Markdown格式)
  - Edit in Cursor editor (Cursor编辑器)

### Paragraph Structure
- Use blank lines to separate paragraphs
- Use lists (ordered or unordered) for important information
- Use code blocks for code examples

### Code Blocks
```markdown
```bash
git pull
git push
```
```

### Quotes
Use `>` for quotes:
```markdown
> This is a quoted content
```

### Emphasis
- **Bold**: For emphasizing important content
- *Italic*: For secondary emphasis
- `Code`: For commands, variables, file names, etc.

## Obsidian Special Syntax

### Wiki Links (Double Brackets) - Must Use
- **Format**: `[[Note Name]]` or `[[Note Name|Display Text]]`
- **Purpose**: Create bidirectional links between notes (创建笔记间的双向链接)
- **Examples**:
  - `[[Workflow]]` - Link to "Workflow.md"
  - `[[Workflow|View Workflow]]` - Display as "View Workflow"
- **Note**: Do not use standard Markdown links `[text](path.md)`, use Obsidian wiki links

### Block References (块引用)
- **Format**: `[[Note Name#Heading]]` or `[[Note Name#^blockID]]`
- **Purpose**: Reference specific paragraphs or blocks
- **Example**: `[[Workflow#Capture]]` - Reference the "Capture" section in "Workflow.md"

### Embeds (嵌入)
- **Format**: `![[Note Name]]` or `![[Image Name.png]]`
- **Purpose**: Embed other notes or images
- **Examples**:
  - `![[Workflow]]` - Embed entire note
  - `![[Image.png]]` - Embed image (images stored in `90_Attachments/` directory)

### Image Paths
- Use relative paths
- Store images in `90_Attachments/` directory
- Format: `![[Image Name.png]]` or `![[90_Attachments/Image Name.png]]`

## Technical Term Annotation Rules

The following technical terms should be annotated with English in parentheses on first occurrence:

- Git related: Git, Repository (仓库), Commit (提交), Push (推送), Pull (拉取), Branch (分支), Merge (合并)
- Markdown related: Markdown, Front Matter (前置元数据), Code Block (代码块), Wiki Link (双链)
- Obsidian related: Obsidian, Wiki Link (双链), Block Reference (块引用), Embed (嵌入)
- Tools related: Cursor, Editor (编辑器), Terminal (终端), Command Line (命令行)
- File system related: Directory (目录), File (文件), Path (路径)

## Example Note Templates

### Template with YAML Front Matter
```markdown
---
title: Note Title
date: 2025-01-04
tags: [project, meeting, important]
---

# Note Title

## Content

Main note content...

Reference related notes: [[Workflow]] and [[Quick Reference]]

### Key Points

- Point 1
- Point 2

### Code Example

```bash
# Command example
git status
```

## Summary

Summary content...

---
Tags: #project #meeting #important
```

### Simplified Template (without YAML)
```markdown
# Note Title

**Date**: 2025-01-04
**Category**: Project/Topic

## Content

Main note content...

Reference: [[Workflow]]

### Key Points

- Point 1
- Point 2

## Summary

Summary content...

---
Tags: #tag1 #tag2
```

## Important Notes

1. Keep content concise and clear, avoid verbosity
2. Use meaningful titles and subheadings
3. Use lists or tables for important information
4. Code examples should be complete and executable
5. Technical term annotations should be consistent
6. **Use English as primary language with Chinese annotations** (英语为主，中文注释)

---

**Last Updated**: 2025-01-04
