#!/bin/bash

# https://spinscale.de/posts/2021-10-29-github-actions-updating-github-wiki-after-edit.html

#########
# some debug output to check in case of failures
# also exit on any error
set -xe

cd $1

npm run --silent print:crops > Crops.md

echo "Updated Crops.md"

if [[ `git status --short | wc -l` > 0 ]]; then
  git config --global user.email "github-actions@users.noreply.github.com"
  git config --global user.name "github-actions[bot]"
  git add Crops.md
  git commit -m "Update tables"
  git push origin master
fi
