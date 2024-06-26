#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
yarn build

# git add -A -f
# git commit -m 'deploy'
# git push origin test-page

git add dist 
git commit -m "测试部署"
git subtree push --prefix dist origin test-page