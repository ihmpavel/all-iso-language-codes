#!/bin/sh

rm -rf build
rm -rf data
yarn generate
yarn tsc
cp -r data/. build/data
npx minify-json build/data
