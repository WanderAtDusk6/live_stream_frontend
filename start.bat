@echo off
cd /d "d:\projects\tsubasa_studio\virtual_character\live_stream_frontend"
echo Building production version...
echo 正在构建生产版本...
echo.
call pnpm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Press any key to exit...
    pause >nul
    exit /b 1
)
echo.
echo Starting production server...
echo 启动生产服务器...
echo.
echo Open your browser and go to: http://localhost:3002/live_stream_ui
echo 在浏览器中打开: http://localhost:3002/live_stream_ui
echo.
start http://localhost:3002/live_stream_ui
call npx next start -p 3002