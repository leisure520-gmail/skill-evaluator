# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2026-06-12

### Fixed

- **[D2/D5 路径矛盾]** `SKILL.md` 独立性声明和全局约束第3条删除"保存到被评估体系外部"的误导表述，改为准确描述"保存在被评估体系的 `eval-results/` 子目录下，与 skill-evaluator 自身隔离"
- **[D2 预检]** `SKILL.md` 预检第3项确认方式从"查 eval-state.json 的 grade 字段"更正为"查最新 layer1 报告的分类平均分/最低分"（eval-state.json 不存储分类级汇总）；预检第6项删除"必须在被评估体系外部"的错误描述
- **[D5 文件名格式]** `SKILL.md` 输出约定时间戳格式从 `YYYYMMDD_HHmmss` 统一为 `YYYY-MM-DD_HHmmss`，与 `references/config.md` 的权威定义对齐；结果持久化章节占位符 `EVAL_RESULTS_DIR`/`REPORT_FILENAME` 替换为具体路径和文件名格式
- **[D5 快照路径]** `references/auto-fix.md` 快照路径时间戳格式从 `YYYYMMDD_HHmmss` 统一为 `YYYY-MM-DD_HHmmss`，与 config.md 对齐
- **[D1 frontmatter]** `TRAINING.md` 补充 frontmatter（name/description/status/version/parent）
- **[D6 文档]** `README.md` 新增"升级"小节，说明 `node bin/upgrade.js` 用法；新增 install.js 安装范围说明（仅安装运行时文件，文档类文件保留在仓库）；目录新增"升级"条目
- **[SELF_CHECK]** 更新自检版本至 1.1.1，更新综合评估结论，补录本次所有修复项到已知遗留问题表，将独立第三方验证计划版本延至 v1.2.0



### Fixed

- **[D1 元数据]** 新增「资源文件」角色：`assets/` 下的模板/示例/范本文件设计上不应有 frontmatter，按内容评估（仅 D3+D7），不触发 D1 扣分和自动修复

### Added

- **资源文件识别规则**：文件路径包含 `assets/` 目录，或文件名包含 `template`、`example`、`sample`、`demo` 关键词
- **评估深度分级扩展**：从 4 种角色增加到 5 种，明确区分"无 frontmatter 子文档"（应补充）与"资源文件"（不应有）

### Updated

- SKILL.md、SELF_CHECK.md 及 references/ 子文档（共 9 个文件）版本号统一升级为 1.1.0；assets/templates/ 资源文件不包含版本号

## [1.0.1] - 2026-06-09

### Fixed

- **[D5 输入输出]** `SKILL.md` 新增「输入输出契约」章节，明确输入路径格式（绝对/相对/Windows）、跨平台限制、输出文件名时间戳时区（UTC+8）、报告编码（UTF-8 无 BOM）
- **[D2 执行引导]** `SKILL.md` 预检清单新增「确认方式」列，明确每项如何确认，取代原始的空白复选框
- **[D2 执行引导]** `SKILL.md` 新增「异常处理」表，覆盖路径不存在、无 SKILL.md、文件不可读、状态文件损坏、API Key 无效、修复超限六种场景
- **[D8 范围聚焦]** `SKILL.md` 新增「与其他 Skill 的组合使用」章节，声明与 skill-creator 的协作关系和不适用场景
- **[自动修复]** `references/auto-fix.md` 新增「快照优先」规则：修复前保存原文件到 `eval-results/snapshots/{timestamp}/`，供人工回滚
- **[自动修复]** `references/auto-fix.md` 新增「仅建议模式」：用户说"只给建议/不要自动修复"时跳过所有修复操作
- **[自动修复]** `references/auto-fix.md` 明确 MAX_FIX_ROUNDS 耗尽行为：停止修复该文件、继续下一个、在报告末尾汇总需人工介入项，并提供汇总表格式
- **[自动修复]** `references/auto-fix.md` 新增第一层修复约束表，明确允许范围（新增章节、修正 frontmatter）和禁止范围（删除章节、更改核心定位）
- **[增量评估]** `references/eval-state.md` 指纹计算新增跨平台支持：Linux/macOS 用 `sha256sum`，Windows 用 `Get-FileHash`（PowerShell），含平台检测逻辑
- **[增量评估]** `references/eval-state.md` 换行符处理新增三种方案（`.gitattributes`、规范化计算、警告标注），解决 LF/CRLF 假阳性问题
- **[增量评估]** `references/eval-state.md` 版本兼容策略升级为完整决策树，增加 key 格式变更的迁移说明
- **[多模型]** `references/multi-model.md` 补充策略 C 视角起点不对等的设计说明和仲裁偏差修正规则（严格派 +0.5 修正、分差 ≥3 强制引用原文裁决、最终分不低于最高分 85%）
- **[第三层架构]** `references/layer3-architecture.md` D3(TDD)、D4(三文件)、D8(渐进采用) 新增「适用范围说明」和「不适用时的豁免/折算规则」
- **[自举完整性]** 新增 `SELF_CHECK.md`：对 skill-evaluator 自身按 D1-D8 做自检，证明达到 A 级，列出遗留问题和独立验证计划
- **[元数据]** `references/` 下所有子文档（auto-fix、config、eval-state、layer1-quality、layer2-consistency、layer3-architecture、multi-model）均新增 frontmatter
- **[元数据]** `assets/templates/` 下所有模板文件（10 个）均新增 frontmatter
- **[文档]** `TRAINING.md` 消除与 `SKILL.md` 的重复内容：三层体系描述改为引用，维度详解章节新增指引说明



### Added

- **三层评估体系**：文件质量层（8 维度）→ 分类一致性层（8 维度）→ 体系架构层（12 维度），严格递进执行
- **第一层：文件质量评估**（8 维度）：D1(元数据) 元数据质量、D2(执行引导) 执行引导清晰度、D3(领域知识) 领域知识密度、D4(工作流) 工作流完整性、D5(输入输出) 输入输出清晰度、D6(资源利用) 资源利用、D7(写作质量) 写作质量、D8(范围聚焦) 范围与聚焦
- **第二层：分类一致性评估**（8 维度）：D1(职责边界) 职责边界、D2(术语一致) 术语一致性、D3(交叉引用) 交叉引用、D4(知识覆盖) 知识覆盖度、D5(冗余检测) 冗余检测、D6(层级结构) 层级结构、D7(元数据一致) 元数据一致性、D8(工作流闭环) 工作流闭环
- **第三层：体系架构评估**（12 维度）：D1(模块化) 模块化封装、D2(渐进披露) 渐进式披露、D3(TDD) TDD 工作流、D4(三文件) 三文件模式、D5(技能发现) 技能发现与组合、D6(知识复用) 知识可复用性、D7(设计原则) 技能设计原则、D8(渐进采用) 渐进式采用、D9(规范结构) 规范结构化、D10(按需加载) 按需加载技能、D11(场景适配) 场景适配、D12(持续维护) 规范持续维护
- **分类自动发现**：递归扫描 SKILL.md 识别分类，无需硬编码目录结构
- **评估深度分级**：入口文件/有 frontmatter 子文档完整评估（D1-D8），无 frontmatter 子文档轻量评估（D3+D7）
- **增量评估机制**：基于内容指纹（SHA-256）检测文件变更，跳过未变更文件
- **多模型交叉验证**：策略 A（subagent 并行多模型）→ 策略 B（DeepSeek API 多模型）→ 策略 C（串行多视角），自动降级
- **多 Skill 对比**：并列评分表、优劣势分析、经验总结、排名
- **S/A/B/C/D 等级映射**：S 级（≥9.0）为唯一达标等级
- `references/` 目录：layer1-quality.md、layer2-consistency.md、layer3-architecture.md、eval-state.md、multi-model.md、auto-fix.md、config.md
- `assets/templates/` 目录：按层独立维护的评分标准、Prompt 模板、报告格式
- `scripts/deepseek_chat.py`：DeepSeek API 调用脚本
- 项目发布文件：README.md、README_EN.md、.gitignore、LICENSE
