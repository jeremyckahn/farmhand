#!/bin/bash

for FILE in `git status --short | grep -o "\S*piskel"`; do
  DIR=$(echo "$FILE" | grep ".*/" -o)
  BASENAME=$(basename "$FILE")
  pushd "$DIR"
  npx piskel-cli "$BASENAME"
  popd
done
