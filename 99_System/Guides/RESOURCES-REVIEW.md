---
title: Resources Auto-Review Mechanism
date: 2026-02-01
tags: [system, guides, PARA, resources]
---

# Resources Auto-Review Mechanism (资源自动淘汰机制)

Resources should not accumulate indefinitely. Regular review keeps the knowledge base lean.

资源不应无限堆积。定期审查保持知识库精简。

## Schedule

- **Frequency**: Monthly or quarterly (choose one and stick to it)
- **Trigger**: e.g., first Sunday of each month

## Review Checklist

For each item in `30_Resources/`:

1. **Used in last 3 months?** If no → consider archive or delete
2. **Clear future use?** If no → delete or move to Archive
3. **Still accurate?** If outdated → update or remove

## Cursor Prompt for Review

Use this prompt with Cursor (with your knowledge base indexed):

```
Review my 30_Resources folder. For each item:
1. Suggest archive if unused for 3+ months and no clear future use
2. Suggest delete if redundant or obsolete
3. Give a brief reason for each suggestion
```

## Optional: Track Last Reviewed

Add `last-reviewed: YYYY-MM-DD` to frontmatter for items you want to track:

```yaml
---
title: Example Resource
last-reviewed: 2026-02-01
---
```

## Related Documents

- [[PARA-RULES|PARA Rules]] – Resources definition
- [[WHAT-TO-STORE|What's Worth Storing?]] – What belongs in Resources

---

**Last Updated**: 2026-02-01
