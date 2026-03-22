#!/bin/bash
# Start CLIProxyAPI (LiteLLM Proxy) on port 8080
# Ensure Ollama is running first

echo "[CLIProxyAPI] Starting Ollama..."
ollama serve &
sleep 2

echo "[CLIProxyAPI] Starting LiteLLM Proxy on :8080..."
export GEMINI_API_KEY="${GEMINI_API_KEY:-AIzaSyA1hIA66RSIahn2XvqfuBFTQIK4Zym1MwRk8}"
export MISTRAL_API_KEY="${MISTRAL_API_KEY:-cmdDR9fGHn3nLs0BgGDQIK4Zym1MwRk8}"

litellm --config "$(dirname "$0")/config.yaml" --port 8080 --host 0.0.0.0

echo "[CLIProxyAPI] Proxy is live at http://localhost:8080"
