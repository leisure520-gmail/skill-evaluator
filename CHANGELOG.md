# Changelog

All notable changes to this project will be documented in this file.

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