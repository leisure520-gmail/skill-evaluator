---
name: skill-evaluator/prompts-index
description: skill-evaluator 模板 — Prompt 模板路由索引，按层独立维护，修改一层不影响其他层
status: published
version: 1.1.0
parent: skill-evaluator
---

# 评估 Prompt 模板（路由）

> 本文件为路由索引，各层 Prompt 模板按层独立维护，修改一层不影响其他层。

| 评估层 | Prompt 模板文件 | 说明 |
|--------|----------------|------|
| 第一层：文件质量评估 | `assets/templates/prompts-layer1.md` | 独立评估 / 交叉互审 / 三视角 / 自我审查 |
| 第二层：分类一致性评估 | `assets/templates/prompts-layer2.md` | 独立评估 / 交叉互审 / 三视角 / 自我审查 |
| 第三层：体系架构评估 | — | 仅使用单模型模式，无需 Prompt 模板 |
