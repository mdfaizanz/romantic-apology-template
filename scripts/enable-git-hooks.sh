#!/usr/bin/env sh
# POSIX helper to enable repository-local Git hooks
git config core.hooksPath .githooks
echo "core.hooksPath set to .githooks"
if [ -f .githooks/pre-push ]; then
  chmod +x .githooks/pre-push 2>/dev/null || true
  echo "Ensured .githooks/pre-push is executable (if supported)"
fi
