#!/bin/bash

start=$(date +%s)

set -e

reset="\e[0m"
red="\e[0;31m"
green="\e[0;32m"
cyan="\e[0;36m"
white="\e[0;37m"

echo "build source"

rm -rf ./dist
npm run build

cp -R -f ./dist/client/css/* ./dist/client/js/* ./dist
rm -rf ./dist/client

end=$(date +%s)
time=$(( $end - $start ))

echo "fe build in ($time) 秒"