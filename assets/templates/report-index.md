---
name: skill-evaluator/report-index
description: skill-evaluator 模板 — 报告格式路由索引，按层独立维护，修改一层不影响其他层
status: published
version: 1.1.0
parent: skill-evaluator
---

# 输出格式模板（路由）

> 本文件为路由索引，各层报告格式按层独立维护，修改一层不影响其他层。

| 评估层 | 报告格式文件 | 说明 |
|--------|-------------|------|
| 第一层：文件质量评估 | `assets/templates/report-layer1.md` | 单模型 / 多模型 / 多视角三种报告格式 |
| 第二层：分类一致性评估 | `assets/templates/report-layer2.md` | 单模型 / 多模型 / 多视角三种报告格式 |
| 第三层：体系架构评估 | `assets/templates/report-layer3.md` | 仅单模型报告格式 |

---

## 多 Skill 对比格式

评估 2 个及以上 Skill 时，在所有评估完成后附加对比分析。多模型模式下使用仲裁后的最终分数。

### 并列评分表

```
| 分类 | 入口文件得分 | 子文档数量 | 子文档平均分 | 子文档最低分 | 分类综合 |
|------|------------|-----------|------------|------------|---------|
| writing-java-code | 8.5/A | 13 | 7.8/B | 6.5/B | 7.9/B |
| building-vue3-apps | 9.0/S | 9 | 8.2/A | 7.5/A | 8.4/A |
| ... | ... | ... | ... | ... | ... |
```

### 各自优劣势

对每个 Skill 说明：
- 相比其他 Skill **更强**的方面
- 相比其他 Skill **更弱**的方面

### 经验总结

识别共性规律：
- 得分最高的 Skill 做对了什么，值得其他 Skill 借鉴
- 所有被评估 Skill 的共同短板

### 排名

从优到劣排列所有 Skill，每个位次附一句理由。
