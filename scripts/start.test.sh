#!/bin/bash
cd "$(dirname "$0")" || exit
./end.sh

source /etc/profile.d/bun.sh # set PATH for bun

NODE_ENV=test bun --bun dist/index.js > out.log &
echo $! > run.pid

PID=$(cat run.pid)
echo 'new pid:'"$PID"
