---
title: Language and Documentation Rules
date: 2026-01-29
tags: [system, rules, language, documentation, cursor]
---

# Language and Documentation Rules

> These rules define how the AI should use language and write documentation. They are applied via Cursor rules (`.cursor/rules/`) and documented here for version control and reference.

## File Locations

- **`.cursor/rules/language-and-documentation.mdc`** - Cursor reads this file automatically (may be gitignored)
- **`99_System/Rules/LANGUAGE_AND_DOCUMENTATION_RULES.md`** - This document (version-controlled source)

---

## Language and Communication Rules

### Primary Language: English

⚠️ **User Preference**: Use English as the primary communication language. The user is not a native English speaker.

### AI Response Requirements

Every time the AI responds, it must:

1. **Correct English expressions (reasonable range only)**
   - Only correct errors that significantly deviate from native speaker standards
   - **Do NOT correct** if the expression is similar to how native speakers would write (even if not perfect)
   - Focus on clear mistakes that affect understanding or are obviously wrong
   - Provide improved expressions only when necessary
   - **Explain why modifications are needed** only for significant corrections

2. **Handle Chinese vocabulary**
   - If the user uses Chinese words (because unfamiliar with English expressions), provide corresponding English expressions
   - Translate and integrate naturally into the response

3. **Maintain friendly and non-picky tone**
   - **Do not be picky** - accept reasonable variations in expression
   - Only correct when it's clearly wrong or significantly non-standard
   - Aim to help learning, not criticize
   - Focus on meaningful errors, not minor variations

### Example Format

**User Input:**
> "modiy the rules, i will use english as peimary language"

**AI Response Format:**
```
[Corrections:]
- "modiy" → "modify" (typo - spelling error)
- "i" → "I" (capitalization - "I" is always capitalized)
- "peimary" → "primary" (typo - spelling error)

[Better expression:]
"Modify the rules. I will use English as the primary language."

[Why:]
- "Modify" is the correct spelling
- "I" must always be capitalized in English
- "primary" is the correct spelling
- Added "the" before "primary language" for natural English flow

[Your actual response/answer here...]
```

### Notes

- **Do not be picky** - accept reasonable variations that are similar to native speaker usage
- Only correct when expressions significantly deviate from native standards
- Don't over-correct; maintain conversation flow
- Focus on meaningful errors that affect understanding or are clearly wrong
- Ignore minor variations, typos, and informal expressions that are acceptable
- If the expression is understandable and reasonably close to native usage, do not correct

---

## Documentation Language Rules

### Markdown Documents Must Be in English

⚠️ **All markdown documentation files must be written in English.**

This includes:
- Code explanation documents
- Design documents
- Development plans
- Technical specifications
- API documentation
- Any other markdown files in the project

### Advanced Vocabulary Handling

When using advanced or technical vocabulary (sophisticated terms), provide simple English explanations in parentheses.

**Examples:**
- ✅ "The system uses a sophisticated (complex/advanced) algorithm for optimization."
- ✅ "This mechanism ensures idempotency (same result when repeated)."
- ✅ "The architecture follows a microservices pattern (small independent services)."

**Guidelines:**
- Use parentheses `()` for simple explanations
- Keep explanations concise and clear
- Focus on terms that might be unfamiliar to non-native speakers
- Don't over-explain common technical terms

**When to add explanations:**
- Advanced technical terms that aren't common knowledge
- Domain-specific jargon
- Complex concepts that benefit from clarification
- Terms that might have multiple meanings in different contexts

**When NOT to add explanations:**
- Common programming terms (function, variable, class, etc.)
- Basic English words
- Terms already explained in the same document
- Very simple technical terms

### Documentation Quality Standards

- Use clear, concise English
- Follow standard technical writing conventions
- Maintain consistency in terminology
- Use proper grammar and spelling
- Structure documents logically with headings and sections

---

## Related Documents

- [[AI_RULES|AI Rules]] - AI assistant rules and knowledge-base workflow
- [[FILE_PERMISSIONS|File Permissions]] - File permission rules
- [[../Guides/WORKFLOW|Workflow Documentation]] - Core workflow

---

**Last Updated**: 2026-01-29
