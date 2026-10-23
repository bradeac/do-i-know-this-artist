#!/bin/bash
# Tests for check-node-version.sh: bash check-node-version.test.sh
cd "$(dirname "$0")"
fail=0
expect() { # <exit 0|1> <arg>
  ./check-node-version.sh "$2" 2>/dev/null; rc=$?
  if [ "$rc" -ne "$1" ]; then echo "FAIL: '$2' exit $rc, want $1"; fail=1; fi
}
expect 1 v20.20.2
expect 1 v22.23.3
expect 1 v22.9.0
expect 0 v22.23.4
expect 0 v22.24.0
expect 0 v22.100.0
expect 1 v24.22.1   # other majors are not accepted
expect 1 ""
expect 1 "not-a-version"
[ "$fail" -eq 0 ] && echo "ok"
exit $fail
