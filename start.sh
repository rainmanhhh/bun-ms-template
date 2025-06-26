#!/bin/bash
cd "$(dirname "$0")" || exit
./end.sh

NODE_ENV=production bun --bun dist/index.js > out.log &
echo $! > run.pid

PID=$(cat run.pid)
echo 'new pid:'"$PID"
