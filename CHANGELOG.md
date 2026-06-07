# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-06-07

### Added

- **三层评估体系**：文件质量层（8 维度）→ 分类一致性层（8 维度）→ 体系架构层（12 维度），严格递进执行
- **第一层：文件质量评估**（8 维度）：D1 元数据质量、D2 执行引导清晰度、D3 领域知识密度、D4 工作流完整性、D5 输入输出清晰度、D6 资源利用、D7 写作质量、D8 范围与聚焦
- **第二层：分类一致性评估**（8 维度）：D1 职责边界、D2 术语一致性、D3 交叉引用、D4 知识覆盖度、D5 冗余检测、D6 层级结构、D7 元数据一致性、D8 工作流闭环
- **第三层：体系架构评估**（12 维度）：模块化封装、可组合性、知识独立性、可观测性、防御性设计、演进友好、一致性、可测试性、可调试性、文档完整性、边界管理、成熟度评估
- **分类自动发现**：递归扫描 SKILL.md 识别分类，无需硬编码目录结构
- **评估深度分级**：入口文件/有 frontmatter 子文档完整评估（D1-D8），无 frontmatter 子文档轻量评估（D3+D7）
- **增量评估机制**：基于内容指纹（SHA-256）检测文件变更，跳过未变更文件
- **多模型交叉验证**：策略 A（subagent 并行多模型）→ 策略 B（DeepSeek API 多模型）→ 策略 C（串行多视角），自动降级
- **多 Skill 对比**：并列评分表、优劣势分析、经验总结、排名
- **S/A/B/C/D 等级映射**：S 级（≥9.0）为唯一达标等级
- `references/` 目录：layer1-quality.md、layer2-consistency.md、layer3-architecture.md、eval-state.md、multi-model.md
- `templates/` 目录：按层独立维护的评分标准、Prompt 模板、报告格式
- `scripts/deepseek_chat.py`：DeepSeek API 调用脚本
- `ci/` 目录：GitHub Actions 和 GitLab CI 配置
- 项目发布文件：README.md、README_EN.md、.gitignore、LICENSE
