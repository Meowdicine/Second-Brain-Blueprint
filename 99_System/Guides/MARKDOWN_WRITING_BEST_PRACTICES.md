---
title: Markdown Writing Best Practices - Avoid Preview Errors
date: 2025-01-09
tags: [system, guides, markdown, best-practices, troubleshooting]
---

# Markdown Writing Best Practices - Avoid Preview Errors (Markdown 写作最佳实践 - 避免预览错误)

Best practices for writing Markdown files to avoid "Assertion Failed" errors when opening in preview mode (编写 Markdown 文件的最佳实践，以避免在预览模式下打开时出现 "Assertion Failed" 错误).

## Common Causes of "Assertion Failed" Error (Assertion Failed 错误的常见原因)

1. **YAML front matter syntax errors** (YAML front matter 语法错误)
2. **Special characters in values** (值中的特殊字符)
3. **File encoding issues** (文件编码问题)
4. **Incorrect indentation** (缩进错误)
5. **Missing closing delimiters** (缺少结束分隔符)

## YAML Front Matter Best Practices (YAML Front Matter 最佳实践)

### ✅ Correct Format (正确格式)

```yaml
---
title: Note Title
date: 2025-01-09
tags: [tag1, tag2]
---

# Note Title
```

**Key Points** (关键点):
- Start with `---` on first line (第一行以 `---` 开始)
- End with `---` on separate line (单独一行以 `---` 结束)
- Empty line after closing `---` (结束 `---` 后空一行)
- Use proper indentation (使用正确的缩进)
- No tabs, use spaces only (不使用制表符，仅使用空格)

### ❌ Common Mistakes to Avoid (要避免的常见错误)

#### 1. Missing Closing `---` (缺少结束的 `---`)

```yaml
---
title: Note Title
date: 2025-01-09
# Missing closing ---
```

**Fix**: Always include closing `---` (修复：始终包含结束的 `---`)

#### 2. Special Characters Without Quotes (特殊字符未加引号)

```yaml
---
title: Note: Important!  # ❌ Colon and exclamation mark
tags: [tag1, tag2:subtag]  # ❌ Colon in tag
---
```

**Fix**: Use quotes for values with special characters (修复：对包含特殊字符的值使用引号)

```yaml
---
title: "Note: Important!"  # ✅
tags: ["tag1", "tag2:subtag"]  # ✅
---
```

#### 3. Incorrect Indentation (缩进错误)

```yaml
---
title: Note Title
  date: 2025-01-09  # ❌ Extra indentation
tags: [tag1, tag2]
---
```

**Fix**: Use consistent indentation (no indentation for top-level keys) (修复：使用一致的缩进，顶级键不缩进)

```yaml
---
title: Note Title
date: 2025-01-09  # ✅ No indentation
tags: [tag1, tag2]
---
```

#### 4. Tabs Instead of Spaces (使用制表符而非空格)

```yaml
---
title:	Note Title  # ❌ Tab character
---
```

**Fix**: Use spaces only (修复：仅使用空格)

```yaml
---
title: Note Title  # ✅ Spaces
---
```

#### 5. Missing Empty Line After Front Matter (Front Matter 后缺少空行)

```yaml
---
title: Note Title
---
# Note Title  # ❌ No empty line
```

**Fix**: Add empty line after closing `---` (修复：在结束 `---` 后添加空行)

```yaml
---
title: Note Title
---

# Note Title  # ✅ Empty line
```

## Safe YAML Front Matter Template (安全的 YAML Front Matter 模板)

### Template 1: Simple (模板1：简单)

```yaml
---
title: Note Title
date: 2025-01-09
tags: [tag1, tag2]
---

# Note Title
```

### Template 2: With Description (模板2：带描述)

```yaml
---
title: Note Title
date: 2025-01-09
description: "Note description with special: characters"
tags: [tag1, tag2]
---

# Note Title
```

### Template 3: Complex Tags (模板3：复杂标签)

```yaml
---
title: Note Title
date: 2025-01-09
tags: 
  - tag1
  - "tag2:subtag"
  - "tag with spaces"
---

# Note Title
```

## File Naming Best Practices (文件命名最佳实践)

### ✅ Recommended (推荐)

- `2025-01-09-Note-Title.md`
- `Note-Title.md`
- `Project-Name.md`

### ❌ Avoid (避免)

- `Note Title.md` (spaces - use hyphens) (空格 - 使用连字符)
- `Note:Title.md` (colons) (冒号)
- `Note/Title.md` (slashes) (斜杠)
- `Note<Title>.md` (special characters) (特殊字符)

## Content Writing Best Practices (内容写作最佳实践)

### 1. Code Blocks (代码块)

**Always specify language** (始终指定语言):

```markdown
```python
# Code here
```
```

**Avoid unclosed code blocks** (避免未闭合的代码块):

```markdown
```python
# Missing closing ```
```

### 2. Links (链接)

**Use Obsidian wiki links** (使用 Obsidian wiki 链接):

```markdown
[[Note Name]]  # ✅
[Note Name](Note-Name.md)  # ❌ Standard Markdown (may cause issues)
```

### 3. Special Characters (特殊字符)

**Escape special characters when needed** (需要时转义特殊字符):

```markdown
\*Not italic\*  # Escape asterisks if not intended as formatting
```

### 4. Tables (表格)

**Ensure proper alignment** (确保正确对齐):

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## File Encoding (文件编码)

**Always use UTF-8 encoding** (始终使用 UTF-8 编码):
- Cursor/VSCode default encoding is UTF-8 (Cursor/VSCode 默认编码是 UTF-8)
- Avoid other encodings (避免其他编码)
- Check encoding if files have issues (如果文件有问题，检查编码)

## Validation Checklist (验证清单)

Before saving a Markdown file, check (保存 Markdown 文件前，检查):

- [ ] YAML front matter starts with `---` (YAML front matter 以 `---` 开始)
- [ ] YAML front matter ends with `---` (YAML front matter 以 `---` 结束)
- [ ] Empty line after closing `---` (结束 `---` 后有空行)
- [ ] No tabs in YAML (YAML 中无制表符)
- [ ] Special characters in values are quoted (值中的特殊字符已加引号)
- [ ] No extra indentation in YAML (YAML 中无额外缩进)
- [ ] File name uses hyphens, not spaces (文件名使用连字符，而非空格)
- [ ] All code blocks are closed (所有代码块已闭合)
- [ ] File encoding is UTF-8 (文件编码为 UTF-8)

## Quick Fix for Existing Files (现有文件的快速修复)

If a file shows "Assertion Failed" error (如果文件显示 "Assertion Failed" 错误):

1. **Open file in Text Editor mode** (以文本编辑器模式打开文件):
   - Right-click tab → "Reopen With..." → "Text Editor"

2. **Check YAML front matter** (检查 YAML front matter):
   - Ensure proper `---` delimiters (确保正确的 `---` 分隔符)
   - Check for syntax errors (检查语法错误)
   - Verify indentation (验证缩进)

3. **Fix common issues** (修复常见问题):
   - Add missing closing `---` (添加缺少的结束 `---`)
   - Quote values with special characters (为包含特殊字符的值加引号)
   - Fix indentation (修复缩进)

4. **Save and test** (保存并测试):
   - Save the file (保存文件)
   - Try opening in preview mode again (再次尝试以预览模式打开)

## Alternative: Use Extension Preview (替代方案：使用扩展预览)

If built-in preview continues to have issues (如果内置预览持续出现问题):

1. **Disable direct preview** (禁用直接预览):
   ```json
   // Comment out in settings.json
   // "workbench.editorAssociations": {
   //   "*.md": "vscode.markdown.preview.editor"
   // }
   ```

2. **Use extension auto-preview** (使用扩展自动预览):
   - Markdown Preview Enhanced: `markdown-preview-enhanced.openPreviewPaneAutomatically: true`
   - Files open as source, preview opens automatically (文件以源代码打开，预览自动打开)

## Related Notes

- [[STYLE|Writing Standards]] - Complete writing style guide (完整写作风格指南)
- [[MARKDOWN_PREVIEW_SETUP|Markdown Preview Setup Guide]] - Preview configuration (预览配置)

---

**Last Updated**: 2025-01-09

Tags: #system #guides #markdown #best-practices #troubleshooting #yaml #front-matter

