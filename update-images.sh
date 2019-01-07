#!/bin/bash

for FILE in `find ./src -name *.piskel`; do
  DIR=$(echo "$FILE" | grep ".*/" -o)
  BASENAME=$(basename "$FILE")
  pushd "$DIR"
  npx piskel-cli $BASENAME
  popd
done
