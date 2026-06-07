# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-06-07

### Added

- **全量文件扫描**：评估范围从仅 SKILL.md 扩展为 SKILL.md + 所有子文档
- **增量评估机制**：基于内容指纹（SHA-256）检测文件变更，跳过未变更文件，仅评估新增/修改文件
- **评估状态文件**（eval-state.json）：记录每个文件的指纹、评分、评估时间，支持增量评估
- **评估深度分级**：入口文件和有 frontmatter 的子文档完整评估（D1-D8），无 frontmatter 的子文档轻量评估（D3+D7）
- **自动文件发现**：递归扫描 .md 文件，自动识别入口文件/子文档/根目录文件角色，不硬编码目录结构
- **D13 子文档一致性**：轨道二新增维度，检查子文档 frontmatter 与路由表一致性、孤立文件、幽灵引用
- **分类级评分聚合**：每个分类输出平均分和最低分，达标条件为平均分 >= 9.0 且最低分 >= 7.0
- `references/eval-state.md`：增量评估状态管理文档

### Changed

- SKILL.md 从 v2.0.0 升级至 v3.0.0，评估对象从"单个 SKILL.md"扩展为"全量文件"
- 轨道一从"单文件质量评估"更名为"全量质量评估"
- 轨道二从 12 维度扩展为 13 维度，D1 增加子文档 frontmatter 检查，D2 增加子文档 level 一致性检查
- 轨道二评分权重重新分配，D13 占 5%
- `templates/dimensions.md` 增加轻量评估（D3+D7）评分标准
- `templates/report-formats.md` 增加子文档评分总览表、分类级评分、增量评估摘要
- `templates/prompts.md` 评估 Prompt 扩展为包含入口文件和子文档
- 全局硬性约束增加"全量覆盖"、"增量可追溯"、"不假设体系结构"三条

## [2.0.0] - 2026-06-07

### Added

- 多模型交叉验证能力（策略 A：subagent 并行多模型）
- 千帆 API 多模型调用能力（策略 B）
- 混合模式（策略 A+B）：原生模型 + 千帆 API 并行
- 串行多视角回退模式（策略 C）：严格派/务实派/专家派
- 自动策略降级：A -> B -> C，对用户透明
- 模型配置选择流程，支持自定义主模型和评估模型列表
- 千帆 API Token 持久化配置（config.json）
- `templates/` 目录：dimensions.md、prompts.md、report-formats.md
- `scripts/qianfan_chat.py` 千帆 API 调用脚本
- 多 Skill 对比功能
- 项目发布文件：README.md、README_EN.md、.gitignore、CHANGELOG.md、LICENSE
- 评估结果持久化：自动保存报告到 `eval-results/` 目录
- 历史趋势对比：多次评估同一 Skill 时自动输出分数变化趋势
- CI 集成配置：GitHub Actions 和 GitLab CI 示例（`ci/` 目录）
- SKILL.md「使用场景」章节
- README 输出示例（单模型 + 多模型报告）
- README License Badge 和贡献指南

### Changed

- SKILL.md 从 v1.0.0 升级至 v2.0.0，补充 `order` 字段，增加「使用场景」章节
- 评估模式从单模型扩展为单模型/多模型/多视角三种模式
- 评估流程增加模型配置和策略选择步骤
- 报告格式扩展支持多模型报告和多视角报告
- 统一评分标准：`templates/dimensions.md` 为轨道一唯一评分标准源，`track1-quality.md` 不再重复评分细则
- 统一等级映射：双轨共用 S/A/B/C/D 五级标准，消除轨道二原有的 F 级和不同分界线
- `track1-quality.md` 报告格式改为引用 `templates/report-formats.md`，消除重复
- `templates/` 下三个文件头部注明适用范围为轨道一
- `multi-model.md` 补充模型选择交互细节和 Token 检测流程
- README.md / README_EN.md 增加 License Badge、输出示例和贡献指南

## [1.0.0] - 2026-04-13

### Added

- 双轨制评估体系：轨道一（单文件 8 维度）+ 轨道二（体系架构 12 维度）
- 8 维度单文件质量评估框架
- 12 维度体系架构评估框架
- S/A/B/C/D 等级映射
- 改进建议输出
- 独立性声明与硬性约束