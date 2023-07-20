#!/bin/sh

# ...... while ............ 1-100
num=1
while [ $num -le 100 ]; do
  echo "this progress steps: ${num}/100"
  num=$((num+1))

  sleep 0.1
done


echo "this images output path: output/3-apple.png"

sleep 1

echo "this images output path:output/12-apple.png"

sleep 1