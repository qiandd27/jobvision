import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const status = req.query.status as string|undefined;
  const rows = status
    ? db.prepare('SELECT a.*,j.title,j.company_name,j.city,j.salary_min,j.salary_max FROM applications a LEFT JOIN jobs j ON a.job_id=j.id WHERE a.status=? ORDER BY a.updated_at DESC').all(status) as any[]
    : db.prepare('SELECT a.*,j.title,j.company_name,j.city,j.salary_min,j.salary_max FROM applications a LEFT JOIN jobs j ON a.job_id=j.id ORDER BY a.updated_at DESC').all() as any[];
  res.json({ data: rows.map(r=>({ id: r.id, jobId: r.job_id, jobSnapshot: { title: r.title, companyName: r.company_name, city: r.city, salaryMin: r.salary_min, salaryMax: r.salary_max }, status: r.status, appliedAt: r.applied_at, updatedAt: r.updated_at, notes: r.notes, followUpDate: r.follow_up_date, interviewDate: r.interview_date })) });
});

router.post('/', (req, res) => {
  const { job_id, notes } = z.object({ job_id: z.string(), notes: z.string().optional().default('') }).parse(req.body);
  const db = getDb();
  const job = db.prepare('SELECT id,title,company_name,city,salary_min,salary_max FROM jobs WHERE id=?').get(job_id) as any;
  if (!job) { res.status(404).json({ error: 'Not found' }); return; }
  if (db.prepare('SELECT id FROM applications WHERE job_id=?').get(job_id)) { res.status(409).json({ error: 'Already applied' }); return; }
  const id = `app-${Date.now()}`;
  db.prepare('INSERT INTO applications (id,job_id,job_snapshot,status,notes) VALUES (?,?,?,?,?)').run(id, job_id, JSON.stringify({title:job.title,companyName:job.company_name,city:job.city,salaryMin:job.salary_min,salaryMax:job.salary_max}), 'applied', notes);
  res.status(201).json({ id, status: 'applied' });
});

router.patch('/:id/status', (req, res) => {
  const { status } = z.object({ status: z.enum(['saved','applied','viewed','interview','offer','rejected','archived']) }).parse(req.body);
  const r = getDb().prepare('UPDATE applications SET status=?,updated_at=datetime("now") WHERE id=?').run(status, req.params.id);
  if (r.changes === 0) { res.status(404).json({ error: 'Not found' }); return; }
  res.json({ success: true, status });
});

router.delete('/:id', (req, res) => {
  const r = getDb().prepare('DELETE FROM applications WHERE id=?').run(req.params.id);
  if (r.changes === 0) { res.status(404).json({ error: 'Not found' }); return; }
  res.json({ success: true });
});

export default router;
