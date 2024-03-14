#!/bin/bash

# 前回のビルド結果と今回のコードのハッシュを比較する
previous_hash=$(cat .buildhash 2>/dev/null)
current_hash=$(git rev-parse HEAD)

# ハッシュが一致する場合はビルドをスキップする
if [ "$previous_hash" == "$current_hash" ]; then
  echo "No changes detected, skipping build."
#  read -p "Hit enter: "
  npm start
  exit 0
fi

# ハッシュが異なる場合はビルドを実行する
echo "Changes detected, building..."
#read -p "Hit enter: "
# ビルドコマンドを実行する（例えば、npm run build）
npm run build
# 現在のハッシュを保存する
echo "$current_hash" > .buildhash

npm start
