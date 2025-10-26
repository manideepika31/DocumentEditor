// Configuration for Document Editor
// This file contains the server URLs for both PC and Phone access

// Your computer's local network IP address (used only for LAN dev)
const SERVER_IP = '192.168.10.39';

// Server ports
const BACKEND_PORT = 4000;
const FRONTEND_PORT = 5175;

// Hosting detection
const host = window.location.hostname;
const isLocalhost = host === 'localhost' || host === '127.0.0.1';
const isGitHubPages = host.endsWith('github.io');

// API and WebSocket endpoints
// - Localhost: use localhost ports
// - GitHub Pages: disable network (static-only mode -> empty strings)
// - LAN (opened via IP): use LAN IP
export const API_BASE_URL = isLocalhost
  ? `http://localhost:${BACKEND_PORT}`
  : isGitHubPages
  ? ''
  : `http://${SERVER_IP}:${BACKEND_PORT}`;

export const WS_URL = isLocalhost
  ? `ws://localhost:${BACKEND_PORT}`
  : isGitHubPages
  ? ''
  : `ws://${SERVER_IP}:${BACKEND_PORT}`;

// Display URLs for user reference (dev hints)
export const URLS = {
  PC: {
    frontend: `http://localhost:${FRONTEND_PORT}`,
    backend: `http://localhost:${BACKEND_PORT}`
  },
  PHONE: {
    frontend: `http://${SERVER_IP}:${FRONTEND_PORT}`,
    backend: `http://${SERVER_IP}:${BACKEND_PORT}`
  },
  PAGES: {
    frontend: `${window.location.origin}${window.location.pathname}`
  }
};

// Log the mode on startup
console.log('📱 Document Editor Mode:', isLocalhost ? 'Localhost' : isGitHubPages ? 'GitHub Pages (static)' : 'LAN');
