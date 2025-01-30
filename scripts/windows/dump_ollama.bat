@echo off
if exist ".\temp" rmdir /s /q ".\temp"
mkdir ".\temp"
cd ".\temp"
call ollama show --modelfile nemotron-mini:4b > Modelfile
