@echo off
chcp 65001
cd /d "d:\projects\tsubasa_studio\virtual_character\live_stream_frontend"

echo Cleaning up port 3003...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3003 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Building production version...
pnpm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Starting server on port 3003...
start http://localhost:3003/live_stream_ui
npx next start -p 3003