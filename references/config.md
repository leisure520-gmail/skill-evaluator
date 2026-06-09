---
name: skill-evaluator/config
description: skill-evaluator 子文档 — 共享常量定义，包含路径、评分阈值、Token 配置、API 配置等全局常量。修改此处即可全局生效
status: published
version: 1.0.1
parent: skill-evaluator
---

# 项目配置常量

> **本文件定义 skill-evaluator 项目中多处引用的共享常量。修改时只需改此处，其他文件引用本文件即可。**

---

## 1. 评估结果目录

| 变量名 | 当前值 | 说明 | 示例 |
|------|------|------|------|
| `EVAL_RESULTS_DIR` | `eval-results/` | 评估报告存放目录名（位于待评估 Skill 根目录下） | `eval-results/` |
| `EVAL_STATE_FILE` | `eval-state.json` | 增量评估状态文件名（位于 `eval-results/` 下） | `eval-state.json` |
| `REPORT_FILENAME` | `layer{N}_{YYYY-MM-DD_HHmmss}.md` | 评估报告文件名格式 | `layer1_2026-06-07_143025.md` |

**完整路径**：
- 评估报告：`{待评估 Skill 根目录}/eval-results/layer{N}_{YYYY-MM-DD_HHmmss}.md`
- 状态文件：`{待评估 Skill 根目录}/eval-results/eval-state.json`

---

## 2. 评分标准

| 变量名 | 当前值 | 说明 | 示例 |
|------|------|------|------|
| `PASSING_SCORE` | `9.0` | 唯一达标分数（S 级） | `9.0` |
| `MIN_ACCEPTABLE` | `7.0` | 最低可接受分数（低于此必须修复） | `7.0` |
| `SCORE_RANGE` | `0-10` | 评分范围 | `0-10` |
| `SKIP_DAYS` | `30` | 可跳过评估的天数（近 N 天内已评估且全部达标且无文件变更） | `30` |
| `MAX_FIX_ROUNDS` | `3` | 自动修复最大轮次（超过后标记"需人工介入"） | `3` |

**等级映射（所有层级通用）**：

| 分数范围 | 等级 | 含义 |
|---------|------|------|
| 9.0-10 | S | 卓越 — 标杆级（唯一达标等级） |
| 7.5-8.9 | A | 优秀 — 可直接使用，仅需少量打磨 |
| 6.0-7.4 | B | 合格 — 可用但有明显改进空间 |
| 4.0-5.9 | C | 较弱 — 需要大幅修改 |
| 0-3.9 | D | 较差 — 存在根本性问题，建议重新设计 |

---

## 3. DeepSeek API 配置

| 变量名 | 当前值 | 说明 | 示例 |
|------|------|------|------|
| `CONFIG_FILE` | `config.json` | Token 配置文件名（位于 Skill 目录下） | `config.json` |
| `TOKEN_FIELD` | `deepseek_api_key` | config.json 中 API Key 字段名 | `deepseek_api_key` |
| `TOKEN_PREFIX` | `sk-` | 有效 API Key 前缀 | `sk-` |
| `TOKEN_ENV_VAR` | `DEEPSEEK_API_KEY` | API Key 环境变量名 | `DEEPSEEK_API_KEY` |

**API Key 检测优先级**：config.json → 环境变量 → 询问用户

---

## 4. 项目版本

| 变量名 | 当前值 | 说明 | 示例 |
|------|------|------|------|
| `VERSION` | `1.0.1` | 当前项目版本 | `1.0.1` |

---

## 5. 评估体系结构

| 变量名 | 当前值 | 说明 | 示例 |
|------|------|------|------|
| `LAYER1_DIMENSIONS` | `8` | 第一层维度数 | `8` |
| `LAYER2_DIMENSIONS` | `8` | 第二层维度数 | `8` |
| `LAYER3_DIMENSIONS` | `12` | 第三层维度数 | `12` |
