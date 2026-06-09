# skill-evaluator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) | [中文](README.md)

> AI Agent Skill quality evaluator — Three-layer progressive evaluation + Multi-model cross-validation + Incremental evaluation

Compatible with all AI Agent platforms supporting Skill mechanisms, including but not limited to Claude Code, Ducc, etc.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Output Examples](#output-examples)
- [CI Integration](#ci-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Three-Layer Progressive Evaluation** — File quality (8 dims) → Category consistency (8 dims) → System architecture (12 dims), lower layers must pass before advancing
- **Incremental Evaluation** — Skip unchanged files via SHA-256 content fingerprint
- **Multi-Model Cross-Validation** — Independent evaluation → Cross-review → Arbitration, three strategies with automatic degradation (A→B→C)
- **DeepSeek API Multi-Model** — Call multiple real models via DeepSeek API, no subagent dependency
- **Multi-Skill Comparison** — Side-by-side scoring tables, strength/weakness analysis, and rankings
- **S/A/B/C/D Grade Mapping** — S-grade (≥9.0) is the only passing standard
- **Improvement Suggestions** — Problem descriptions, impact analysis, and actionable suggestions for each weak dimension

## Quick Start

### Installation

```bash
# Option 1: skill install (if platform supports)
claude skill install skill-evaluator --from github:jasonzhuo/skill-evaluator

# Option 2: Manual clone
git clone https://github.com/jasonzhuo/skill-evaluator.git ~/.claude/skills/skill-evaluator
```

For other Agent platforms, place `SKILL.md` in the corresponding Skill directory.

### Configuration

Strategy B (DeepSeek API multi-model) requires an API Key. Without it, the system automatically degrades to Strategy C:

```bash
# Option 1: Config file (recommended)
echo '{"deepseek_api_key": "sk-your-api-key-here"}' > config.json

# Option 2: Environment variable
export DEEPSEEK_API_KEY="sk-your-api-key-here"
```

### Basic Usage

Call via slash command (if your Agent supports it):

```
/skill-evaluator
```

Or use natural language:

```
Evaluate my-awesome-skill
```

## Usage

### Evaluate a Single Skill

```
Evaluate the my-awesome-skill Skill
```

### Compare Multiple Skills

```
Compare skill-a and skill-b, which design is better
```

### Evaluate by Path

```
Evaluate the Skill at ~/projects/my-skill/SKILL.md
```

### Multi-Model Cross-Validation

```
Evaluate my-awesome-skill with multi-model cross-validation
```

### Custom Model List

```
Cross-validate my-awesome-skill using sonnet and deepseek-chat
```

### Multi-Perspective Mode

```
Evaluate my-awesome-skill using multi-perspective mode
```

### Evaluate Skill System Architecture

```
Evaluate the architecture of my-skill-system
```

## Architecture

### Three-Layer Evaluation System

```
┌─────────────────────────────────────────────────────────┐
│             Three-Layer Evaluation System                │
├─────────────────────────────────────────────────────────┤
│  Layer 1: File Quality Evaluation (8 dims × all files)  │
│  ├── Focus: Is this file well-written?                  │
│  ├── Target: Each .md file evaluated independently      │
│  ├── Incremental: Skip unchanged files via fingerprint  │
│  ├── Passing: Composite score >= 9.0 (S-grade)          │
│  └── Not passed -> Fix and re-evaluate, no Layer 2      │
│           │                                              │
│           v All files in category passed                 │
│  Layer 2: Category Consistency Evaluation (8 dims × cat) │
│  ├── Focus: Are files within a category coordinated?    │
│  ├── Target: Each category (SKILL.md + sub-docs)        │
│  ├── Checks: Conflicts, overlaps, gaps, refs, terms     │
│  ├── Passing: Composite score >= 9.0 (S-grade)          │
│  └── Not passed -> Fix and re-evaluate, no Layer 3      │
│           │                                              │
│           v All categories passed                        │
│  Layer 3: System Architecture Evaluation (12 dimensions)│
│  ├── Focus: Is the overall system well-designed?        │
│  ├── Target: Entire Skill system                        │
│  ├── Passing: Weighted score >= 9.0 (S-grade)           │
│  └── Output: Maturity level + improvement roadmap      │
└─────────────────────────────────────────────────────────┘
```

### Evaluation Dimensions

#### Layer 1: File Quality Evaluation (8 dimensions)

| Dimension | Weight | Description |
|---|---|---|
| D1(Metadata) | 15% | Quality of `name` and `description` in YAML frontmatter |
| D2(ExecGuide) | 15% | Whether Agent knows how to execute after loading |
| D3(DomainKnow) | 15% | Whether it embeds expertise beyond general Agent knowledge |
| D4(Workflow) | 15% | End-to-end workflow with branches and exception handling |
| D5(IO Clarity) | 10% | Whether users know what to provide and expect |
| D6(Resources) | 10% | Utilization of scripts, references, assets |
| D7(Writing) | 10% | Structure clarity, readability, and precision |
| D8(Scope) | 10% | Focused on a single problem domain |

#### Layer 2: Category Consistency Evaluation (8 dimensions)

| Dimension | Weight | Description |
|---|---|---|
| D1(Boundaries) | 15% | No overlap or gaps in file responsibilities within category |
| D2(Terminology) | 10% | Same concept uses unified terminology across all files |
| D3(CrossRef) | 10% | Inter-file references are correct and reachable |
| D4(Coverage) | 15% | Core scenarios of the category domain are fully covered |
| D5(Redundancy) | 10% | No large-scale duplication across files |
| D6(Hierarchy) | 10% | Consistent numbering/grouping/naming logic |
| D7(MetaMatch) | 15% | Sub-doc frontmatter matches routing table, no orphaned/ghost |
| D8(Closure) | 15% | Workflows declared in entry file are fully covered by sub-docs |

#### Layer 3: System Architecture Evaluation (12 dimensions)

| Dimension | Weight | Description |
|---|---|---|
| D1(Modular) | 10% | Skills are independent, testable, composable |
| D2(ProgDisc) | 8% | On-demand loading, three-stage (discover->activate->execute) |
| D3(TDD) | 12% | Test-first, RED-GREEN-REFACTOR cycle |
| D4(3-File) | 7% | plan.md + context.md + tasks.md structured management |
| D5(Discovery) | 10% | Auto-identify task types and recommend/combine skills |
| D6(Reuse) | 8% | Cross-project reuse, versioning, and quality feedback |
| D7(Design) | 8% | Single responsibility, high cohesion, low coupling |
| D8(ProgAdopt) | 5% | 4-stage adoption path with "minimum viable set" |
| D9(Structure) | 5% | Quantifiable and verifiable conventions |
| D10(OnDemand) | 7% | Context budget management |
| D11(Adapt) | 10% | Lightweight mode, compliance intensity matches task complexity |
| D12(Maintain) | 10% | Auto-detection, CHANGELOG, approval workflow |

### Grade Standards

All three layers share the same grade mapping:

| Score | Grade | Meaning |
|---|---|---|
| 9.0-10 | S | Excellent — Benchmark (only passing grade) |
| 7.5-8.9 | A | Great — Ready to use, needs minor polish |
| 6.0-7.4 | B | Acceptable — Usable but has clear room for improvement |
| 4.0-5.9 | C | Weak — Needs significant revision |
| 0-3.9 | D | Poor — Fundamental issues, recommend redesign |

### Cross-Validation Strategies

Strategies are automatically selected based on execution conditions (A → B → C degradation):

| Strategy | Method | Dependencies | Description |
|----------|--------|-------------|-------------|
| **A** | Subagent parallel multi-model | Agent tools + model parameter | Default, best results |
| **B** | DeepSeek API multi-model | Bash + Python + DeepSeek API Key | No subagent dependency |
| **C** | Serial multi-perspective | No external dependencies | Fallback, same model evaluates from strict/pragmatic/expert perspectives |

**Strategy A Flow**:

```
┌──────────────────────────────────────────────────────┐
│ Confirm model config (arbitrator + evaluator models)  │
├──────────────────────────────────────────────────────┤
│ Stage 1: Parallel independent evaluation               │
│ [Model 1] [Model 2] [Model 3]                        │
├──────────────────────────────────────────────────────┤
│ Stage 2: Pairwise cross-review                        │
│ Each model reviews others, find dimensions with diff>=2│
├──────────────────────────────────────────────────────┤
│ Stage 3: Arbitration                                   │
│ Arbitrator gives final verdict based on consensus/     │
│ majority/arbitration rules                             │
└──────────────────────────────────────────────────────┘
```

## Project Structure

```
skill-evaluator/
├── SKILL.md                              # Main entry (routing + constraints)
├── references/                           # Evaluation docs (loaded on demand)
│   ├── config.md                         # Shared constants
│   ├── layer1-quality.md                 # Layer 1: File quality evaluation
│   ├── layer2-consistency.md             # Layer 2: Category consistency evaluation
│   ├── layer3-architecture.md            # Layer 3: System architecture evaluation
│   ├── eval-state.md                     # Incremental evaluation state management
│   ├── multi-model.md                    # Multi-model cross-validation strategy
│   └── auto-fix.md                       # Auto-fix mechanism
├── assets/                                # Static resources
│   ├── templates/                         # Reference templates (maintained per layer)
│   │   ├── dimensions-*.md                # Scoring standards
│   │   ├── prompts-*.md                   # Prompt templates
│   │   └── report-*.md                    # Report formats
│   └── ci/                                # CI integration configs
│       ├── github-actions.yml             # GitHub Actions workflow
│       └── gitlab-ci.yml                  # GitLab CI pipeline
├── scripts/
│   └── deepseek_chat.py                   # DeepSeek API call script
├── config.json                           # DeepSeek API Key config (gitignored)
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
└── README_EN.md
```

After evaluation, reports are automatically saved to the target Skill's root directory under `eval-results/`, with file naming format `layer{N}_{YYYY-MM-DD_HHmmss}.md`. Historical trend analysis is automatically generated when previous reports exist.

## Output Examples

### Layer 1: File Quality Evaluation

```
## Skill Evaluation Report (Layer 1: File Quality)

### Incremental Evaluation Summary

- Evaluation mode: Incremental
- Evaluated files: 8 | Skipped files (unchanged): 42

### writing-java-code — Composite Score

**Category Average: 8.3 / 10 (Grade A) | Minimum: 7.2 / 10 (Grade B)**

#### Entry File: SKILL.md

**Composite Score: 7.8 / 10 (Grade A)**

| Dimension | Score | Notes |
|-----------|-------|-------|
| D1(Metadata) | 8/10 | Clear description with trigger conditions |
| D2(ExecGuide) | 7/10 | Guidance for most scenarios, missing exception handling |
| D3(DomainKnow) | 9/10 | Rich expert knowledge and best practices |
| D4(Workflow) | 8/10 | Complete multi-step workflow |
| D5(IO Clarity) | 7/10 | Has output format, missing input examples |
| D6(Resources) | 7/10 | N/A -- No supplementary resources needed |
| D7(Writing) | 8/10 | Clear structure, smooth logic |
| D8(Scope) | 8/10 | Focused on a single problem domain |

#### Issues & Suggestions

1. **D2(ExecGuide)**: Missing exception handling guidance -> Add branching logic for "when user input is incomplete"
2. **D5(IO Clarity)**: Missing input examples -> Add 2-3 concrete input examples in usage scenarios
```

### Multi-Model Cross-Validation

```
## Skill Evaluation Report (Layer 1: File Quality — Multi-Model Cross-Validation)

### my-awesome-skill

> Arbitrator: Current Agent | Evaluators: deepseek-chat, deepseek-reasoner, sonnet

#### Cross-Validation Highlights

| Dimension | Discrepancy | Details |
|-----------|-------------|---------|
| D3(DomainKnow) | sonnet(9) vs deepseek-reasoner(6) | sonnet found rich expert knowledge; deepseek-reasoner considered depth insufficient |

> 1 dimension with significant discrepancy (diff >= 2), 7 dimensions consistent across all models.

#### Final Arbitration Conclusion

**Final Composite Score: 7.8 / 10 (Grade A)**

| Dimension | Final Score | Consensus | Arbitration Notes |
|-----------|-------------|-----------|-------------------|
| D1(Metadata) | 8/10 | Unanimous | All models agree |
| D3(DomainKnow) | 8/10 | Arbitrated | sonnet and deepseek-chat gave 8-9, deepseek-reasoner gave 6; adopted majority |
```

## CI Integration

The project provides GitHub Actions and GitLab CI configurations for automatic evaluation on Skill changes.

### GitHub Actions

```bash
cp assets/ci/github-actions.yml .github/workflows/skill-evaluation.yml
```

Required Secrets:
- `ANTHROPIC_API_KEY`: Claude API key (when using Claude CLI for evaluation)
- `DEEPSEEK_API_KEY`: DeepSeek API Key (optional, for Strategy B)

Triggers: Push or PR that modifies `SKILL.md` or `references/`, `assets/templates/` directories or any `.md` file. Supports manual trigger.

### GitLab CI

```bash
cat assets/ci/gitlab-ci.yml >> .gitlab-ci.yml
```

Required GitLab CI/CD Variables:
- `DEEPSEEK_API_KEY`: DeepSeek API Key (optional)

Evaluation results retained as artifacts for 90 days.

## Independence Declaration

This Skill is an independent third-party evaluation tool and does not belong to any evaluated Skill system. Evaluation results are saved outside the evaluated system to avoid self-review.

## Contributing

Pull Requests are welcome.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
