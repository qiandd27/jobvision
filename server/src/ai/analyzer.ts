const TECH_KEYWORDS: Record<string, string[]> = {
  '前端': ['React','Vue','TypeScript','JavaScript','HTML','CSS','Webpack','Vite','Next.js','Node.js'],
  '后端': ['Java','Go','Python','Spring','MySQL','Redis','Kafka','Docker','K8s','微服务'],
  '算法': ['Python','TensorFlow','PyTorch','深度学习','NLP','CV','机器学习'],
  '数据': ['SQL','Python','Spark','Hive','Flink','ETL','Tableau'],
  '产品': ['PRD','用户研究','数据分析','Axure','Figma','A/B测试'],
};

export function analyzeResumeLocally(resumeText: string, jobTitle: string, jobDescription: string) {
  const allKW = new Set(Object.values(TECH_KEYWORDS).flat());
  const resumeSkills = [...allKW].filter(k => resumeText.toLowerCase().includes(k.toLowerCase()));
  const jdSkills = [...allKW].filter(k => jobDescription.toLowerCase().includes(k.toLowerCase()));
  const missing = jdSkills.filter(s => !resumeSkills.includes(s));
  const matched = jdSkills.filter(s => resumeSkills.includes(s));
  const skillScore = jdSkills.length > 0 ? Math.round(matched.length / jdSkills.length * 100) : 50;
  const yearMatch = resumeText.match(/(\d+)\s*年/);
  const expScore = yearMatch ? (parseInt(yearMatch[1]) >= 5 ? 90 : parseInt(yearMatch[1]) >= 3 ? 75 : parseInt(yearMatch[1]) >= 1 ? 55 : 40) : 50;
  let eduScore = 70;
  if (/硕士|研究生/.test(resumeText)) eduScore = 90;
  else if (/本科|学士/.test(resumeText)) eduScore = 75;
  const salaryScore = skillScore > 70 ? 80 : 60;
  const overall = Math.round(skillScore * 0.4 + expScore * 0.25 + eduScore * 0.15 + salaryScore * 0.2);
  const suggestions = [];
  if (missing.length > 0) suggestions.push(`简历缺少JD关键词：${missing.slice(0,5).join('、')}`);
  if (overall < 60) suggestions.push('匹配度偏低，建议针对该岗位重组简历');
  return { overallScore: overall, strengths: matched.map(s=>`具备${s}技能`), weaknesses: missing.map(s=>`缺少${s}经验`), missingKeywords: missing, suggestions, matchDetails: { skills: { score: skillScore, detail: `匹配${matched.length}/${jdSkills.length}项` }, experience: { score: expScore, detail: '基于年限估算' }, education: { score: eduScore, detail: '学历匹配' }, salary: { score: salaryScore, detail: '技能薪酬预估' } } };
}

export function generateQuestionsLocally(jobTitle: string, jobDescription: string) {
  const q = [{ category:'technical', frequency:'high', question:'请介绍你最熟悉的一个项目及你的贡献' },{ category:'technical', frequency:'medium', question:'遇到线上故障如何排查定位？' },{ category:'technical', frequency:'medium', question:'如何保证代码质量？' },{ category:'behavioral', frequency:'high', question:'请用STAR法则描述一次技术挑战', hint:'Situation→Task→Action→Result' },{ category:'behavioral', frequency:'high', question:'与团队成员产生技术分歧时如何处理？' },{ category:'behavioral', frequency:'medium', question:'你如何平衡业务需求和技术债务？' },{ category:'company', frequency:'high', question:'你对本公司的业务和产品有什么了解？' },{ category:'company', frequency:'medium', question:'为什么想加入？期望实现什么？' }];
  return q;
}

export function analyzeJobSWOTLocally(jobTitle: string, _jd: string, _industry: string, riskLevel: string) {
  return {
    strengths: ['技术栈前沿，有学习成长空间','市场需求大，跳槽议价能力强'],
    weaknesses: riskLevel === 'red' ? ['企业经营风险高'] : [],
    opportunities: ['行业发展迅速，晋升通道清晰','可深入技术专家或转向管理'],
    threats: riskLevel === 'red' ? ['企业风险高，存在裁员可能'] : riskLevel === 'yellow' ? ['业务调整方向不明，建议观察'] : [],
    summary: riskLevel === 'red' ? '风险较高，谨慎决策' : riskLevel === 'yellow' ? '有潜在风险，建议深入了解' : '整体匹配良好，推荐投递'
  };
}
