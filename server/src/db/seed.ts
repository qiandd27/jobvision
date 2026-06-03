import { getDb } from './connection.js';
import { initSchema } from './schema.js';

export function seedIfEmpty(): void {
  initSchema();
  const db = getDb();
  const { count } = db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number };
  if (count > 0) return;
  console.log('[DB] Seeding initial data...');
  const companies = [
    ['comp-01','字节跳动','字节','互联网/IT','10000人以上','green','[]','技术氛围好，成长快',30],
    ['comp-02','美团','美团','互联网/IT','10000人以上','green','[]','业务稳定，福利完善',55],
    ['comp-03','理想汽车','理想','制造','5000-9999人','yellow','["加班严重"]','新能源风口',35],
    ['comp-04','蚂蚁集团','蚂蚁','金融','10000人以上','yellow','["裁员频繁"]','金融科技头部',40],
    ['comp-05','网易','网易','互联网/IT','10000人以上','green','[]','WLB好',75],
    ['comp-06','小红书','小红书','互联网/IT','5000-9999人','green','[]','增长快',50],
    ['comp-07','哔哩哔哩','B站','互联网/IT','5000-9999人','yellow','["裁员频繁"]','社区文化好',45],
    ['comp-08','平安科技','平安','金融','10000人以上','yellow','["合同纠纷"]','稳定',70],
    ['comp-09','好未来','好未来','教育','5000-9999人','red','["裁员频繁","经营异常"]','受政策影响',20],
    ['comp-10','迈瑞医疗','迈瑞','医疗','10000人以上','green','[]','医疗器械龙头',65],
  ];
  const insertC = db.prepare('INSERT INTO companies (id,name,short_name,industry,size,risk_level,risk_factors,employee_review_summary,anti_overtime_index) VALUES (?,?,?,?,?,?,?,?,?)');
  for (const c of companies) insertC.run(...c);

  const cities = ['北京','上海','广州','深圳','杭州'];
  const titles = ['高级前端工程师','后端开发工程师','全栈工程师','数据分析师','AI应用工程师','产品经理','DevOps工程师'];
  const companyNames = ['字节跳动','美团','网易','小红书','理想汽车','蚂蚁集团','平安科技','好未来','迈瑞医疗'];
  const companyIds = ['comp-01','comp-02','comp-05','comp-06','comp-03','comp-04','comp-08','comp-09','comp-10'];
  const insertJ = db.prepare('INSERT INTO jobs (id,title,company_name,company_id,city,salary_min,salary_max,salary_months,experience,education,tags,description,source_url,source,posted_at,match_score,risk_level) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');

  const insertAll = db.transaction(() => {
    for (let i = 0; i < 30; i++) {
      const cIdx = i % companyNames.length;
      const city = cities[i % cities.length];
      const title = titles[i % titles.length];
      const smin = 15 + Math.floor(Math.random() * 35);
      const smax = smin + 10 + Math.floor(Math.random() * 25);
      const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 30));
      insertJ.run(
        `job-${String(i+1).padStart(3,'0')}`, title, companyNames[cIdx], companyIds[cIdx], city,
        smin, smax, 12 + Math.floor(Math.random() * 4),
        ['1-3年','3-5年','5-10年'][Math.floor(Math.random()*3)],
        ['本科','硕士'][Math.floor(Math.random()*2)],
        JSON.stringify(['双休','五险一金','年终奖','弹性工作','期权'].sort(()=>Math.random()-0.5).slice(0,3)),
        `${title}岗位，负责核心业务开发。`,
        `https://www.zhipin.com/job_detail/${i}.html`,
        ['boss','zhilian','lagou'][Math.floor(Math.random()*3)],
        d.toISOString().split('T')[0],
        40 + Math.floor(Math.random() * 55),
        ['green','green','green','yellow','yellow','red'][Math.floor(Math.random()*6)]
      );
    }
  });
  insertAll();
  console.log('[DB] Seed complete');
}
