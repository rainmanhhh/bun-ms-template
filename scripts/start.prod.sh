#!/bin/bash
CWD=$(readlink -f "$(dirname "$0")")
cd $CWD || exit
./end.sh

source /etc/profile.d/bun.sh # set PATH for bun

NODE_ENV=production bun --cwd=$CWD --bun dist/index.js > out.log &
echo $! > run.pid

PID=$(cat run.pid)
echo 'new pid:'"$PID"
