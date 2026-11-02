#!/usr/bin/env bash
# Cross-platform runner for push-env.js
# Works on Linux, macOS, and Windows (Git Bash / WSL / MSYS2)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v node &> /dev/null; then
  node "${SCRIPT_DIR}/push-env.js" "$@"
elif command -v bun &> /dev/null; then
  bun "${SCRIPT_DIR}/push-env.js" "$@"
else
  echo "Error: Node.js or Bun is required to run this script."
  exit 1
fi
