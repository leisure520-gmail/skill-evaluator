#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DISTRO_ROOT = path.resolve(__dirname, "..");
const TARGET_ROOT = process.cwd();

const INSTALL_TARGETS = [
    { dir: ".claude/skills/skill-evaluator", name: "Claude Code / Ducc" },
    { dir: ".trae/skills/skill-evaluator", name: "Trae" },
];

const PROTECTED_FILES = ["config.json"];

function diffFiles(srcDir, destDir, relPath = "") {
    const changes = [];

    if (!fs.existsSync(destDir)) {
        return [{ type: "MISSING", path: relPath || "." }];
    }

    const srcEntries = fs.readdirSync(srcDir, { withFileTypes: true });
    const destEntries = new Set(fs.readdirSync(destDir));

    for (const entry of srcEntries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        const entryRelPath = path.join(relPath, entry.name);

        if (entry.isDirectory()) {
            changes.push(...diffFiles(srcPath, destPath, entryRelPath));
        } else {
            if (PROTECTED_FILES.includes(entry.name)) continue;

            if (!destEntries.has(entry.name)) {
                changes.push({ type: "NEW", path: entryRelPath });
            } else {
                const srcContent = fs.readFileSync(srcPath, "utf-8");
                const destContent = fs.readFileSync(destPath, "utf-8");
                if (srcContent !== destContent) {
                    changes.push({ type: "MODIFIED", path: entryRelPath });
                }
            }
        }
    }

    return changes;
}

function main() {
    console.log("skill-evaluator — Upgrade Check\n");
    console.log(`  Distro:  ${DISTRO_ROOT}`);
    console.log(`  Target:  ${TARGET_ROOT}\n`);

    let hasAnyInstallation = false;

    for (const target of INSTALL_TARGETS) {
        const destRoot = path.join(TARGET_ROOT, target.dir);
        if (!fs.existsSync(destRoot)) continue;

        hasAnyInstallation = true;
        console.log(`  [${target.name}] -> ${target.dir}\n`);

        const allChanges = [];
        const installEntries = ["SKILL.md", "references", "scripts", "assets"];

        for (const entry of installEntries) {
            const srcPath = path.join(DISTRO_ROOT, entry);
            const destPath = path.join(destRoot, entry);
            if (!fs.existsSync(srcPath)) continue;
            allChanges.push(...diffFiles(srcPath, destPath, entry));
        }

        if (allChanges.length === 0) {
            console.log("  All files are up to date.\n");
            continue;
        }

        console.log(`  Found ${allChanges.length} difference(s):\n`);

        const grouped = { NEW: [], MODIFIED: [], MISSING: [] };
        for (const change of allChanges) {
            const group = grouped[change.type] || (grouped[change.type] = []);
            group.push(change);
        }

        if (grouped.NEW.length > 0) {
            console.log("  New files:");
            for (const c of grouped.NEW) console.log(`    + ${c.path}`);
        }
        if (grouped.MODIFIED.length > 0) {
            console.log("  Modified files:");
            for (const c of grouped.MODIFIED) console.log(`    ~ ${c.path}`);
        }
        if (grouped.MISSING.length > 0) {
            console.log("  Missing directories:");
            for (const c of grouped.MISSING) console.log(`    ! ${c.path}`);
        }
        console.log("");
    }

    if (!hasAnyInstallation) {
        console.error("  skill-evaluator is not installed. Run 'node bin/install.js init' first.");
        process.exit(1);
    }

    console.log("  Run 'node bin/install.js upgrade' to apply changes.");
}

main();
