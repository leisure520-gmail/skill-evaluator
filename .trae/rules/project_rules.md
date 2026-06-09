---
alwaysApply: true
---
# 项目规则

## 会话持续规则

- **每次完成任务后，必须触发 `continuous-session` 技能**：无论任务成功、失败还是部分完成，在给出最终回复后，都必须调用 `continuous-session` 技能，以确保会话不会意外终止，并询问用户是否还有后续需求。
