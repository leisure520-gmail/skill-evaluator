#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DISTRO_ROOT = path.resolve(__dirname, "..");

// 支持命令行参数指定目标路径: node bin/install.js init /path/to/project
const nonOptionArgs = process.argv.slice(3).filter((arg) => !arg.startsWith("--"));
const targetPath = nonOptionArgs[0] || process.cwd();
const TARGET_ROOT = path.resolve(targetPath);

// 安装目标：各 Agent 平台的 skill 目录
const INSTALL_TARGETS = [
  { dir: ".claude/skills/skill-evaluator", name: "Claude Code / Ducc" },
  { dir: ".trae/skills/skill-evaluator", name: "Trae" },
];

// 需要安装的文件和目录
const INSTALL_ENTRIES = [
  "SKILL.md",
  "references",
  "scripts",
  "templates",
];

// 受保护文件（升级时不覆盖）
const PROTECTED_FILES = ["config.json"];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirRecursive(src, dest, protectedFiles = []) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, protectedFiles);
    } else {
      if (protectedFiles.includes(entry.name) && fs.existsSync(destPath)) {
        console.log(`  SKIP (protected): ${path.relative(TARGET_ROOT, destPath)}`);
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`  + ${path.relative(TARGET_ROOT, destPath)}`);
    }
  }
}

function checkPrerequisites() {
  if (!fs.existsSync(TARGET_ROOT)) {
    console.error(`  Target directory does not exist: ${TARGET_ROOT}`);
    process.exit(1);
  }
}

function detectAgentPlatforms() {
  const detected = [];
  if (fs.existsSync(path.join(TARGET_ROOT, ".claude"))) detected.push(".claude");
  if (fs.existsSync(path.join(TARGET_ROOT, ".trae"))) detected.push(".trae");
  return detected;
}

function installTo(targetDir) {
  const destRoot = path.join(TARGET_ROOT, targetDir);

  for (const entry of INSTALL_ENTRIES) {
    const srcPath = path.join(DISTRO_ROOT, entry);
    const destPath = path.join(destRoot, entry);

    if (!fs.existsSync(srcPath)) {
      console.error(`  Source missing: ${entry}`);
      continue;
    }

    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      console.log(`\n  [${entry}/]`);
      copyDirRecursive(srcPath, destPath, PROTECTED_FILES);
    } else {
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
      console.log(`  + ${path.relative(TARGET_ROOT, destPath)}`);
    }
  }
}

function addGitignoreEntry() {
  const gitignorePath = path.join(TARGET_ROOT, ".gitignore");
  const entries = INSTALL_TARGETS.map((t) => t.dir);

  let content = "";
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, "utf-8");
  }

  const lines = content.split("\n");
  let added = false;
  for (const entry of entries) {
    if (!lines.some((line) => line.trim() === entry)) {
      lines.push(entry);
      added = true;
    }
  }

  if (added) {
    fs.writeFileSync(gitignorePath, lines.join("\n") + "\n", "utf-8");
    console.log(`\n  Updated .gitignore`);
  }
}

function main() {
  const command = process.argv[2] || "init";

  console.log("skill-evaluator — Skill 评估工具安装器\n");
  console.log(`  Distro:  ${DISTRO_ROOT}`);
  console.log(`  Target:  ${TARGET_ROOT}\n`);

  if (command === "init" || command === "upgrade") {
    const isUpgrade = command === "upgrade";

    checkPrerequisites();

    // 检测目标平台
    const detected = detectAgentPlatforms();
    let targets = INSTALL_TARGETS;

    // --platform 参数：指定安装到哪个平台
    const platformArg = process.argv.find((arg) => arg.startsWith("--platform="));
    if (platformArg) {
      const platform = platformArg.split("=")[1];
      const target = INSTALL_TARGETS.find((t) => t.dir.includes(platform));
      if (target) {
        targets = [target];
      } else {
        console.error(`  Unknown platform: ${platform}`);
        console.error(`  Available: claude, trae`);
        process.exit(1);
      }
    } else if (detected.length > 0) {
      // 仅安装到检测到的平台
      targets = INSTALL_TARGETS.filter((t) => detected.some((d) => t.dir.startsWith(d)));
      console.log(`  Detected platforms: ${targets.map((t) => t.name).join(", ")}\n`);
    } else {
      // 未检测到任何平台，默认安装到 .claude
      targets = [INSTALL_TARGETS[0]];
      console.log(`  No platform detected, defaulting to ${targets[0].name}\n`);
    }

    if (isUpgrade) {
      for (const target of targets) {
        const destRoot = path.join(TARGET_ROOT, target.dir);
        if (!fs.existsSync(destRoot)) {
          console.error(`  Not installed at ${target.dir}. Run 'init' first.`);
          process.exit(1);
        }
      }
      console.log("  Upgrading skill-evaluator...\n");
    } else {
      for (const target of targets) {
        const destRoot = path.join(TARGET_ROOT, target.dir);
        if (fs.existsSync(destRoot)) {
          console.log(`  Already installed at ${target.dir}. Switching to upgrade mode.\n`);
        }
      }
      console.log("  Installing skill-evaluator...\n");
    }

    for (const target of targets) {
      console.log(`  [${target.name}] -> ${target.dir}`);
      installTo(target.dir);
      console.log("");
    }

    // 首次安装时更新 .gitignore
    if (!isUpgrade) {
      addGitignoreEntry();
    }

    console.log("  Done! Next steps:");
    console.log("");
    console.log("  1. Restart your AI Agent to load the skill");
    console.log("  2. Use /skill-evaluator or ask your agent to evaluate a Skill");
    console.log("");

  } else if (command === "check") {
    console.log("  Checking installation status...\n");

    for (const target of INSTALL_TARGETS) {
      const destRoot = path.join(TARGET_ROOT, target.dir);
      const exists = fs.existsSync(destRoot);
      console.log(`  ${exists ? "OK" : "  "} ${target.name} -> ${target.dir}`);

      if (exists) {
        for (const entry of INSTALL_ENTRIES) {
          const entryPath = path.join(destRoot, entry);
          const entryExists = fs.existsSync(entryPath);
          console.log(`    ${entryExists ? "OK" : "  "} ${entry}`);
        }
      }
    }

  } else {
    console.log("  Usage:");
    console.log("    node bin/install.js init [path]              # Install (default: cwd)");
    console.log("    node bin/install.js init --platform=claude   # Install to .claude only");
    console.log("    node bin/install.js init --platform=trae     # Install to .trae only");
    console.log("    node bin/install.js upgrade [path]           # Upgrade installation");
    console.log("    node bin/install.js check                    # Check installation status");
    process.exit(1);
  }
}

main();
