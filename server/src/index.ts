import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedIfEmpty } from './db/seed.js';
import { closeDb } from './db/connection.js';
import jobsRouter from './routes/jobs.js';
import applicationsRouter from './routes/applications.js';
import companiesRouter from './routes/companies.js';
import crawlerRouter from './routes/crawler.js';
import aiRouter from './routes/ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const STATIC_DIR = path.join(__dirname, '..', '..', 'dist');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/crawler', crawlerRouter);
app.use('/api/ai', aiRouter);
app.get('/api/health', (_req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString() }); });
app.use(express.static(STATIC_DIR));
app.get('*', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'index.html')); });

seedIfEmpty();

const server = app.listen(PORT, () => {
  console.log(`[Server] JobVision API running on http://localhost:${PORT}`);
  console.log(`[Server] Static files from: ${STATIC_DIR}`);
});

process.on('SIGINT', () => { closeDb(); server.close(() => process.exit(0)); });
process.on('SIGTERM', () => { closeDb(); server.close(() => process.exit(0)); });
