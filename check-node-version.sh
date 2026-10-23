#!/bin/bash
# Usage: check-node-version.sh <node -v output, e.g. v22.23.4>
# Exit 0 if >= MIN_NODE (Oct 2026 security release, CVE-2026-111497), else 1.
# Only the 22 line is accepted: other majors have different fixed versions.

MIN_NODE="22.23.4"
v="${1#v}"

if [[ ! "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "unparsable node version: '$1'" >&2
  exit 1
fi

if [ "${v%%.*}" -ne "${MIN_NODE%%.*}" ] || [ "$(printf '%s\n%s\n' "$MIN_NODE" "$v" | sort -V | head -1)" != "$MIN_NODE" ]; then
  echo "node $v is not >= $MIN_NODE (22 line)" >&2
  exit 1
fi
