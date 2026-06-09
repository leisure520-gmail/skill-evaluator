# skill-evaluator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) | [![Version](https://img.shields.io/badge/Version-1.1.0-blue.svg)](CHANGELOG.md) | [English](README_EN.md)

> AI Agent Skill 质量评估工具 — 三层递进评估 + 多模型交叉验证 + 增量评估

兼容所有支持 Skill 机制的 AI Agent 平台，包括但不限于 Claude Code、Ducc、小龙虾等。

## 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [使用方式](#使用方式)
- [架构](#架构)
- [项目结构](#项目结构)
- [输出示例](#输出示例)
- [CI 集成](#ci-集成)
- [贡献](#贡献)
- [License](#license)

## 特性

- **三层递进评估** — 文件质量（8 维度）→ 分类一致性（8 维度）→ 体系架构（12 维度），低层达标后方可进入高层
- **增量评估** — 基于内容指纹（SHA-256）跳过未变更文件
- **多模型交叉验证** — 独立评估 → 两两互审 → 仲裁裁定，三种策略自动降级（A→B→C）
- **DeepSeek API 多模型** — 通过 DeepSeek API 并行调用多个真实模型，不依赖 subagent
- **多 Skill 对比** — 并列评分表、优劣势分析和排名
- **S/A/B/C/D 等级映射** — S 级（≥9.0）为唯一达标等级
- **改进建议** — 对每个薄弱维度给出问题描述、影响分析和可执行建议

## 快速开始

### 安装

```bash
# 方式 1：skill install（如果平台支持）
claude skill install skill-evaluator --from github:jasonzhuo/skill-evaluator

# 方式 2：手动克隆
git clone https://github.com/jasonzhuo/skill-evaluator.git ~/.claude/skills/skill-evaluator
```

其他 Agent 平台请将 `SKILL.md` 放置到对应的 Skill 目录下。

### 配置

策略 B（DeepSeek API 多模型）需要 API Key，未配置时自动降级到策略 C：

```bash
# 方式 1：配置文件（推荐）
echo '{"deepseek_api_key": "sk-your-api-key-here"}' > config.json

# 方式 2：环境变量
export DEEPSEEK_API_KEY="sk-your-api-key-here"
```

### 基本用法

通过斜杠命令调用（如果你的 Agent 支持）：

```
/skill-evaluator
```

或用自然语言：

```
帮我评估一下 my-awesome-skill
```

## 使用方式

### 评估单个 Skill

```
帮我评估一下 my-awesome-skill 这个 Skill
```

### 对比多个 Skill

```
对比 skill-a 和 skill-b，哪个设计更好
```

### 按路径评估

```
评估 ~/projects/my-skill/SKILL.md 这个 Skill
```

### 多模型交叉验证

```
用多模型交叉验证评估 my-awesome-skill
```

### 自定义模型列表

```
用 sonnet 和 deepseek-chat 交叉验证评估 my-awesome-skill
```

### 多视角模式

```
用多视角模式评估 my-awesome-skill
```

### 评估体系架构

```
评估 my-skill-system 的体系架构
```

## 架构

### 三层评估体系

```
┌─────────────────────────────────────────────────────────┐
│                    三层评估体系                           │
├─────────────────────────────────────────────────────────┤
│  第一层：文件质量评估（8 维度 × 全文件）                  │
│  ├── 评估焦点：这个文件写得好不好                         │
│  ├── 评估对象：体系内每个 .md 文件独立评估                │
│  ├── 增量机制：基于内容指纹跳过未变更文件                 │
│  ├── 通过标准：综合得分 >= 9.0（S 级）                   │
│  └── 未达标 -> 修复后重新评估，不得进入第二层             │
│           │                                             │
│           v 该分类下所有文件达标后                        │
│  第二层：分类一致性评估（8 维度 × 每分类）                │
│  ├── 评估焦点：同一分类下文件之间是否协调                 │
│  ├── 评估对象：每个分类（SKILL.md + 子文档）作为整体      │
│  ├── 检查内容：冲突、重叠、遗漏、引用、术语、元数据       │
│  ├── 通过标准：综合得分 >= 9.0（S 级）                   │
│  └── 未达标 -> 修复后重新评估，不得进入第三层             │
│           │                                             │
│           v 所有分类达标后                               │
│  第三层：体系架构评估（12 维度）                          │
│  ├── 评估焦点：整个体系设计得对不对                       │
│  ├── 评估对象：整个 Skill 体系                           │
│  ├── 通过标准：加权总分 >= 9.0（S 级）                   │
│  └── 输出：成熟度等级 + 改进路线图                       │
└─────────────────────────────────────────────────────────┘
```

### 评估维度

#### 第一层：文件质量评估（8 维度）

| 维度 | 权重 | 说明 |
|---|---|---|
| D1(元数据) | 15% | YAML frontmatter 中 `name` 和 `description` 的质量 |
| D2(执行引导) | 15% | Skill 加载后 Agent 是否清楚如何执行 |
| D3(领域知识) | 15% | 是否内嵌了通用 Agent 不具备的专业知识 |
| D4(工作流) | 15% | 是否定义了端到端的工作流，含分支和异常处理 |
| D5(输入输出) | 10% | 用户是否知道该提供什么、能得到什么 |
| D6(资源利用) | 10% | 对 scripts、references、assets 等附带资源的利用 |
| D7(写作质量) | 10% | 结构清晰度、可读性和表述精确性 |
| D8(范围聚焦) | 10% | 是否专注解决一类问题，既不过宽也不过窄 |

#### 第二层：分类一致性评估（8 维度）

| 维度 | 权重 | 说明 |
|---|---|---|
| D1(职责边界) | 15% | 分类内文件职责无重叠、无遗漏 |
| D2(术语一致) | 10% | 同一概念在分类内所有文件中使用统一术语 |
| D3(交叉引用) | 10% | 文件间引用正确、可达 |
| D4(知识覆盖) | 15% | 分类领域核心场景无遗漏 |
| D5(冗余检测) | 10% | 无跨文件大段重复 |
| D6(层级结构) | 10% | 编号/分组/命名逻辑一致 |
| D7(元数据一致) | 15% | 子文档 frontmatter 与路由表一致，无孤立/幽灵 |
| D8(工作流闭环) | 15% | 入口文件声明的工作流被子文档完整覆盖 |

#### 第三层：体系架构评估（12 维度）

| 维度 | 权重 | 说明 |
|---|---|---|
| D1(模块化) | 10% | Skill 独立、可测试、可组合 |
| D2(渐进披露) | 8% | 按需加载，三阶段（发现->激活->执行） |
| D3(TDD) | 12% | 测试先行，RED-GREEN-REFACTOR 循环 |
| D4(三文件) | 7% | plan.md + context.md + tasks.md 结构化管理 |
| D5(技能发现) | 10% | 自动识别任务类型并推荐/组合技能 |
| D6(知识复用) | 8% | 跨项目复用，版本化和质量反馈 |
| D7(设计原则) | 8% | 单一职责、高内聚低耦合 |
| D8(渐进采用) | 5% | 4 阶段引入路径，有"最小可用集" |
| D9(规范结构) | 5% | 规范可量化、可验证 |
| D10(按需加载) | 7% | 上下文预算管理 |
| D11(场景适配) | 10% | 轻量模式，合规强度与任务复杂度匹配 |
| D12(持续维护) | 10% | 自动检测、CHANGELOG、审批流程 |

### 等级标准

三层评估共用同一等级映射：

| 分数 | 等级 | 含义 |
|---|---|---|
| 9.0-10 | S | 卓越 — 标杆级（唯一达标等级） |
| 7.5-8.9 | A | 优秀 — 可直接使用，仅需少量打磨 |
| 6.0-7.4 | B | 合格 — 可用但有明显改进空间 |
| 4.0-5.9 | C | 较弱 — 需要大幅修改 |
| 0-3.9 | D | 较差 — 存在根本性问题，建议重新设计 |

### 交叉验证策略

根据执行条件自动选择策略（A → B → C 降级）：

| 策略 | 方式 | 依赖 | 说明 |
|------|------|------|------|
| **A** | subagent 并行多模型 | Agent 工具 + model 参数 | 默认，效果最佳 |
| **B** | DeepSeek API 多模型 | Bash + Python + DeepSeek API Key | 不依赖 subagent |
| **C** | 串行多视角 | 无外部依赖 | 回退方案，同一模型以严格派/务实派/专家派三视角评估 |

**策略 A 流程**：

```
┌──────────────────────────────────────────────────────┐
│ 确认模型配置（主模型 + 评估模型列表）                  │
├──────────────────────────────────────────────────────┤
│ 第一阶段：并行独立评估                                  │
│ [模型1 评估] [模型2 评估] [模型3 评估]                 │
├──────────────────────────────────────────────────────┤
│ 第二阶段：两两交叉互审                                  │
│ 每个模型审查其他模型的评分，找出分歧 >= 2 分的维度       │
├──────────────────────────────────────────────────────┤
│ 第三阶段：仲裁综合                                      │
│ 仲裁者基于一致/多数/仲裁三级规则给出最终结论             │
└──────────────────────────────────────────────────────┘
```

## 项目结构

```
skill-evaluator/
├── SKILL.md                              # 主入口（路由 + 约束）
├── references/                           # 评估文档（按需加载）
│   ├── config.md                         # 共享常量定义
│   ├── layer1-quality.md                 # 第一层：文件质量评估
│   ├── layer2-consistency.md             # 第二层：分类一致性评估
│   ├── layer3-architecture.md            # 第三层：体系架构评估
│   ├── eval-state.md                     # 增量评估状态管理
│   ├── multi-model.md                    # 多模型交叉验证策略
│   └── auto-fix.md                       # 自动修复机制
├── assets/                                # 静态资源
│   ├── templates/                         # 引用模板（按层独立维护）
│   │   ├── dimensions-*.md                # 评分标准
│   │   ├── prompts-*.md                   # Prompt 模板
│   │   └── report-*.md                    # 报告格式
│   └── ci/                                # CI 集成配置
│       ├── github-actions.yml             # GitHub Actions 工作流
│       └── gitlab-ci.yml                  # GitLab CI 流水线
├── scripts/
│   └── deepseek_chat.py                   # DeepSeek API 调用脚本
├── config.json                           # DeepSeek API Key 配置（gitignore）
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
└── README_EN.md
```

评估完成后，报告自动保存到待评估 Skill 根目录下的 `eval-results/`，文件名格式为 `layer{N}_{YYYY-MM-DD_HHmmss}.md`。存在历史报告时自动输出分数变化趋势。

## 输出示例

### 第一层：文件质量评估

```
## Skill 评估报告（第一层：文件质量）

### 增量评估摘要

- 评估模式：增量评估
- 本次评估文件：8 个 | 跳过文件（未变更）：42 个

### writing-java-code — 综合评分

**分类平均分：8.3 / 10（等级 A）| 最低分：7.2 / 10（等级 B）**

#### 入口文件：SKILL.md

**综合得分：7.8 / 10（等级 A）**

| 维度 | 分数 | 说明 |
|------|------|------|
| D1(元数据) | 8/10 | 清晰的 description，包含触发条件 |
| D2(执行引导) | 7/10 | 多数场景有引导，缺少异常处理 |
| D3(领域知识) | 9/10 | 丰富的专家知识和最佳实践 |
| D4(工作流) | 8/10 | 完整的多步骤工作流 |
| D5(输入输出) | 7/10 | 有输出格式，缺少输入示例 |
| D6(资源利用) | 7/10 | N/A — 无需附带资源 |
| D7(写作质量) | 8/10 | 结构清晰，逻辑流畅 |
| D8(范围聚焦) | 8/10 | 聚焦单一问题域 |

#### 问题与建议

1. **D2(执行引导)**：缺少异常处理指引 → 添加"当用户输入不完整时"的分支逻辑
2. **D5(输入输出)**：缺少输入示例 → 在场景描述中添加 2-3 个具体输入示例
```

### 多模型交叉验证

```
## Skill 评估报告（第一层：文件质量 — 多模型交叉验证）

### my-awesome-skill

> 主模型：当前 Agent | 评估模型：deepseek-chat, deepseek-reasoner, sonnet

#### 交叉验证要点

| 维度 | 分歧 | 详情 |
|------|------|------|
| D3(领域知识) | sonnet(9) vs deepseek-reasoner(6) | sonnet 认为内嵌了丰富专家知识；deepseek-reasoner 认为知识深度不足 |

> 共 1 个维度存在显著分歧（差异 >= 2 分），7 个维度全部模型一致。

#### 最终仲裁结论

**最终综合得分：7.8 / 10（等级 A）**

| 维度 | 最终分数 | 共识度 | 仲裁说明 |
|------|----------|--------|----------|
| D1(元数据) | 8/10 | 一致 | 三模型评分一致 |
| D3(领域知识) | 8/10 | 仲裁 | sonnet 和 deepseek-chat 给 8-9 分，deepseek-reasoner 给 6 分；采纳多数意见 |
```

## CI 集成

项目提供 GitHub Actions 和 GitLab CI 配置，实现 Skill 变更时自动评估。

### GitHub Actions

```bash
cp assets/ci/github-actions.yml .github/workflows/skill-evaluation.yml
```

需要配置的 Secret：
- `ANTHROPIC_API_KEY`：Claude API 密钥（使用 Claude CLI 评估时）
- `DEEPSEEK_API_KEY`：DeepSeek API Key（使用策略 B 时，可选）

触发条件：push 或 PR 修改了 `SKILL.md` 或 `references/`、`assets/templates/` 目录或任何 `.md` 文件，支持手动触发。

### GitLab CI

```bash
cat assets/ci/gitlab-ci.yml >> .gitlab-ci.yml
```

需要在 GitLab CI/CD Variables 中配置：
- `DEEPSEEK_API_KEY`：DeepSeek API Key（可选）

评估结果作为 Artifact 保留 90 天。

## 独立性声明

本 Skill 是独立第三方评估工具，不属于任何被评估的 Skill 体系。评估结果保存到被评估体系外部，避免"自己审自己"。

## 贡献

欢迎提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

## License

[MIT](LICENSE)
