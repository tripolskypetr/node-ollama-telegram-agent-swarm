#!/bin/bash
if [ -d "./temp" ]; then
  cd "./temp"
fi
ollama create local-model -f ./Modelfile
echo local-model created ok
