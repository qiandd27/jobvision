import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/connection.js';

const router = Router();

router.post('/boss', async (req, res) => {
  const { city, keyword, maxPages } = z.object({ city: z.string().default('北京'), keyword: z.string().default('前端'), maxPages: z.number().min(1).max(10).default(3) }).parse(req.body);
  try {
    const { crawlBossJobs } = await import('../crawlers/boss.js');
    const result = await crawlBossJobs(city, keyword, maxPages);
    res.json(result);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

router.get('/status', (_req, res) => {
  const db = getDb();
  const bossCount = (db.prepare("SELECT COUNT(*) as c FROM jobs WHERE source='boss'").get() as any).c;
  const total = (db.prepare('SELECT COUNT(*) as c FROM jobs').get() as any).c;
  const companies = (db.prepare('SELECT COUNT(*) as c FROM companies').get() as any).c;
  res.json({ jobs: { total, boss: bossCount, manual: total - bossCount }, companies });
});

export default router;
