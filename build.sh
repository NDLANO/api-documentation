#!/bin/bash
set -euo pipefail

# Usage:
#   ./build.sh [VERSION] [additional docker build args...]
# Example:
#   ./build.sh 1.2.3 --no-cache
#
# VERSION defaults to SNAPSHOT if omitted.

VERSION="${1:-SNAPSHOT}"
# Shift off version if provided so "$@" contains only extra docker build args
if [ $# -gt 0 ]; then
  shift
fi

source ./build.properties
PROJECT="$NDLAOrganization/$NDLAComponentName"

echo "==> Building TypeScript sources"
yarn install --frozen-lockfile
yarn build

echo "==> Building Docker image $PROJECT:$VERSION"
docker build \
  -t "$PROJECT:$VERSION" \
  "$@" \
  .

echo "BUILT $PROJECT:$VERSION"
