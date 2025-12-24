@echo off
chcp 65001 >nul
echo ========================================
echo   Starting Kidzania Development Server
echo ========================================
echo.

REM Check if JSON Server is already running
netstat -an | find "3001" | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo [INFO] JSON Server is already running on port 3001
) else (
    echo [1/2] Starting JSON Server on port 3001...
    start "JSON Server - Port 3001" cmd /k "title JSON Server - Port 3001 && npm run api"
    echo [INFO] Waiting for JSON Server to start...
    timeout /t 3 /nobreak >nul
    
    REM Verify JSON Server is running
    netstat -an | find "3001" | find "LISTENING" >nul
    if %errorlevel% == 0 (
        echo [SUCCESS] JSON Server started successfully!
    ) else (
        echo [WARNING] JSON Server may not have started. Continuing anyway...
    )
)

echo.
echo ========================================
echo   [2/2] Starting Vite Dev Server...
echo ========================================
echo.
echo [INFO] JSON Server: http://localhost:3001
echo [INFO] API Endpoint: http://localhost:3001/api-data
echo [INFO] Dev Server will start on: http://localhost:5173
echo.
echo ========================================
echo.

call npm run dev

pause
