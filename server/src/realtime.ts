import pkg from 'y-websocket/bin/utils';
const { setupWSConnection } = pkg;
import type { Server as HTTPServer, IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

export function startRealtimeServer(httpServer: HTTPServer): void {
    const wss = new WebSocketServer({ server: httpServer });
    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        setupWSConnection(ws, req);
    });
    console.log('y-websocket realtime server ready');
}


