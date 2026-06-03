import { getDb } from './connection.js';

export function initSchema(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, company_name TEXT NOT NULL, company_id TEXT,
      city TEXT NOT NULL, district TEXT, salary_min INTEGER NOT NULL, salary_max INTEGER NOT NULL,
      salary_months INTEGER DEFAULT 12, experience TEXT, education TEXT, tags TEXT DEFAULT '[]',
      description TEXT DEFAULT '', source_url TEXT DEFAULT '', source TEXT DEFAULT 'manual',
      posted_at TEXT DEFAULT (datetime('now')), match_score INTEGER DEFAULT 0, risk_level TEXT DEFAULT 'green',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, short_name TEXT, industry TEXT DEFAULT '互联网/IT',
      size TEXT DEFAULT '', registered_capital TEXT, established_at TEXT, address TEXT,
      risk_level TEXT DEFAULT 'green', risk_factors TEXT DEFAULT '[]',
      employee_review_summary TEXT DEFAULT '', anti_overtime_index INTEGER DEFAULT 50, logo TEXT
    );
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY, job_id TEXT NOT NULL REFERENCES jobs(id),
      job_snapshot TEXT DEFAULT '{}', status TEXT NOT NULL DEFAULT 'applied',
      applied_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')),
      notes TEXT DEFAULT '', resume_version TEXT, follow_up_date TEXT, interview_date TEXT
    );
    CREATE TABLE IF NOT EXISTS user_profile (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS resume_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT, raw_text TEXT DEFAULT '',
      structured_data TEXT DEFAULT '{}', score INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  console.log('[DB] Schema initialized');
}
