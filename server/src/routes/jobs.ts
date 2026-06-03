import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const q = z.object({
    city: z.string().optional(), industry: z.string().optional(), salary_min: z.coerce.number().optional(),
    salary_max: z.coerce.number().optional(), experience: z.string().optional(), education: z.string().optional(),
    keywords: z.string().optional(), match_score_min: z.coerce.number().optional(),
    risk_level: z.enum(['green','yellow','red','all']).optional(), source: z.string().optional(),
    sort_by: z.enum(['match_score','salary','posted_at']).optional().default('posted_at'),
    sort_order: z.enum(['asc','desc']).optional().default('desc'),
    page: z.coerce.number().optional().default(1), page_size: z.coerce.number().optional().default(20),
  }).parse(req.query);

  const conds: string[] = []; const params: unknown[] = [];
  if (q.city) { conds.push('j.city=?'); params.push(q.city); }
  if (q.industry) { conds.push('c.industry=?'); params.push(q.industry); }
  if (q.salary_min) { conds.push('j.salary_max>=?'); params.push(q.salary_min); }
  if (q.salary_max) { conds.push('j.salary_min<=?'); params.push(q.salary_max); }
  if (q.experience && q.experience !== '不限') { conds.push('j.experience=?'); params.push(q.experience); }
  if (q.education && q.education !== '不限') { conds.push('j.education=?'); params.push(q.education); }
  if (q.keywords) { conds.push('(j.title LIKE ? OR j.company_name LIKE ? OR j.description LIKE ?)'); const kw = `%${q.keywords}%`; params.push(kw,kw,kw); }
  if (q.match_score_min) { conds.push('j.match_score>=?'); params.push(q.match_score_min); }
  if (q.risk_level && q.risk_level !== 'all') { conds.push('j.risk_level=?'); params.push(q.risk_level); }
  if (q.source && q.source !== 'all') { conds.push('j.source=?'); params.push(q.source); }
  const where = conds.length > 0 ? `WHERE ${conds.join(' AND ')}` : '';
  const sortCol = q.sort_by === 'salary' ? '(j.salary_min+j.salary_max)/2.0' : q.sort_by === 'match_score' ? 'j.match_score' : 'j.posted_at';
  const { total } = db.prepare(`SELECT COUNT(*) as total FROM jobs j LEFT JOIN companies c ON j.company_id=c.id ${where}`).get(...params) as any;
  const rows = db.prepare(`SELECT j.*, c.industry as company_industry, c.risk_level as company_risk_level FROM jobs j LEFT JOIN companies c ON j.company_id=c.id ${where} ORDER BY ${sortCol} ${q.sort_order} LIMIT ? OFFSET ?`).all(...params, q.page_size, (q.page-1)*q.page_size) as any[];
  res.json({ data: rows.map(rowToJob), pagination: { page: q.page, page_size: q.page_size, total, total_pages: Math.ceil(total/q.page_size) } });
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT j.*,c.industry,c.risk_level as crl,c.short_name,c.size,c.risk_factors,c.employee_review_summary,c.anti_overtime_index FROM jobs j LEFT JOIN companies c ON j.company_id=c.id WHERE j.id=?').get(req.params.id) as any;
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json({ data: rowToJob(row) });
});

router.get('/meta/filters', (_req, res) => {
  const db = getDb();
  res.json({ cities: (db.prepare('SELECT DISTINCT city FROM jobs').all() as any[]).map(r=>r.city), industries: (db.prepare('SELECT DISTINCT industry FROM companies').all() as any[]).map(r=>r.industry), experience_levels: ['应届生','1-3年','3-5年','5-10年','10年以上','不限'], education_levels: ['大专','本科','硕士','博士','不限'] });
});

function rowToJob(row: any) {
  return { id: row.id, title: row.title, companyName: row.company_name, companyId: row.company_id, city: row.city, salaryMin: row.salary_min, salaryMax: row.salary_max, salaryMonths: row.salary_months, experience: row.experience, education: row.education, tags: safeJson(row.tags,[]), description: row.description, sourceUrl: row.source_url, source: row.source, postedAt: row.posted_at, matchScore: row.match_score, riskLevel: row.risk_level, company: row.company_industry ? { industry: row.company_industry, riskLevel: row.crl||row.risk_level, shortName: row.short_name, size: row.size, riskFactors: safeJson(row.risk_factors,[]), employeeReviewSummary: row.employee_review_summary, antiOvertimeIndex: row.anti_overtime_index } : undefined };
}
function safeJson(s: string, fallback: any) { try { return JSON.parse(s); } catch { return fallback; } }
export default router;
