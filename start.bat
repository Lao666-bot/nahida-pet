@echo off
chcp 65001 >nul
title 草神桌面宠物启动器
color 0A

echo 正在检查 Node.js 环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 未找到 Node.js，请先安装：https://nodejs.org
    pause
    exit /b
)

echo 正在检查 npm 环境...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 未找到 npm，请检查 Node.js 安装。
    pause
    exit /b
)

echo 正在启动代理服务器（端口 3000）...
start "代理服务器" cmd /k "node proxy-server.js"

echo 等待代理启动（3秒）...
ping -n 4 127.0.0.1 >nul

echo 正在尝试启动 Web 服务器...

REM 尝试使用 http-server (通过 npx)
start "Web服务器" cmd /k "npx http-server -p 8080 -o"
if %errorlevel% equ 0 (
    echo http-server 启动成功。
) else (
    echo http-server 启动失败，尝试使用 Python 内置服务器...
    REM 检查 Python 是否可用
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        start "Web服务器(Python)" cmd /k "python -m http.server 8080"
        echo Python 服务器启动在端口 8080。
    ) else (
        echo 错误：无法启动 Web 服务器，请确保安装了 http-server 或 Python。
        pause
        exit /b
    )
)

echo 等待 Web 服务器启动（2秒）...
ping -n 3 127.0.0.1 >nul

echo 正在打开浏览器...
start http://localhost:8080

echo 所有服务已启动！
echo 请保持所有命令行窗口打开，关闭它们服务即停止。
echo.
pause