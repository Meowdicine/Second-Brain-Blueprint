# Obsidian语法参考指南

> 本知识库同时使用Cursor和Obsidian/Copilot打开，所有Markdown文档必须遵循Obsidian兼容语法。

## 为什么需要Obsidian语法？

1. **双链功能**：Obsidian的双链 `[[笔记名称]]` 可以创建笔记间的双向链接
2. **图谱视图**：双链可以在Obsidian中生成知识图谱
3. **块引用**：可以精确引用特定段落
4. **Copilot兼容**：Obsidian Copilot需要标准Obsidian语法才能正常工作

## 核心语法

### 1. 双链（Wiki Links）- 必须使用

**格式**：
```markdown
[[笔记名称]]
[[笔记名称|显示文本]]
```

**示例**：
```markdown
参考 [[工作流程]] 了解更多。
查看 [[工作流程|详细流程说明]]。
```

**注意**：
- ✅ 使用双链：`[[笔记名称]]`
- ❌ 不使用标准Markdown链接：`[文本](路径.md)`

### 2. 标签（Tags）

**格式**：
```markdown
#标签名
#标签/子标签  # 嵌套标签
```

**示例**：
```markdown
#project-项目名
#area-领域名
#PKM/Zettelkasten
```

**在YAML中**：
```yaml
---
tags: [项目, 会议, 重要]
---
```

### 3. 块引用（Block References）

**格式**：
```markdown
[[笔记名称#标题]]
[[笔记名称#^块ID]]
```

**示例**：
```markdown
参考 [[工作流程#Capture]] 部分。
引用 [[工作流程#^核心原则]] 块。
```

### 4. 嵌入（Embeds）

**格式**：
```markdown
![[笔记名称]]
![[图片名称.png]]
```

**示例**：
```markdown
![[工作流程]]  # 嵌入整个笔记
![[图片.png]]  # 嵌入图片
```

### 5. YAML Front Matter

**格式**：
```yaml
---
title: 笔记标题
date: 2025-01-04
tags: [项目, 会议, 重要]
---
```

**必须字段**：
- `title` - 笔记标题
- `date` - 日期（YYYY-MM-DD格式）
- `tags` - 标签列表

## 图片处理

### 图片路径规则

1. **存放位置**：`90_Attachments/` 目录
2. **使用相对路径**
3. **格式**：`![[图片名称.png]]` 或 `![[90_Attachments/图片名称.png]]`

### 示例

```markdown
![[架构图.png]]
![[90_Attachments/流程图.png]]
```

## 完整示例

### 示例1：带YAML的完整笔记

```markdown
---
title: 项目启动会议
date: 2025-01-04
tags: [项目, 会议, 重要]
---

# 项目启动会议

## 会议内容

参考 [[工作流程]] 中的项目启动流程。

### 要点

- 要点1：参考 [[快速参考#日常操作]]
- 要点2：查看 [[工作流程#Express]]

### 相关资源

- [[AI规则文档]]
- [[优化方案]]

## 总结

本次会议确定了项目方向，详见 [[项目计划]]。

---
标签：#项目 #会议 #重要
```

### 示例2：使用块引用

```markdown
根据 [[工作流程#Capture]] 的要求，我们应该：

1. 快速记录到 `00_Inbox/`
2. 不要纠结分类

参考核心原则：[[工作流程#^核心原则]]
```

## 常见错误

### ❌ 错误示例

```markdown
# 使用标准Markdown链接（错误）
参考 [工作流程](工作流程.md)

# 使用绝对路径（错误）
![图片](E:/path/to/image.png)
```

### ✅ 正确示例

```markdown
# 使用Obsidian双链（正确）
参考 [[工作流程]]

# 使用相对路径（正确）
![[图片.png]]
```

## Obsidian Copilot兼容性

确保所有语法符合Obsidian标准，Copilot才能正常工作：

1. ✅ 使用双链 `[[笔记名称]]`
2. ✅ 使用Obsidian标签格式 `#标签名`
3. ✅ 使用相对路径引用图片
4. ✅ YAML front matter格式正确
5. ❌ 避免使用Obsidian不支持的扩展语法

## 检查清单

在创建或修改笔记时，检查：

- [ ] 所有链接都使用双链 `[[笔记名称]]`
- [ ] 标签使用 `#标签名` 格式
- [ ] 图片使用相对路径，放在 `90_Attachments/`
- [ ] YAML front matter包含 title, date, tags
- [ ] 没有使用标准Markdown链接 `[文本](路径.md)`
- [ ] 语法在Obsidian中能正常显示

## 参考

- [Obsidian官方文档](https://help.obsidian.md/)
- `STYLE.md` - 写作规范
- `99_System/AI_RULES.md` - AI规则文档

---

**最后更新**：2025-01-04

