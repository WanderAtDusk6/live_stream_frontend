@echo off
chcp 65001
cd /d "d:\projects\tsubasa_studio\virtual_character\live_stream_frontend"
echo Building...
pnpm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Starting server on port 3003...
start http://localhost:3003/live_stream_ui
npx next start -p 3003