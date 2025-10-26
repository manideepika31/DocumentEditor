import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { startRealtimeServer } from './realtime.js';
import { connectToDatabase } from './db.js';
import documentsRouter from './routes/documents.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/documents', documentsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = http.createServer(app);
startRealtimeServer(server);

// Start server regardless of DB availability; attempt DB connect in background
server.listen(port, '0.0.0.0', () => {
	console.log(`server listening on http://0.0.0.0:${port}`);
	console.log(`Access from phone: http://192.168.10.39:${port}`);
});

connectToDatabase().catch((err) => {
	console.error('failed to connect to MongoDB (server still running)', err);
});


