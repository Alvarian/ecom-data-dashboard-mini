#!/bin/bash

clear

rm -rf ./out
rm -rf ./src-tauri/target

pnpm tauri build --verbose