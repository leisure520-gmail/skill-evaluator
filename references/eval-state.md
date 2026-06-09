---
name: skill-evaluator/eval-state
description: skill-evaluator 子文档 — 增量评估状态管理，包含状态文件 Schema、指纹计算（跨平台）、换行符处理、版本迁移机制
status: published
version: 1.1.0
parent: skill-evaluator
---

# 增量评估状态管理

管理评估状态文件，实现增量评估：跳过未变更文件，仅评估新增/修改文件。

> **每次评估必须先执行本文档的流程**，确定增量评估范围后再进入对应评估层级。

---

## 核心概念

| 概念 | 说明 |
|------|------|
| **评估状态文件** | 记录每个文件的指纹、评分、评估时间的 JSON 文件 |
| **内容指纹** | 文件完整内容的哈希值，用于检测变更 |
| **增量评估** | 仅评估新增/变更文件，跳过未变更文件 |
| **全量重评** | 忽略状态文件，重新评估所有文件 |

---

## 状态文件格式

### 文件位置

`{待评估 Skill 根目录}/eval-results/eval-state.json`

> 评估状态文件与评估报告存放在同一目录（被评估 Skill 根目录下的 `eval-results/`）。

### JSON Schema

```json
{
  "version": "1.0",
  "target_path": "/path/to/skill-system",
  "last_eval_time": "2026-06-07T14:30:25Z",
  "files": {
    "relative/path/to/SKILL.md": {
      "fingerprint": "sha256:abc123...",
      "role": "entry",
      "category": "writing-java-code",
      "last_eval_time": "2026-06-07T14:30:25Z",
      "eval_depth": "full",
      "scores": {
        "D1": 9, "D2": 8, "D3": 7, "D4": 8,
        "D5": 7, "D6": 8, "D7": 9, "D8": 8
      },
      "weighted_score": 8.05,
      "grade": "A",
      "issues": ["D3: 领域知识密度不足，缺少反模式示例"]
    },
    "relative/path/to/01-base-entity.md": {
      "fingerprint": "sha256:def456...",
      "role": "sub-doc",
      "category": "writing-java-code",
      "last_eval_time": "2026-06-07T14:30:25Z",
      "eval_depth": "full",
      "scores": {
        "D1": 9, "D2": 8, "D3": 9, "D4": 8,
        "D5": 7, "D6": 6, "D7": 9, "D8": 8
      },
      "weighted_score": 8.15,
      "grade": "A",
      "issues": []
    }
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `version` | string | 状态文件格式版本，当前 `1.0` |
| `target_path` | string | 被评估体系的根目录绝对路径 |
| `last_eval_time` | string | 最近一次评估时间（ISO 8601） |
| `files` | object | 文件级评估状态，key 为相对路径 |
| `files.*.fingerprint` | string | 内容指纹，格式 `sha256:{hex}` |
| `files.*.role` | string | 文件角色：`entry` / `sub-doc` / `root` |
| `files.*.category` | string | 所属分类。入口文件所在目录名；若入口文件在根目录，则使用入口文件名（不含扩展名） |
| `files.*.last_eval_time` | string | 该文件最近评估时间 |
| `files.*.eval_depth` | string | 评估深度：`full`（D1-D8）/ `light`（部分维度） |
| `files.*.scores` | object | 各维度评分，轻量评估仅包含评估过的维度 |
| `files.*.weighted_score` | number | 加权综合得分 |
| `files.*.grade` | string | 等级（S/A/B/C/D） |
| `files.*.issues` | array | 问题摘要列表 |

---

## 指纹计算

### 算法

对文件完整内容计算 SHA-256 哈希。**根据运行平台自动选择命令**：

```bash
# Linux / macOS
sha256sum "{file_path}" | cut -d' ' -f1

# Windows（PowerShell）
(Get-FileHash "{file_path}" -Algorithm SHA256).Hash.ToLower()
```

**平台检测方式**（在 bash 环境中）：
```bash
if command -v sha256sum &>/dev/null; then
  # Linux/macOS
  FINGERPRINT=$(sha256sum "$FILE" | cut -d' ' -f1)
else
  # Windows via PowerShell fallback
  FINGERPRINT=$(powershell -Command "(Get-FileHash '$FILE' -Algorithm SHA256).Hash.ToLower()")
fi
```

### 指纹格式

`sha256:{hex_digest}`（统一小写）

### 换行符统一（重要）

跨平台团队（混用 Windows/Unix）中，同一文件在不同平台 checkout 后可能产生不同换行符（LF vs CRLF），导致指纹不同，从而产生"永远视为变更"的假阳性。

**推荐处理方式**（按优先级）：

1. **在被评估体系的 `.gitattributes` 中统一换行符**（最佳）：
   ```gitattributes
   *.md text eol=lf
   ```

2. **评估前规范化换行符**（次选，适用于无法修改 `.gitattributes` 的情况）：
   ```bash
   # 计算指纹前先规范化（仅用于计算，不修改原文件）
   sed 's/\r//' "{file_path}" | sha256sum | cut -d' ' -f1
   ```

3. **标注警告**：若检测到 CRLF 文件（`file` 命令输出含 `CRLF`），在报告中注明"检测到 CRLF 换行符，指纹可能因平台而异，建议统一为 LF"。

### 注意事项

- 指纹基于文件完整内容（含 frontmatter 和正文），换行符规范化后计算
- 空文件的指纹仍需计算并记录
- 指纹统一使用小写十六进制，避免大小写导致的不必要"变更"

---

## 增量评估流程

### 步骤 1：读取状态文件

1. 检查 `{评估结果根目录}/eval-state.json` 是否存在
2. 不存在 → 首次评估，所有文件标记为"新增"
3. 存在 → 读取并解析 JSON

### 步骤 2：扫描当前文件

1. 递归扫描被评估体系根目录下所有 `.md` 文件
2. 对每个文件计算指纹
3. 识别文件角色（入口/子文档/根目录）

### 步骤 3：对比变更

对每个文件执行以下判定：

| 条件 | 状态 | 处理 |
|------|------|------|
| 文件不在状态文件中 | **新增** | 必须评估 |
| 文件在状态文件中，指纹相同 | **未变更** | 跳过，沿用上次结果 |
| 文件在状态文件中，指纹不同 | **已变更** | 必须重新评估 |
| 状态文件中有记录但文件不存在 | **已删除** | 从状态文件中移除 |

### 步骤 4：输出增量评估计划

```
增量评估计划
═══════════════════════════════════
被评估体系：/path/to/skill-system
状态文件版本：1.0
上次评估时间：2026-06-01 10:00:00

文件变更统计：
  新增文件：3 个 → 必须评估
  已变更文件：5 个 → 必须重新评估
  未变更文件：42 个 → 跳过
  已删除文件：1 个 → 移除记录

本次需评估：8 个文件
跳过评估：42 个文件（沿用上次结果）

需评估文件清单：
  [新增] writing-java-code/14-new-topic.md
  [新增] building-vue3-apps/09-ssr.md
  [新增] testing-convention/08-integration.md
  [变更] writing-java-code/SKILL.md
  [变更] writing-java-code/01-base-entity.md
  [变更] building-vue3-apps/SKILL.md
  [变更] quality-assurance/00-compliance-gate.md
  [变更] CONVENTION.md

已删除文件：
  [删除] writing-java-code/12-old-topic.md
═══════════════════════════════════
```

### 步骤 5：用户确认

- 用户确认增量计划 → 按计划执行
- 用户要求全量重评 → 忽略状态文件，评估所有文件
- 用户调整范围 → 按调整后的范围执行

---

## 状态更新流程

评估完成后，更新状态文件：

### 更新规则

| 操作 | 说明 |
|------|------|
| 新增记录 | 新增/已变更文件评估完成后，写入新记录 |
| 更新记录 | 已变更文件评估完成后，覆盖旧记录 |
| 删除记录 | 已删除文件从状态文件中移除 |
| 保留记录 | 未变更文件记录保持不变 |

### 更新时机

- 每个文件评估完成后立即更新对应记录（而非等所有文件评估完）
- 全部评估完成后更新 `last_eval_time`

### 原子性

- 更新状态文件时，先写入临时文件，再重命名替换，避免写入中断导致文件损坏

---

## 分类级汇总

状态文件不存储分类级汇总，但评估报告需要时可通过文件记录聚合计算：

```python
# 分类级汇总计算逻辑（伪代码）
for category in categories:
    category_files = [f for f in files if f.category == category]
    avg_score = sum(f.weighted_score for f in category_files) / len(category_files)
    min_score = min(f.weighted_score for f in category_files)
    issues_count = sum(len(f.issues) for f in category_files)
```

---

## 状态文件版本兼容

| 版本 | 变更 | 兼容策略 |
|------|------|---------|
| `1.0` | 初始版本，文件 key 为相对路径 | — |
| 未来版本 | 可能增加字段或修改 key 格式 | 见下方迁移策略 |

### 读取时的版本处理逻辑

```
读取 eval-state.json
  ├── version == 当前版本 → 正常读取
  ├── version 字段不存在 → 视为损坏，重命名为 eval-state.json.bak，执行全量重评，提示用户
  ├── version > 当前版本 → 输出警告，尝试兼容读取
  │     ├── 关键字段（files / target_path）存在 → 兼容读取，新增字段设默认值
  │     └── 关键字段缺失 → 重命名为 eval-state.json.bak，执行全量重评，提示用户
  └── version < 当前版本（降级场景）→ 按旧版格式读取，评估完成后升级为当前版本格式写回
```

### key 格式变更的迁移

若未来版本将文件 key 从"相对路径"改为其他格式，旧版状态文件的所有记录均视为"已删除"，触发全量重评（不报错，评估完成后写入新版状态文件）。

---

## 执行后验证

| # | 检查项 | 阻断级别 |
|---|--------|---------|
| 1 | 状态文件格式合法（可解析的 JSON） | BLOCK |
| 2 | 所有评估过的文件都有对应记录 | BLOCK |
| 3 | 每条记录的 fingerprint 与文件当前内容一致 | BLOCK |
| 4 | 已删除文件的记录已移除 | WARN |
| 5 | 增量评估计划中的文件与实际评估范围一致 | BLOCK |

未通过验证 = 状态文件不可信，建议执行全量重评。
