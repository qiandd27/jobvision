import { chromium } from 'playwright';
import { getDb } from '../db/connection.js';

let _browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

async function getBrowser() {
  if (!_browser || !_browser.isConnected()) {
    _browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  }
  return _browser;
}

function delay(min = 3000, max = 10000) { return new Promise(r => setTimeout(r, Math.random() * (max - min) + min)); }

function parseSalary(text: string): { min: number; max: number } {
  const m = text.match(/(\d+)\s*[Kk]-?\s*(\d+)\s*[Kk]/);
  if (m) return { min: parseInt(m[1]), max: parseInt(m[2]) };
  return { min: 10, max: 20 };
}

export async function crawlBossJobs(city: string, keyword: string, maxPages = 3) {
  const db = getDb();
  const result = { total: 0, newJobs: 0, updated: 0, errors: [] as string[] };
  const browser = await getBrowser();
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    for (let p = 1; p <= maxPages; p++) {
      const url = `https://www.zhipin.com/web/geek/job?city=${encodeURIComponent(city)}&query=${encodeURIComponent(keyword)}&page=${p}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await delay(3000, 6000);
        await page.waitForSelector('.job-card-wrapper, .job-list-box li', { timeout: 15000 }).catch(() => {
          result.errors.push(`第${p}页未找到岗位列表`);
        });
        const jobs = await page.evaluate(() => {
          const cards = document.querySelectorAll('.job-card-wrapper, .job-list-box li');
          return Array.from(cards).map(c => ({
            title: c.querySelector('.job-name')?.textContent?.trim() || '',
            companyName: c.querySelector('.company-name')?.textContent?.trim() || '',
            salaryText: c.querySelector('.salary')?.textContent?.trim() || '',
            href: c.querySelector('a')?.getAttribute('href') || '',
          })).filter(j => j.title && j.companyName);
        });
        const insert = db.prepare('INSERT OR REPLACE INTO jobs (id,title,company_name,city,salary_min,salary_max,salary_months,experience,education,tags,source_url,source,posted_at,match_score,risk_level) VALUES (?,?,?,?,?,?,12,"不限","不限","[]",?,?,"boss",datetime("now"),50,"green")');
        for (const j of jobs) {
          const { min, max } = parseSalary(j.salaryText);
          const id = 'boss-' + j.href.split('/').pop()?.slice(0, 20) || Date.now().toString(36);
          const exists = db.prepare('SELECT id FROM jobs WHERE id=?').get(id);
          if (exists) { result.updated++; continue; }
          insert.run(id, j.title, j.companyName, city, min, max, j.href.startsWith('http') ? j.href : `https://www.zhipin.com${j.href}`, 'boss');
          result.newJobs++;
        }
        result.total += jobs.length;
        await delay(3000, 8000);
      } catch (e) { result.errors.push(`第${p}页: ${(e as Error).message}`); }
    }
  } finally { await ctx.close(); }
  return result;
}

export async function closeBrowser() { if (_browser) { await _browser.close(); _browser = null; } }
