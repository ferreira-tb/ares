@echo off
title Deimos

pyinstaller deimos.spec ^
    --distpath __testpy__ ^
    --workpath __testpy__