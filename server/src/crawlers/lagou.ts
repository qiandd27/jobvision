import { chromium } from 'playwright';
import { getDb } from '../db/connection.js';

async function getBrowser() { return chromium.launch({ headless: true, args: ['--no-sandbox'] }); }
function delay(min=2000,max=6000) { return new Promise(r=>setTimeout(r,Math.random()*(max-min)+min)); }
function parseSalary(text: string): {min:number;max:number} { const m = text.match(/(\d+)\s*[kK]-?\s*(\d+)\s*[kK]/); if(m) return {min:parseInt(m[1]),max:parseInt(m[2])}; return {min:10,max:25}; }

export async function crawlLagouJobs(city:string, keyword:string, maxPages=2) {
  const db = getDb();
  const result = { total:0, newJobs:0, updated:0, errors:[] as string[] };
  const browser = await getBrowser();
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    for(let p=1; p<=maxPages; p++) {
      const url = `https://www.lagou.com/wn/zhaopin?city=${encodeURIComponent(city)}&kd=${encodeURIComponent(keyword)}&pn=${p}`;
      try {
        await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
        await delay(2000,4000);
        const jobs = await page.evaluate(()=>{const items=document.querySelectorAll('.job-list-box li,.s_position_list .item_con_list li,.job-card');return Array.from(items).map(c=>({title:c.querySelector('.p_top__name,.position_link,.job-name')?.textContent?.trim()||'',company:c.querySelector('.company__name,.company-name')?.textContent?.trim()||'',salary:c.querySelector('.money,.salary')?.textContent?.trim()||'',href:(c.querySelector('a')?.getAttribute('href')||'').replace('//','https://')})).filter(j=>j.title&&j.company)});
        const insert = db.prepare('INSERT OR REPLACE INTO jobs (id,title,company_name,city,salary_min,salary_max,salary_months,experience,education,tags,description,source_url,source,posted_at,match_score,risk_level) VALUES (?,?,?,?,?,?,12,"不限","不限","[]","",?,"lagou",datetime("now"),50,"green")');
        for(const j of jobs) {
          const {min,max} = parseSalary(j.salary);
          const id = 'lagou-'+(j.href.split('/').pop()?.slice(0,16)||Date.now().toString(36));
          if(db.prepare('SELECT id FROM jobs WHERE id=?').get(id)){result.updated++;continue;}
          insert.run(id,j.title,j.company,city,min,max,j.href);
          result.newJobs++;
        }
        result.total+=jobs.length;
        await delay(2000,4000);
      } catch(e) { result.errors.push(`Lagou p${p}: ${(e as Error).message}`); }
    }
  } finally { await ctx.close(); }
  return result;
}
