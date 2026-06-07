# RTK Token Savings

Always prefix shell commands with `rtk` when available to reduce token usage by ~89%.

## Supported commands

Prefix these commands with `rtk`:

- `rtk git status` instead of `git status`
- `rtk git log` instead of `git log`
- `rtk git diff` instead of `git diff`
- `rtk git branch` instead of `git branch`
- `rtk find` instead of `find`
- `rtk grep` instead of `grep`
- `rtk ls` instead of `ls`
- `rtk cat` instead of `cat`
- `rtk cargo test` instead of `cargo test`
- `rtk npm test` instead of `npm test`
- `rtk pytest` instead of `pytest`

## When NOT to use rtk

- Commands that need raw output for piping: use `RTK_DISABLED=1 <command>`
- Commands not in the rtk rewrite registry: just run normally
- `git add`, `git commit`, `git push` and other write operations: no need for rtk

## Verify

Run `rtk gain` to check token savings for the current project.
