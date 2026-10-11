#!/usr/bin/env bash
set -euo pipefail

fail() { echo "::error::$1"; exit 1; }

# Demo governance controls for this static GitHub Pages repository.
# Extend these checks with OPA/Conftest and cloud policies for real infrastructure.

[[ -f README.md ]] || fail 'README.md is required for project ownership and operating guidance.'
[[ -d .github/workflows ]] || fail 'GitHub Actions workflow directory is missing.'

# Ensure workflows do not request broad write permissions at the top level.
if grep -RniE '^permissions:[[:space:]]*(write-all|admin)' .github/workflows; then
  fail 'Broad workflow permissions detected. Use least-privilege job-level permissions.'
fi

# Ensure no obvious private key material is committed in text files.
if grep -RIl --exclude-dir=.git --exclude='*.png' --exclude='*.jpg' \
  'BEGIN .*PRIVATE KEY' .; then
  fail 'Private key marker found in repository. Remove the key and rotate it if real.'
fi

echo 'Policy validation passed: repository documentation exists, workflows are present, and no broad top-level write-all permission or private-key marker was found.'
