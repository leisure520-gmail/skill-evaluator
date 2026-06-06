# skill-evaluator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) | [English](README_EN.md)

一个用于评估 AI Agent Skill 质量的 Skill。采用**双轨制**设计：轨道一（单文件 8 维度质量评估）+ 轨道二（体系架构 12 维度评估），严格顺序执行，单文件达标后方可进行体系评估。支持多模型交叉验证、千帆 API 多模型调用、串行多视角回退，提供三种执行策略按优先级自动降级，确保跨平台可用。

兼容所有支持 Skill 机制的 AI Agent 平台，包括但不限于 Claude Code、Ducc、小龙虾等。

## 特性

- **双轨制评估** — 轨道一（单文件 8 维度）+ 轨道二（体系架构 12 维度），严格顺序执行
- **多维度打分** — 轨道一 8 个加权维度，轨道二 12 个加权维度，每个维度 0-10 分
- **等级映射** — 综合得分自动映射为 S/A/B/C/D 等级，S 级（>= 9.0）为唯一达标等级
- **改进建议** — 对每个薄弱维度给出问题描述、影响分析和可执行建议
- **多 Skill 对比** — 并列评分表、优劣势分析和排名
- **多模型交叉验证** — 多个模型独立评估 -> 两两互审挑毛病 -> 仲裁者综合裁定，提升评估权威性
- **千帆 API 多模型** — 通过百度千帆大模型平台 API 调用多个真实模型，不依赖 subagent 机制
- **串行多视角回退** — 策略 A/B 均不可用时自动切换：同一模型以严格派/务实派/专家派三视角独立评估
- **自动策略降级** — A（subagent 并行）-> B（千帆 API）-> C（串行多视角），对用户透明

## 双轨评估体系

```
┌─────────────────────────────────────────────────────────┐
│                    双轨评估体系                           │
├─────────────────────────────────────────────────────────┤
│  轨道一：单文件质量评估（8 维度）                          │
│  ├── 评估对象：单个 Skill 文件                            │
│  ├── 评估焦点：这个 Skill 写得好不好                      │
│  ├── 通过标准：综合得分 >= 9.0（S 级）                    │
│  └── 未达标 -> 修复后重新评估，不得进入轨道二              │
│           │                                             │
│           v 全部 Skill 达标后                            │
│  轨道二：体系架构评估（12 维度）                           │
│  ├── 评估对象：整个 Skill 体系                            │
│  ├── 评估焦点：这个体系设计得对不对                       │
│  ├── 通过标准：加权总分 >= 9.0（S 级）                    │
│  └── 输出：成熟度等级 + 改进路线图                        │
└─────────────────────────────────────────────────────────┘
```

## 评估维度

### 轨道一：单文件质量（8 维度）

| 维度 | 权重 | 说明 |
|---|---|---|
| D1. 元数据质量 | 15% | YAML frontmatter 中 `name` 和 `description` 的质量 |
| D2. 执行引导清晰度 | 15% | Skill 加载后 Agent 是否清楚如何执行 |
| D3. 领域知识密度 | 15% | 是否内嵌了通用 Agent 不具备的专业知识 |
| D4. 工作流完整性 | 15% | 是否定义了端到端的工作流，含分支和异常处理 |
| D5. 输入输出清晰度 | 10% | 用户是否知道该提供什么、能得到什么 |
| D6. 资源利用 | 10% | 对 scripts、references、assets 等附带资源的利用 |
| D7. 写作质量 | 10% | 结构清晰度、可读性和表述精确性 |
| D8. 范围与聚焦 | 10% | 是否专注解决一类问题，既不过宽也不过窄 |

### 轨道二：体系架构（12 维度）

| 维度 | 权重 | 说明 |
|---|---|---|
| D1. 模块化封装 | 10% | Skill 独立、可测试、可组合 |
| D2. 渐进式披露 | 8% | 按需加载，三阶段（发现->激活->执行） |
| D3. TDD 工作流 | 15% | 测试先行，RED-GREEN-REFACTOR 循环 |
| D4. 三文件模式 | 7% | plan.md + context.md + tasks.md 结构化管理 |
| D5. 技能发现与组合 | 8% | 自动识别任务类型并推荐/组合技能 |
| D6. 知识可复用性 | 8% | 跨项目复用，版本化和质量反馈 |
| D7. 技能设计原则 | 8% | 单一职责、高内聚低耦合 |
| D8. 渐进式采用 | 5% | 4 阶段引入路径，有"最小可用集" |
| D9. 规范结构化 | 5% | 规范可量化、可验证 |
| D10. 按需加载 | 6% | 上下文预算管理 |
| D11. 场景适配 | 10% | 轻量模式，合规强度与任务复杂度匹配 |
| D12. 规范持续维护 | 10% | 自动检测、CHANGELOG、审批流程 |

## 等级标准

双轨评估共用同一等级映射：

| 分数 | 等级 | 含义 |
|---|---|---|
| 9.0-10 | S | 卓越 -- 标杆级 Skill（唯一达标等级） |
| 7.5-8.9 | A | 优秀 -- 可直接使用，仅需少量打磨 |
| 6.0-7.4 | B | 合格 -- 可用但有明显改进空间 |
| 4.0-5.9 | C | 较弱 -- 需要大幅修改 |
| 0-3.9 | D | 较差 -- 存在根本性问题，建议重新设计 |

## 安装

### Claude Code / Ducc

```bash
# 若平台支持 skill install 命令
claude skill install skill-evaluator --from github:jasonzhuo/skill-evaluator

# 或手动克隆
git clone https://github.com/jasonzhuo/skill-evaluator.git ~/.claude/skills/skill-evaluator
```

### 手动安装

将 `SKILL.md` 及 `references/`、`templates/`、`scripts/` 目录复制到你的 Agent 的 Skill 目录。以 Claude Code / Ducc 为例：

```bash
git clone https://github.com/jasonzhuo/skill-evaluator.git ~/.claude/skills/skill-evaluator
```

其他 Agent 平台请将 `SKILL.md` 放置到对应的 Skill 目录下。

## 配置

### 千帆 API（策略 B）

策略 B 通过百度千帆大模型平台 API 调用多个真实模型，需提前配置认证 Token。Token 可通过以下方式配置：

1. **Skill 配置文件**（推荐）：在 Skill 目录下创建 `config.json`，写入 `{"qianfan_token": "bce-v3/your-token-here"}`
2. **环境变量**：`export QIANFAN_BEARER_TOKEN="bce-v3/your-token-here"`

Token 未配置时策略 B 不可用，多模型模式会自动降级到策略 C（串行多视角）。

## 使用

通过斜杠命令调用（如果你的 Agent 支持）：

```
/skill-evaluator
```

也可以直接用自然语言描述意图：

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
用 sonnet 和 GLM-5 交叉验证评估 my-awesome-skill
```

### 多视角模式

```
用多视角模式评估 my-awesome-skill
```

### 评估 Skill 体系架构

```
评估 my-skill-system 的体系架构
```

## 交叉验证流程

根据执行情况自动选择策略（A -> B -> C 降级）：

### 策略 A：并行多模型（默认）

```
┌──────────────────────────────────────────────────────┐
│ 第零阶段：确认模型配置（询问用户）                      │
│ 主模型（仲裁者）：默认当前 Agent                       │
│ 评估模型列表：默认 Sonnet / GLM-5 / MiniMax            │
├──────────────────────────────────────────────────────┤
│ 第一阶段：并行独立评估                                  │
│ [Sonnet 评估] [GLM-5 评估] [MiniMax 评估]             │
├──────────────────────────────────────────────────────┤
│ 第二阶段：两两交叉互审                                  │
│ 每个模型审查其他模型的评分，找出分歧 >= 2 分的维度       │
├──────────────────────────────────────────────────────┤
│ 第三阶段：仲裁综合                                      │
│ 仲裁者基于一致/多数/仲裁三级规则给出最终结论             │
└──────────────────────────────────────────────────────┘
```

### 策略 B：千帆 API 多模型

通过千帆 API 并行调用 ernie-5.0、deepseek-v3.2、qwen3.5、glm-5.1 等模型，评估流程与策略 A 一致。

### 策略 C：串行多视角

同一模型依次扮演严格派、务实派、专家派三个评审视角，然后自我交叉审查和仲裁。

## 项目结构

```
skill-evaluator/
├── SKILL.md                              # 主入口（~130 行，路由 + 约束）
├── references/                           # 评估文档（按需加载）
│   ├── track1-quality.md                 # 轨道一：8 维度自包含评估
│   ├── track2-architecture.md            # 轨道二：12 维度自包含评估
│   └── multi-model.md                    # 多模型交叉验证策略
├── templates/                            # 引用模板（多模型模式使用）
│   ├── dimensions.md                     # 8 维度评分标准
│   ├── prompts.md                        # 评估 Prompt 模板
│   └── report-formats.md                 # 报告输出格式模板
├── scripts/
│   └── qianfan_chat.py                   # 千帆 API 调用脚本
├── ci/                                   # CI 集成配置
│   ├── github-actions.yml                # GitHub Actions 工作流
│   └── gitlab-ci.yml                     # GitLab CI 流水线
├── config.json                           # 千帆 Token 配置（gitignore）
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
└── README_EN.md
```

## 评估结果持久化

评估完成后，报告自动保存为 Markdown 文件：

```
eval-results/
└── my-awesome-skill/
    ├── track1_2026-06-07_143025.md
    ├── track1_2026-05-20_091500.md
    └── track2_2026-06-07_150030.md
```

- 默认保存到 `./eval-results/`，可在预检时自定义路径
- 文件名格式：`{轨道}_{YYYY-MM-DD_HHmmss}.md`
- 存在历史报告时，自动输出分数变化趋势

## CI 集成

项目提供 GitHub Actions 和 GitLab CI 配置，实现 Skill 变更时自动评估。

### GitHub Actions

将 `ci/github-actions.yml` 复制到你的仓库 `.github/workflows/` 目录下：

```bash
cp ci/github-actions.yml .github/workflows/skill-evaluation.yml
```

需要配置的 Secret：
- `ANTHROPIC_API_KEY`：Claude API 密钥（使用 Claude CLI 评估时）
- `QIANFAN_BEARER_TOKEN`：千帆 API Token（使用策略 B 时，可选）

触发条件：
- push 或 PR 修改了 `SKILL.md` 或 `references/`、`templates/` 目录
- 支持手动触发（workflow_dispatch），可指定 Skill 路径

### GitLab CI

将 `ci/gitlab-ci.yml` 的内容合并到你的 `.gitlab-ci.yml` 中：

```bash
# 追加到现有 CI 配置
cat ci/gitlab-ci.yml >> .gitlab-ci.yml
```

需要在 GitLab CI/CD Variables 中配置：
- `QIANFAN_BEARER_TOKEN`：千帆 API Token（可选）

触发条件：
- 修改了 `SKILL.md` 或 `references/`、`templates/` 目录时自动触发
- 评估结果作为 Artifact 保留 90 天

## 独立性声明

本 Skill 是独立第三方评估工具，不属于任何被评估的 Skill 体系。评估结果保存到被评估体系外部，避免"自己审自己"。

## 输出示例

### 单模型评估

```
## Skill 评估报告

### my-awesome-skill

**综合得分：7.8 / 10（等级 A）**

| 维度 | 分数 | 说明 |
|------|------|------|
| D1. 元数据质量 | 8/10 | 清晰的 description，包含触发条件 |
| D2. 执行引导清晰度 | 7/10 | 多数场景有引导，缺少异常处理 |
| D3. 领域知识密度 | 9/10 | 丰富的专家知识和最佳实践 |
| D4. 工作流完整性 | 8/10 | 完整的多步骤工作流 |
| D5. 输入输出清晰度 | 7/10 | 有输出格式，缺少输入示例 |
| D6. 资源利用 | 7/10 | N/A -- 无需附带资源 |
| D7. 写作质量 | 8/10 | 结构清晰，逻辑流畅 |
| D8. 范围与聚焦 | 8/10 | 聚焦于单一问题域 |

#### 问题与建议

1. **D2. 执行引导清晰度**：缺少异常情况处理指引 -> 添加 "当用户输入不完整时" 的分支逻辑
2. **D5. 输入输出清晰度**：缺少输入示例 -> 在使用场景部分添加 2-3 个具体输入示例
```

### 多模型交叉验证

```
## Skill 评估报告（多模型交叉验证）

### my-awesome-skill

> 主模型：当前 Agent | 评估模型：Sonnet, GLM-5, MiniMax

#### 独立评估结果

##### Sonnet 评估

| 维度 | 分数 | 说明 |
|------|------|------|
| D1. 元数据质量 | 8/10 | ... |
| ... | ... | ... |
| **综合得分** | **7.9/10 (等级 A)** | |

##### GLM-5 评估

（略）

##### MiniMax 评估

（略）

#### 交叉验证要点

| 维度 | 分歧 | 详情 |
|------|------|------|
| D3. 领域知识密度 | Sonnet(9) vs MiniMax(6) | Sonnet 认为内嵌了丰富专家知识；MiniMax 认为知识深度不足 |

> 共 1 个维度存在显著分歧（差异 >= 2 分），7 个维度全部模型一致。

#### 最终仲裁结论

**最终综合得分：7.8 / 10（等级 A）**

| 维度 | 最终分数 | 共识度 | 仲裁说明 |
|------|----------|--------|----------|
| D1. 元数据质量 | 8/10 | 一致 | 三模型评分一致 |
| D3. 领域知识密度 | 8/10 | 仲裁 | Sonnet 和 GLM-5 给 8-9 分，MiniMax 给 6 分；采纳多数意见 |
| ... | ... | ... | ... |

#### 问题与建议

1. **D2. 执行引导清晰度**（共识度：一致）：缺少异常处理 -> 添加分支逻辑
```

## 贡献

欢迎提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

## License

MIT