# skill-evaluator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) | [中文](README.md)

A Skill for evaluating AI Agent Skill quality. Features a **dual-track** design: Track 1 (full-scan 8-dimension quality evaluation) + Track 2 (system architecture 13-dimension evaluation), with strict sequential execution. Supports full file scanning, incremental evaluation, multi-model cross-validation, Qianfan API multi-model calls, and serial multi-perspective fallback. Provides three execution strategies with automatic priority-based degradation, ensuring cross-platform availability.

Compatible with all AI Agent platforms supporting Skill mechanisms, including but not limited to Claude Code, Ducc, etc.

## Features

- **Dual-Track Evaluation** -- Track 1 (full-scan 8 dimensions) + Track 2 (system architecture 13 dimensions), strict sequential execution
- **Full File Scanning** -- Auto-discover all .md files, classify as entry/sub-doc/root, no hardcoded directory structure
- **Incremental Evaluation** -- Skip unchanged files via SHA-256 content fingerprint, only evaluate new/modified files
- **Evaluation Depth Grading** -- Entry files and sub-documents with frontmatter get full evaluation (D1-D8); sub-documents without frontmatter get lightweight evaluation (D3+D7)
- **Multi-Dimensional Scoring** -- 8 weighted dimensions for Track 1, 13 for Track 2, each scored 0-10
- **Grade Mapping** -- Composite scores automatically mapped to S/A/B/C/D grades, S-grade (>= 9.0) is the only passing standard
- **Improvement Suggestions** -- Problem descriptions, impact analysis, and actionable suggestions for each weak dimension
- **Multi-Skill Comparison** -- Side-by-side scoring tables, strength/weakness analysis, and rankings
- **Multi-Model Cross-Validation** -- Independent evaluation by multiple models -> cross-review -> arbitrator final verdict
- **Qianfan API Multi-Model** -- Call multiple real models via Baidu Qianfan platform API, no subagent dependency
- **Serial Multi-Perspective Fallback** -- Automatic switching when strategies A/B are unavailable: same model evaluates from strict/pragmatic/expert perspectives
- **Automatic Strategy Degradation** -- A (subagent parallel) -> B (Qianfan API) -> C (serial multi-perspective), transparent to users

## Dual-Track Evaluation System

```
┌─────────────────────────────────────────────────────────┐
│              Dual-Track Evaluation System                │
├─────────────────────────────────────────────────────────┤
│  Track 1: Full-Scan Quality Evaluation (8 dimensions)    │
│  ├── Target: All entry files (SKILL.md) and sub-docs     │
│  ├── Focus: Is each file well-written?                   │
│  ├── Incremental: Skip unchanged files via fingerprint   │
│  ├── Passing: Composite score >= 9.0 (S-grade)           │
│  └── Not passed -> Fix and re-evaluate, no Track 2       │
│           │                                             │
│           v All files passed                            │
│  Track 2: System Architecture Evaluation (13 dimensions) │
│  ├── Target: Entire Skill system                        │
│  ├── Focus: Is the system well-designed?                │
│  ├── Passing: Weighted score >= 9.0 (S-grade)            │
│  └── Output: Maturity level + improvement roadmap       │
└─────────────────────────────────────────────────────────┘
```

## Evaluation Dimensions

### Track 1: Full-Scan Quality Evaluation (8 dimensions)

| Dimension | Weight | Description |
|---|---|---|
| D1. Metadata Quality | 15% | Quality of `name` and `description` in YAML frontmatter |
| D2. Execution Guidance Clarity | 15% | Whether Agent knows how to execute after loading |
| D3. Domain Knowledge Density | 15% | Whether it embeds expertise beyond general Agent knowledge |
| D4. Workflow Completeness | 15% | End-to-end workflow with branches and exception handling |
| D5. I/O Clarity | 10% | Whether users know what to provide and expect |
| D6. Resource Utilization | 10% | Utilization of scripts, references, assets |
| D7. Writing Quality | 10% | Structure clarity, readability, and precision |
| D8. Scope & Focus | 10% | Focused on a single problem domain |

### Track 2: System Architecture (13 dimensions)

| Dimension | Weight | Description |
|---|---|---|
| D1. Modular Encapsulation | 10% | Skills are independent, testable, composable |
| D2. Progressive Disclosure | 8% | On-demand loading, three-stage (discover->activate->execute) |
| D3. TDD Workflow | 15% | Test-first, RED-GREEN-REFACTOR cycle |
| D4. Three-File Pattern | 7% | plan.md + context.md + tasks.md structured management |
| D5. Skill Discovery & Composition | 8% | Auto-identify task types and recommend/combine skills |
| D6. Knowledge Reusability | 8% | Cross-project reuse, versioning, and quality feedback |
| D7. Skill Design Principles | 8% | Single responsibility, high cohesion, low coupling |
| D8. Progressive Adoption | 5% | 4-stage adoption path with "minimum viable set" |
| D9. Convention Structure | 5% | Quantifiable and verifiable conventions |
| D10. On-Demand Loading | 6% | Context budget management |
| D11. Scenario Adaptation | 10% | Lightweight mode, compliance intensity matches task complexity |
| D12. Continuous Maintenance | 10% | Auto-detection, CHANGELOG, approval workflow |
| D13. Sub-Document Consistency | 5% | Sub-doc frontmatter matches routing table, no orphaned/ghost references |

## Grade Standards

Both tracks share the same grade mapping:

| Score | Grade | Meaning |
|---|---|---|
| 9.0-10 | S | Excellent -- Benchmark Skill (only passing grade) |
| 7.5-8.9 | A | Great -- Ready to use, needs minor polish |
| 6.0-7.4 | B | Acceptable -- Usable but has clear room for improvement |
| 4.0-5.9 | C | Weak -- Needs significant revision |
| 0-3.9 | D | Poor -- Fundamental issues, recommend redesign |

## Installation

### Claude Code / Ducc

```bash
# If the platform supports skill install command
claude skill install skill-evaluator --from github:jasonzhuo/skill-evaluator

# Or manual clone
git clone https://github.com/jasonzhuo/skill-evaluator.git ~/.claude/skills/skill-evaluator
```

### Manual Installation

Copy `SKILL.md` and the `references/`, `templates/`, `scripts/` directories to your Agent's Skill directory. For Claude Code / Ducc:

```bash
git clone https://github.com/jasonzhuo/skill-evaluator.git ~/.claude/skills/skill-evaluator
```

For other Agent platforms, place `SKILL.md` in the corresponding Skill directory.

## Configuration

### Qianfan API (Strategy B)

Strategy B calls multiple real models via Baidu Qianfan platform API. Authentication Token is required. Configure via:

1. **Skill config file** (recommended): Create `config.json` in the Skill directory with `{"qianfan_token": "bce-v3/your-token-here"}`
2. **Environment variable**: `export QIANFAN_BEARER_TOKEN="bce-v3/your-token-here"`

If Token is not configured, Strategy B is unavailable and multi-model mode automatically degrades to Strategy C (serial multi-perspective).

## Usage

Call via slash command (if your Agent supports it):

```
/skill-evaluator
```

Or use natural language:

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
Cross-validate my-awesome-skill using sonnet and GLM-5
```

### Multi-Perspective Mode

```
Evaluate my-awesome-skill using multi-perspective mode
```

### Evaluate Skill System Architecture

```
Evaluate the architecture of my-skill-system
```

## Cross-Validation Flow

Strategies are automatically selected based on execution conditions (A -> B -> C degradation):

- **Strategy A**: Parallel multi-model via subagent (default, best results)
- **Strategy B**: Multi-model via Qianfan API (no subagent dependency)
- **Strategy C**: Serial multi-perspective (fallback, no external dependencies)

## Project Structure

```
skill-evaluator/
├── SKILL.md                              # Main entry (~120 lines, routing + constraints)
├── references/                           # Evaluation docs (loaded on demand)
│   ├── track1-quality.md                 # Track 1: Full-scan quality evaluation
│   ├── track2-architecture.md            # Track 2: 13-dimension architecture evaluation
│   ├── eval-state.md                     # Incremental evaluation state management
│   └── multi-model.md                    # Multi-model cross-validation strategy
├── templates/                            # Reference templates (used by multi-model mode)
│   ├── dimensions.md                     # 8-dimension scoring standards
│   ├── prompts.md                        # Evaluation prompt templates
│   └── report-formats.md                 # Report output format templates
├── scripts/
│   └── qianfan_chat.py                   # Qianfan API call script
├── ci/                                   # CI integration configs
│   ├── github-actions.yml                # GitHub Actions workflow
│   └── gitlab-ci.yml                     # GitLab CI pipeline
├── config.json                           # Qianfan Token config (gitignored)
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
└── README_EN.md
```

## Evaluation Result Persistence

After evaluation, reports are automatically saved as Markdown files:

```
eval-results/
├── eval-state.json                       # Incremental evaluation state file
└── my-awesome-skill/
    ├── track1_2026-06-07_143025.md
    ├── track1_2026-05-20_091500.md
    └── track2_2026-06-07_150030.md
```

- Default save directory: `./eval-results/`, customizable during pre-flight check
- File naming: `{track}_{YYYY-MM-DD_HHmmss}.md`
- Historical trend analysis is automatically generated when previous reports exist

## CI Integration

The project provides GitHub Actions and GitLab CI configurations for automatic evaluation on Skill changes.

### GitHub Actions

Copy `ci/github-actions.yml` to your repository's `.github/workflows/` directory:

```bash
cp ci/github-actions.yml .github/workflows/skill-evaluation.yml
```

Required Secrets:
- `ANTHROPIC_API_KEY`: Claude API key (when using Claude CLI for evaluation)
- `QIANFAN_BEARER_TOKEN`: Qianfan API Token (optional, for Strategy B)

Triggers:
- Push or PR that modifies `SKILL.md` or `references/`, `templates/` directories or any `.md` file
- Supports manual trigger (workflow_dispatch) with custom Skill path

### GitLab CI

Merge `ci/gitlab-ci.yml` content into your `.gitlab-ci.yml`:

```bash
# Append to existing CI config
cat ci/gitlab-ci.yml >> .gitlab-ci.yml
```

Required GitLab CI/CD Variables:
- `QIANFAN_BEARER_TOKEN`: Qianfan API Token (optional)

Triggers:
- Automatically runs when `SKILL.md` or `references/`, `templates/` directories or any `.md` file change
- Evaluation results retained as artifacts for 90 days

## Independence Declaration

This Skill is an independent third-party evaluation tool and does not belong to any evaluated Skill system. Evaluation results are saved outside the evaluated system to avoid self-review.

## Output Examples

### Single-Model Evaluation

```
## Skill Evaluation Report

### Incremental Evaluation Summary

- Evaluation mode: Incremental
- Evaluated files: 8 | Skipped files (unchanged): 42

### java-convention — Composite Score

**Category Average: 8.3 / 10 (Grade A) | Minimum: 7.2 / 10 (Grade B)**

#### Entry File: SKILL.md

**Composite Score: 7.8 / 10 (Grade A)**

| Dimension | Score | Notes |
|-----------|-------|-------|
| D1. Metadata Quality | 8/10 | Clear description with trigger conditions |
| D2. Execution Guidance Clarity | 7/10 | Guidance for most scenarios, missing exception handling |
| D3. Domain Knowledge Density | 9/10 | Rich expert knowledge and best practices |
| D4. Workflow Completeness | 8/10 | Complete multi-step workflow |
| D5. I/O Clarity | 7/10 | Has output format, missing input examples |
| D6. Resource Utilization | 7/10 | N/A -- No supplementary resources needed |
| D7. Writing Quality | 8/10 | Clear structure, smooth logic |
| D8. Scope & Focus | 8/10 | Focused on a single problem domain |

#### Sub-Document Score Overview

| File | Depth | Score | Grade | Main Issue |
|------|-------|-------|-------|------------|
| 01-base-entity.md | Full | 8.5/10 | A | D6 resource underutilization |
| 99-workflows/create.md | Light | 8.0/10 | A | — |

#### Issues & Suggestions

1. **SKILL.md - D2. Execution Guidance Clarity**: Missing exception handling guidance -> Add branching logic for "when user input is incomplete"
2. **SKILL.md - D5. I/O Clarity**: Missing input examples -> Add 2-3 concrete input examples in usage scenarios
```

### Multi-Model Cross-Validation

```
## Skill Evaluation Report (Multi-Model Cross-Validation)

### my-awesome-skill

> Arbitrator: Current Agent | Evaluators: Sonnet, GLM-5, MiniMax

#### Independent Evaluation Results

##### Sonnet Evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| D1. Metadata Quality | 8/10 | ... |
| ... | ... | ... |
| **Composite Score** | **7.9/10 (Grade A)** | |

##### GLM-5 Evaluation

(omitted)

##### MiniMax Evaluation

(omitted)

#### Cross-Validation Highlights

| Dimension | Discrepancy | Details |
|-----------|-------------|---------|
| D3. Domain Knowledge Density | Sonnet(9) vs MiniMax(6) | Sonnet found rich expert knowledge; MiniMax considered depth insufficient |

> 1 dimension with significant discrepancy (diff >= 2), 7 dimensions consistent across all models.

#### Final Arbitration Conclusion

**Final Composite Score: 7.8 / 10 (Grade A)**

| Dimension | Final Score | Consensus | Arbitration Notes |
|-----------|-------------|-----------|-------------------|
| D1. Metadata Quality | 8/10 | Unanimous | All models agree |
| D3. Domain Knowledge Density | 8/10 | Arbitrated | Sonnet and GLM-5 gave 8-9, MiniMax gave 6; adopted majority |
| ... | ... | ... | ... |

#### Issues & Suggestions

1. **D2. Execution Guidance Clarity** (Consensus: Unanimous): Missing exception handling -> Add branching logic
```

## Contributing

Pull Requests are welcome.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT