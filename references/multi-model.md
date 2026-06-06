# 多模型交叉验证

多模型模式下，多个模型独立评估 -> 两两互审 -> 仲裁者综合裁定，提升评估权威性。

> 本文档仅在触发多模型模式时加载。单模型模式无需读取。

---

## 模式触发

**多模型模式**触发条件（满足任一）：
- 用户明确提到：多模型、交叉验证、cross-validate、deep evaluation
- 用户指定了模型列表

**单模型模式**（默认）：用户未提及上述触发词。

---

## 模型配置

### 角色定义

| 角色 | 说明 |
|------|------|
| **主模型（仲裁者）** | 负责最终仲裁综合，给出权威结论 |
| **评估模型列表** | 参与独立评估和交叉互审的模型（>= 2 个） |

### 默认模型

| 角色 | 默认值 |
|------|--------|
| 主模型 | 当前 Agent 自身 |
| 评估模型 | ernie-5.0、sonnet、glm-5.1、minimax-m2.5 |

### 模型选择流程

触发多模型模式后，通过**一轮交互**确认模型配置，然后立即开始评估：

1. 若用户已明确指定模型（如 "用 opus 做主模型，sonnet 和 GLM-5 做评估"），直接使用，**跳过询问**
2. 否则，使用**一次** AskUserQuestion 同时询问两个问题（主模型和评估模型列表）。每个问题定义 2 个预设选项，自动追加的 Other 选项用于自定义输入：
   - **主模型（仲裁者）**：选项 1「当前 Agent」、选项 2「默认配置」→ Other 自定义输入
   - **评估模型列表**：选项 1「默认配置列表」、选项 2「Claude 系列模型」→ Other 自定义输入
3. 用户回复后（或选择使用默认），确认最终模型配置
4. Agent 内部根据确认的模型列表自动判断执行策略，**策略判断过程不向用户展示**

整个流程**最多 2 轮交互**（模型确认 + Token），多数情况下用户点一次"使用默认"即可开始。

> 询问时不要向用户展示策略选项（A/B/C）。策略由 Agent 自动判断。

---

## 执行策略

| 策略 | 说明 | 依赖 |
|------|------|------|
| **A：并行多模型** | subagent 并行独立评估 | Agent 工具 + model 参数 |
| **B：API 多模型** | 千帆 API 并行调用 | Bash + Python + 千帆 Token |
| **A+B：混合模式** | 原生走 subagent，非原生走 API | Agent 工具 + Bash + 千帆 Token |
| **C：串行多视角** | 同一模型以严格派/务实派/专家派三视角评估 | 无外部依赖 |

### 策略选择逻辑

1. **用户主动要求**特定策略 -> 使用指定策略
2. **根据模型列表路由**：
   - 全部是 Agent 原生模型 -> 策略 A
   - 全部是非原生模型 -> 检查千帆 Token -> 可用则 B -> 不可用则 C
   - 混合两类模型 -> 检查千帆 Token -> 可用则 A+B -> 不可用则仅 A
   - 使用默认模型列表 -> 先 A -> 失败则 B -> 降级到 C
3. **运行时降级**：A 执行失败 -> 按上述逻辑降级

策略路由和降级对用户透明。

---

## 千帆 API 配置

策略 B 通过百度千帆大模型平台 API 调用模型，需要认证 Token（格式 `bce-v3/...`）。

- **API Endpoint**：默认 `https://qianfan.baidubce.com/v2/chat/completions`

### Token 检测与获取流程

1. **config.json**：读取 Skill 目录下 `config.json` 的 `qianfan_token` 字段，检查是否以 `bce-v3/` 开头。有效则直接使用，**跳过后续所有检测和询问**
2. **环境变量**：通过 Bash 执行 `echo $QIANFAN_BEARER_TOKEN`，若已设置则自动写入 config.json 持久化（下次直接从配置读取）
3. **询问用户**：上述均未获取到时，通过 AskUserQuestion 提示用户。定义两个显式选项：「已手动配置，再次检测」和「跳过」。自动追加的 Other 选项用于直接粘贴 Token（`bce-v3/...` 格式）。选择「再次检测」时重新执行 `echo $QIANFAN_BEARER_TOKEN`；选择「跳过」时降级到无需千帆的策略
4. **持久化**：用户通过 Other 粘贴 Token 后，自动写入 config.json 持久化，后续评估不再询问
5. **传递方式**：获取到 Token 后，每次调用 `scripts/qianfan_chat.py` 时**必须通过 `--token` 参数传入**（Bash 工具每次调用都是独立 shell，`export` 不会跨调用持久化）

### config.json 格式

```json
{
  "qianfan_token": "bce-v3/..."
}
```

### 读写方式

```bash
# 读取
python3 -c "import json; c=json.load(open('<SKILL_DIR>/config.json')); print(c.get('qianfan_token',''))"

# 写入
python3 -c "import json,os; p='<SKILL_DIR>/config.json'; c=json.load(open(p)) if os.path.exists(p) else {}; c['qianfan_token']='<TOKEN>'; json.dump(c,open(p,'w'),indent=2)"
```

---

## 策略 A：并行多模型

### 步骤 1：并行独立评估

对模型列表中每个模型，使用 Agent 工具并行 spawn subagent：
- `model` 参数设为对应模型
- 所有 subagent 同一轮派发
- Prompt：读取 `templates/prompts.md`「独立评估 Prompt」，填充 Skill 内容 + `templates/dimensions.md` 评分标准

### 步骤 2：两两交叉互审

每个模型审查其他模型的评估结果：
- 使用 Agent 工具并行 spawn cross-review subagent
- Prompt：读取 `templates/prompts.md`「交叉互审 Prompt」

### 步骤 3：仲裁综合

主 Agent 自身执行仲裁。

**仲裁规则**：
1. **一致**（所有模型分差 <= 1）：取平均值，共识度"一致"
2. **多数**（多数接近，个别偏离 >= 2）：采纳多数平均值，共识度"多数"
3. **仲裁**（分歧严重）：采纳论据最充分的评分，共识度"仲裁"

---

## 策略 B：API 多模型

### 前置检查

按千帆 API 配置章节获取 Token。

### 步骤 1：并行 API 独立评估

1. 构造评估 prompt，填充后写入临时文件
2. 批量并行调用：
```bash
python3 scripts/qianfan_chat.py \
  --models ernie-5.0,deepseek-v3.2,qwen3.5,glm-5.1 \
  --prompt-file /tmp/eval_prompt.txt \
  --token "<Token>"
```
3. 解析 JSON 结果，error 的模型重试一次

### 步骤 2：API 交叉互审

每个模型构造各自的交叉互审 prompt，并行调用：
```bash
python3 scripts/qianfan_chat.py \
  --prompt-files ernie-5.0:/tmp/review_ernie.txt,deepseek-v3.2:/tmp/review_deepseek.txt \
  --token "<Token>"
```

### 步骤 3：仲裁综合

仲裁规则与策略 A 一致。

---

## 策略 A+B：混合模式

模型列表中同时包含原生和非原生模型时并行使用两种通道。

1. **原生模型组**：策略 A 方式，Agent 工具 spawn subagent
2. **非原生模型组**：策略 B 方式，千帆 API 调用
3. 两组同一轮并行发起
4. 交叉互审和仲裁规则与策略 A 一致

---

## 策略 C：串行多视角

策略 A/B 均不可用时自动启用，或用户主动要求。

### 步骤 1：串行多视角独立评估

依次以 3 个视角评估。读取 `templates/prompts.md`「视角评估模板」：

- **严格派**：挑剔眼光，关注缺失项，6 分起步
- **务实派**：关注实际可用性，7 分起步
- **专家派**：关注专业深度，对 D3/D4 特别敏感

每个视角严格遵循该视角的评审倾向，不受前一视角影响。

### 步骤 2：自我交叉审查

3 视角评估完成后，按 `templates/prompts.md`「自我交叉审查模板」对比，找出分差 >= 2 的维度。

### 步骤 3：综合仲裁

仲裁规则与策略 A 一致。

---

## 报告格式

多模型/多视角报告格式详见 `templates/report-formats.md`。

核心区别：报告需包含各模型/视角的独立评分、交叉验证要点、最终仲裁结论（含共识度标记）。

---

## 成本提示

| 策略 | Token 消耗 |
|------|-----------|
| A | 约为单模型模式的 7 倍（3 独立 + 3 互审 + 1 仲裁） |
| B | 千帆平台计费 |
| C | 约为单模型模式的 4-5 倍 |