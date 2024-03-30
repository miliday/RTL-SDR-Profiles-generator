@echo off
cd /d "%~dp0"

echo Checking for updates...
git pull

echo Installing dependencies...
call npm install

:restart
echo Starting the application...
call npm start

echo Press any key to restart generation or close the window to exit...
pause > nul
goto restart
