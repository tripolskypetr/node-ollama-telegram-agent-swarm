@echo off
if exist ".\temp" cd ".\temp"
call ollama create local-model -f .\Modelfile
echo local model created ok
