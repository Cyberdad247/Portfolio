@echo off
echo [CLIProxyAPI] Starting Ollama...
start /B ollama serve
timeout /t 3 /nobreak >nul

echo [CLIProxyAPI] Starting LiteLLM Proxy on :8080...
set GEMINI_API_KEY=AIzaSyA1hIA66RSIahn2XvqfuBFTQIK4Zym1MwRk8
set MISTRAL_API_KEY=cmdDR9fGHn3nLs0BgGDQIK4Zym1MwRk8

litellm --config "%~dp0config.yaml" --port 8080 --host 0.0.0.0

echo [CLIProxyAPI] Proxy is live at http://localhost:8080
pause
