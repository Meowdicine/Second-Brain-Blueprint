---
title: Markdown Preview Setup Guide
date: 2025-01-09
tags: [system, guides, cursor, markdown, preview]
---

# Markdown Preview Setup Guide (Markdown 预览设置指南)

Guide for configuring Cursor/VSCode to automatically preview Markdown files. (配置 Cursor/VSCode 自动预览 Markdown 文件的指南)

## Problem (问题)

By default, clicking a Markdown file in Cursor shows the source code, not the rendered preview. (默认情况下，点击 Markdown 文件显示源代码，而不是渲染后的预览)

**User Requirement**: Open Markdown files in preview mode directly, without showing source code. (用户需求：直接以预览模式打开 Markdown 文件，不显示源代码)

## Solution Options (解决方案选项)

### ✅ Option 0: Default Preview Mode (默认预览模式) - **CURRENTLY CONFIGURED (已配置)**

**Open Markdown files in preview view only (no source code)** (仅以预览视图打开 Markdown 文件，不显示源代码)

This configuration is **already set** in `.vscode/settings.json`: (此配置已在 `.vscode/settings.json` 中设置)

```json
{
  "workbench.editorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  }
}
```

**How it works** (工作原理):
- Clicking any `.md` file will open it in preview mode directly (点击任何 `.md` 文件将直接以预览模式打开)
- **No source code visible** - only the rendered preview (不显示源代码 - 仅显示渲染后的预览)
- Full preview view, not side-by-side (完整预览视图，不是并排显示)

**To edit the file** (需要编辑文件时):
- Right-click in the preview and select "Reopen Editor With..." → "Text Editor" (在预览中右键点击，选择 "Reopen Editor With..." → "Text Editor")
- Or use Command Palette: `Ctrl + Shift + P` → "Reopen Editor With..." → "Text Editor" (或使用命令面板)

**Note**: This feature requires VSCode/Cursor version 1.64+ (注意：此功能需要 VSCode/Cursor 版本 1.64+)

If this doesn't work, try the alternatives below. (如果此方法不工作，请尝试下面的替代方案)

### Option 1: Use Built-in Preview (使用内置预览)

**Method A: Manual Preview (手动预览)**

1. **Open Markdown file** (打开 Markdown 文件)
2. **Press keyboard shortcut** (按快捷键):
   - **Windows/Linux**: `Ctrl + Shift + V` (Open Preview / 打开预览)
   - **macOS**: `Cmd + Shift + V`
3. **Or use Command Palette** (或使用命令面板):
   - `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac)
   - Type: "Markdown: Open Preview" (输入：Markdown: Open Preview)
   - Press Enter

**Method B: Side-by-Side Preview (并排预览)**

1. **Open Markdown file** (打开 Markdown 文件)
2. **Press keyboard shortcut** (按快捷键):
   - **Windows/Linux**: `Ctrl + K V` (Open Preview to the Side / 在侧边打开预览)
   - **macOS**: `Cmd + K V`
   - Note: Press `Ctrl + K` first, release, then press `V` (注意：先按 `Ctrl + K`，松开，然后按 `V`)

### Option 2: Install Extension - Markdown Preview Enhanced (安装扩展)

**Best solution for auto-preview** (自动预览的最佳解决方案)

1. **Install Extension** (安装扩展):
   - Open Extensions panel: `Ctrl + Shift + X` (or `Cmd + Shift + X` on Mac)
   - Search: "Markdown Preview Enhanced"
   - Install by Yiyi Wang

2. **Features** (功能):
   - **Auto-preview** when opening Markdown files (打开 Markdown 文件时自动预览)
   - **Live preview** with side-by-side editing (实时预览，并排编辑)
   - **Export** to PDF, HTML, etc. (导出为 PDF、HTML 等)
   - **Math support** (数学公式支持)
   - **Diagrams** (图表支持)

3. **Usage** (使用方法):
   - Open a `.md` file (打开 `.md` 文件)
   - Right-click and select "Markdown Preview Enhanced: Open Preview to the Side" (右键点击选择 "Markdown Preview Enhanced: Open Preview to the Side")
   - Or use keyboard shortcut (或使用快捷键)

4. **Configure Auto-Preview** (配置自动预览):
   - Open Settings: `Ctrl + ,` (or `Cmd + ,` on Mac)
   - Search: "Markdown Preview Enhanced"
   - Enable: "Open Preview Automatically" (启用：自动打开预览)

### Option 3: Install Extension - Markdown All in One (安装扩展)

**Alternative solution** (替代方案)

1. **Install Extension** (安装扩展):
   - Open Extensions panel: `Ctrl + Shift + X`
   - Search: "Markdown All in One"
   - Install by Yu Zhang

2. **Features** (功能):
   - Auto preview to the side (自动在侧边预览)
   - Table of contents generation (目录生成)
   - Keyboard shortcuts (键盘快捷键)
   - Formatting support (格式化支持)

3. **Configure Auto-Preview** (配置自动预览):
   - Settings → Search: "markdown.extension.preview.autoShowPreviewToSide"
   - Enable this option (启用此选项)

### Option 4: Configure Keyboard Shortcut (配置键盘快捷键)

**Customize shortcuts for quick preview** (自定义快捷键快速预览)

1. **Open Keyboard Shortcuts** (打开键盘快捷键):
   - `Ctrl + K Ctrl + S` (or `Cmd + K Cmd + S` on Mac)
   - Or: File → Preferences → Keyboard Shortcuts

2. **Add Custom Shortcut** (添加自定义快捷键):
   - Search: "markdown showPreview"
   - Click on "Markdown: Open Preview to the Side"
   - Click the "+" icon to add a keybinding
   - Assign: `Ctrl + M` (or your preferred key)

3. **Or edit keybindings.json directly** (或直接编辑 keybindings.json):
   ```json
   {
     "key": "ctrl+m",
     "command": "markdown.showPreviewToSide",
     "when": "editorTextFocus && !notebookEditorFocus && editorLangId == 'markdown'"
   }
   ```

## Recommended Setup (推荐设置)

### Quick Setup (快速设置)

1. **Install "Markdown Preview Enhanced"** extension (安装 "Markdown Preview Enhanced" 扩展)
2. **Configure auto-preview** in extension settings (在扩展设置中配置自动预览)
3. **Use `Ctrl + K V`** for side-by-side preview (使用 `Ctrl + K V` 进行并排预览)

### Advanced Setup (高级设置)

1. Install "Markdown Preview Enhanced" extension (安装扩展)
2. Configure `.vscode/settings.json` (see existing file) (配置 `.vscode/settings.json`，见现有文件)
3. Add custom keyboard shortcut (添加自定义键盘快捷键)
4. Enable auto-preview in extension settings (在扩展设置中启用自动预览)

## Keyboard Shortcuts Reference (键盘快捷键参考)

| Action (操作) | Windows/Linux | macOS |
|--------------|---------------|-------|
| Open Preview (打开预览) | `Ctrl + Shift + V` | `Cmd + Shift + V` |
| Open Preview to Side (侧边预览) | `Ctrl + K V` | `Cmd + K V` |
| Toggle Preview (切换预览) | `Ctrl + Shift + V` | `Cmd + Shift + V` |
| Open Extensions (打开扩展) | `Ctrl + Shift + X` | `Cmd + Shift + X` |
| Open Settings (打开设置) | `Ctrl + ,` | `Cmd + ,` |
| Command Palette (命令面板) | `Ctrl + Shift + P` | `Cmd + Shift + P` |

## Troubleshooting (故障排除)

### Preview Not Opening Automatically (预览未自动打开)

1. **Check extension installation** (检查扩展安装):
   - Make sure extension is installed and enabled (确保扩展已安装并启用)
   - Reload Cursor/VSCode (重新加载 Cursor/VSCode)

2. **Check settings** (检查设置):
   - Open Settings: `Ctrl + ,`
   - Search for extension settings
   - Verify auto-preview is enabled (验证自动预览已启用)

3. **Check file association** (检查文件关联):
   - Ensure `.md` files are associated with Markdown editor (确保 `.md` 文件与 Markdown 编辑器关联)

### "Open Failed" Error When Clicking Markdown Files (点击 Markdown 文件时显示"打开失败")

**Problem**: Newly generated Markdown files with YAML front matter show "Open Failed" error (新生成的带 YAML front matter 的 Markdown 文件显示"打开失败"错误).

**Possible Causes** (可能原因):
1. YAML front matter syntax error (YAML front matter 语法错误)
2. Cursor/VSCode version compatibility issue (Cursor/VSCode 版本兼容性问题)
3. Preview editor cannot parse YAML front matter (预览编辑器无法解析 YAML front matter)

**Solutions** (解决方案):

#### Solution 1: Reload Window (重新加载窗口)
1. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac)
2. Type: "Developer: Reload Window"
3. Press Enter
4. Try opening the Markdown file again

#### Solution 2: Check YAML Front Matter Syntax (检查 YAML front matter 语法)
Ensure YAML front matter is properly formatted:
```yaml
---
title: Note Title
date: 2025-01-09
tags: [tag1, tag2]
---
```

**Common Issues** (常见问题):
- Missing closing `---` (缺少结束的 `---`)
- Incorrect indentation (缩进错误)
- Special characters in values without quotes (值中有特殊字符但未加引号)

#### Solution 3: Use Alternative Preview Method (使用替代预览方法)
If preview editor fails, use side-by-side preview instead:

1. **Change settings** (更改设置):
   - Open `.vscode/settings.json`
   - Comment out or remove the preview editor association:
   ```json
   // "workbench.editorAssociations": {
   //   "*.md": "vscode.markdown.preview.editor"
   // }
   ```

2. **Use side-by-side preview** (使用并排预览):
   - Open Markdown file (it will show source code)
   - Press `Ctrl + K V` (or `Cmd + K V` on Mac) to open preview to the side
   - Or install "Markdown Preview Enhanced" extension for auto-preview

#### Solution 4: Update Cursor/VSCode (更新 Cursor/VSCode)
- Ensure you're using Cursor/VSCode version 1.64+ (确保使用 Cursor/VSCode 版本 1.64+)
- Update to the latest version if possible (如果可能，更新到最新版本)

#### Solution 5: Use Text Editor First, Then Preview (先使用文本编辑器，再预览)
1. Right-click on the Markdown file
2. Select "Open With..." → "Text Editor"
3. Then press `Ctrl + Shift + V` to open preview
4. Or press `Ctrl + K V` for side-by-side preview

### Preview Not Rendering Correctly (预览渲染不正确)

1. **Check Markdown syntax** (检查 Markdown 语法):
   - Ensure valid Markdown syntax (确保有效的 Markdown 语法)
   - Check for special characters (检查特殊字符)

2. **Try different preview** (尝试不同的预览):
   - Use built-in preview: `Ctrl + Shift + V` (使用内置预览)
   - Try extension preview (尝试扩展预览)

3. **Clear cache** (清除缓存):
   - Reload window: `Ctrl + Shift + P` → "Developer: Reload Window" (重新加载窗口)

## Additional Resources (其他资源)

- [Cursor Documentation](https://cursor.sh/docs) (Cursor 文档)
- [VSCode Markdown Guide](https://code.visualstudio.com/docs/languages/markdown) (VSCode Markdown 指南)
- [Markdown Preview Enhanced](https://shd101wyy.github.io/markdown-preview-enhanced/) (Markdown Preview Enhanced 官网)
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) (Markdown All in One 扩展)

## Notes (注意事项)

- **`.vscode/settings.json`** is already configured in this workspace (工作区已配置 `.vscode/settings.json`)
- Settings are workspace-specific (设置是工作区特定的)
- Extensions need to be installed manually (扩展需要手动安装)
- Keyboard shortcuts can be customized (键盘快捷键可以自定义)

---

**Last Updated**: 2025-01-09

