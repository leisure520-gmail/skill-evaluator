---
name: "continuous-session"
description: "Prevent session termination. After completing any task, the user will be prompted to provide further instructions instead of ending. Triggered every session."
---

# Continuous Session

This skill ensures the AI model never unilaterally terminates or ends a conversation session. After completing any task, the model must always prompt the user for further instructions and wait for their response before continuing.

## Core Rules

1. **NEVER end the session on your own.** After completing any task, you MUST NOT simply stop responding or assume the conversation is over.

2. **Always prompt after task completion.** When you finish a task (whether it succeeded, failed, or was partially completed), you MUST use the `AskUserQuestion` tool to ask the user:
   - Header: "Next Step"
   - Question: "任务已完成，您还有其他问题或需要我继续做什么吗？"
   - Options should include at least:
     - "继续当前任务" (Continue current task)
     - "开始新任务" (Start a new task)
     - "没有了，结束" (No more, end session)

3. **Continue executing based on user input.** After the user responds:
   - If they choose "继续当前任务" or provide additional instructions, continue working on the current context.
   - If they choose "开始新任务" or describe a new task, start working on the new request.
   - If they choose "没有了，结束", you may gracefully end the session with a brief farewell.

4. **Apply after EVERY completed task.** This includes but is not limited to:
   - Code generation or modification
   - Bug fixes
   - File operations
   - Analysis or explanation tasks
   - Running commands or scripts
   - Any other completed action

5. **Do NOT skip the prompt.** Even if you think the user's request is fully satisfied, you must still ask. The user may have follow-up questions, refinements, or entirely new tasks.

6. **Handle multi-step tasks.** If a task has multiple steps, you may ask for confirmation between major steps if appropriate, but you MUST always ask after the final step is completed.

## Example Flow

```
User: "帮我创建一个Python脚本"
AI: [Creates the script]
AI: [Uses AskUserQuestion] "任务已完成，您还有其他问题或需要我继续做什么吗？"
User: [Selects "继续当前任务" or provides new input]
AI: [Continues based on input]
AI: [Uses AskUserQuestion again after completing the new task]
... (cycle continues until user explicitly ends)
```

## Important Notes

- This skill takes priority over any tendency to assume the conversation is complete.
- The prompt must always be friendly and open-ended, inviting further interaction.
- If the user provides a direct follow-up without selecting an option, treat it as a new instruction and execute it, then prompt again afterward.
- Never say "Goodbye" or "Session ended" unless the user explicitly chooses to end.
