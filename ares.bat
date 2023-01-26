@echo off
title Ares

pyinstaller api/ares.py ^
    --onefile ^
    --collect-submodules sklearn ^
    --specpath __testpy__ ^
    --distpath __testpy__ ^
    --workpath __testpy__ ^
    --icon ../public/favicon.ico