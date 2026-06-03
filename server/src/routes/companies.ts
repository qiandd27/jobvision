import { Router } from 'express';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM companies ORDER BY name').all() as any[];
  res.json({ data: rows.map(rowToCompany) });
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM companies WHERE id=?').get(req.params.id) as any;
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  const jobs = getDb().prepare('SELECT id,title,city,salary_min,salary_max,posted_at FROM jobs WHERE company_id=?').all(row.id) as any[];
  res.json({ data: { ...rowToCompany(row), jobs: jobs.map((j:any)=>({id:j.id,title:j.title,city:j.city,salaryMin:j.salary_min,salaryMax:j.salary_max,postedAt:j.posted_at})) } });
});

function rowToCompany(row: any) { return { id: row.id, name: row.name, shortName: row.short_name, industry: row.industry, size: row.size, registeredCapital: row.registered_capital, establishedAt: row.established_at, riskLevel: row.risk_level, riskFactors: safeJson(row.risk_factors,[]), employeeReviewSummary: row.employee_review_summary, antiOvertimeIndex: row.anti_overtime_index, logo: row.logo }; }
function safeJson(s: string, fallback: any) { try { return JSON.parse(s); } catch { return fallback; } }
export default router;
