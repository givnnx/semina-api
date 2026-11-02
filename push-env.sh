#!/usr/bin/env bash
# Semina Environment & GitHub Secrets Sync Runner
# Cross-platform: Linux, macOS, Windows (Git Bash / WSL / MSYS2)
exec bash "$(dirname "$0")/scripts/push-env.sh" "$@"
