// Lightweight config for API and WebSocket endpoints
const SERVER_IP = '192.168.10.39';
const BACKEND_PORT = 4000;
const host = window.location.hostname;
const isLocalhost = host === 'localhost' || host === '127.0.0.1';
const isGitHubPages = host.endsWith('github.io');

// Prefer explicit env for deployments
const ENV_API = (import.meta as any).env?.VITE_API_URL as string | undefined;
const ENV_WS = (import.meta as any).env?.VITE_WS_URL as string | undefined;

export const API_BASE_URL = ENV_API
  ?? (isLocalhost ? `http://localhost:${BACKEND_PORT}` : isGitHubPages ? '' : `http://${SERVER_IP}:${BACKEND_PORT}`);

export const WS_URL = ENV_WS
  ?? (isLocalhost ? `ws://localhost:${BACKEND_PORT}` : isGitHubPages ? '' : `ws://${SERVER_IP}:${BACKEND_PORT}`);
