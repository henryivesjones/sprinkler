#!/bin/bash
set -e

cd "${0%/*}"
cd ../sprinkler-ui
echo "Building UI"
npm install
npm run build
cd ..
rm -rf sprinkler/.build/
mkdir sprinkler/.build
cp -r sprinkler-ui/dist/* sprinkler/.build/
python3 -m build
