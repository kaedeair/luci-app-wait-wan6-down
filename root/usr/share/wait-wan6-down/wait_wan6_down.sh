#!/bin/sh
TIMES=0
MAX_TIMES=$(uci get wait-wan6-down.@wait-wan6-down[0].times)
INTERVAL=$(uci get wait-wan6-down.@wait-wan6-down[0].interval)
while [ "$TIMES" -lt "${MAX_TIMES:-10}" ]; do
  TIMES=$((TIMES + 1 ))
  sleep "${INTERVAL:-1}"
  if ubus -S list "network.interface.wan_6" >/dev/null 2>&1; then
    logger "waiting wan_6 down, try $TIMES times..."
  else
    break
  fi
done