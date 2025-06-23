#!/bin/bash
cd "$(dirname "$0")" || exit

stop() {
  local FILE="$1"
  touch "$FILE"

  local PID
  PID=$(cat "$FILE")
  if [ "x$PID" != "x" ]; then
    local EXIST
    EXIST=$(ps aux | awk '{print $2}'| grep -w "$PID")
    if [ "x$EXIST" != "x" ]; then
      kill -9 "$PID"
      echo stopped "$PID"
    fi
  fi
}

stop run.pid && echo "" > run.pid
