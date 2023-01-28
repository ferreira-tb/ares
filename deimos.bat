@echo off
title Deimos

pyinstaller deimos/main.py ^
    --onefile ^
    --name deimos ^
    --collect-submodules sklearn ^
    --specpath __testpy__ ^
    --distpath __testpy__ ^
    --workpath __testpy__ ^
    --icon ../public/favicon.ico