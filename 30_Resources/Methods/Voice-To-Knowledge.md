---
title: Voice to Knowledge Capture
date: 2026-02-28
tags: [method, voice, capture, workflow, transcription]
trigger: "voice input", "voice recording to notes", "capture thoughts while walking", "record ideas on the go", "fragmented time capture"
---

# Voice to Knowledge Capture (语音录入知识捕获)

## When to Use (何时使用)

When you want to capture thoughts, reflections, or experience reviews during fragmented time - showering, commuting, eating, walking - and turn them into structured knowledge base entries.

## Steps (步骤)

1. **Record** - Use your phone's voice recorder to capture your thoughts freely. Don't worry about structure or completeness - just talk.

2. **Transcribe** - Convert the recording to text using a bilingual transcription tool:
   - OpenAI Whisper (best for Chinese + English mixed speech)
   - Phone's built-in transcription (acceptable but weaker for bilingual input)
   - Other STT (Speech-to-Text) services

3. **Send to AI** - Paste the raw transcript into Cursor Chat or your AI assistant (e.g., Open WebUI). Include a brief instruction like:
   > "This is a voice transcript. Please extract the key topics, identify action items, and organize into structured notes for my knowledge base."

4. **AI Processes** - The AI will:
   - Clean up transcription errors
   - Identify distinct topics in the transcript
   - Extract action items and decisions
   - Suggest where each piece belongs (Projects / Areas / Resources / Methods)

5. **Review and Save** - Review the AI output, then save structured notes to appropriate locations:
   - `00_Inbox/` for items needing further processing
   - `10_Projects/` for project-specific insights
   - `20_Areas/` for experience reflections and domain knowledge
   - `30_Resources/Methods/` for reusable procedures discovered

## Tips (提示)

- Don't self-censor while recording. Raw, unstructured input is fine - the AI handles organization.
- For bilingual (Chinese + English) speech, OpenAI Whisper handles code-switching (language mixing) significantly better than most alternatives.
- Background noise (water, traffic) degrades transcription quality. A clip-on mic or earbuds with a mic can help.
- Check transcription output for proper nouns and technical terms - these are the most common error points.
- This workflow works well for: trade reviews (复盘), project retrospectives, idea brainstorming, experience summaries.

## Related (相关)

- [[../../99_System/Guides/WORKFLOW|CODA Workflow]] - This method implements the Capture phase
- [[../../20_Areas/Information-Digitization/Information-Digitization|Information Digitization]] - Broader digitization strategy

---

**Last Updated**: 2026-02-28
