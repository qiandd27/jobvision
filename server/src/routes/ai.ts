import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/connection.js';
import { analyzeResumeLocally, generateQuestionsLocally, analyzeJobSWOTLocally } from '../ai/analyzer.js';

const router = Router();

router.post('/analyze-resume', (req, res) => {
  const { resumeText, jobId, jobTitle, jobDescription } = z.object({
    resumeText: z.string().min(10), jobId: z.string().optional(),
    jobTitle: z.string().optional().default(''), jobDescription: z.string().optional().default('')
  }).parse(req.body);
  let jt = jobTitle, jd = jobDescription;
  if (jobId) { const job = getDb().prepare('SELECT title, description FROM jobs WHERE id=?').get(jobId) as any; if (job) { jt = job.title; jd = job.description; } }
  res.json(analyzeResumeLocally(resumeText, jt, jd));
});

router.post('/interview-questions', (req, res) => {
  const { jobId, jobTitle, jobDescription } = z.object({
    jobId: z.string().optional(), jobTitle: z.string().optional().default(''), jobDescription: z.string().optional().default('')
  }).parse(req.body);
  let jt = jobTitle, jd = jobDescription;
  if (jobId) { const job = getDb().prepare('SELECT title, description FROM jobs WHERE id=?').get(jobId) as any; if (job) { jt = job.title; jd = job.description; } }
  const questions = generateQuestionsLocally(jt, jd);
  res.json({ questions, total: questions.length });
});

router.post('/job-swot', (req, res) => {
  const { jobId, jobTitle, jobDescription, companyIndustry, riskLevel } = z.object({
    jobId: z.string().optional(), jobTitle: z.string().optional().default(''),
    jobDescription: z.string().optional().default(''), companyIndustry: z.string().optional().default('互联网/IT'),
    riskLevel: z.string().optional().default('green')
  }).parse(req.body);
  let jt = jobTitle, jd = jobDescription, ci = companyIndustry, rl = riskLevel;
  if (jobId) {
    const job = getDb().prepare('SELECT j.title,j.description,j.risk_level,c.industry FROM jobs j LEFT JOIN companies c ON j.company_id=c.id WHERE j.id=?').get(jobId) as any;
    if (job) { jt = job.title; jd = job.description || ''; rl = job.risk_level || 'green'; ci = job.industry || '互联网/IT'; }
  }
  res.json(analyzeJobSWOTLocally(jt, jd, ci, rl));
});

export default router;
