#!/bin/bash
if [ -d "./temp" ]; then
  rm -rf "./temp"
fi
mkdir "./temp"
cd "./temp"
ollama show --modelfile nemotron-mini:4b > Modelfile
