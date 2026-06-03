import { useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Paper, Alert, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { Work as WorkIcon, Assessment as AssessmentIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { useJobStore, useApplicationStore, useResumeStore } from '../store';
import { CITIES, INDUSTRIES } from '../utils/constants';
import MetricCard from '../components/dashboard/MetricCard';
import SalaryHeatmap from '../components/dashboard/SalaryHeatmap';
import CompanyRiskRadar from '../components/dashboard/CompanyRiskRadar';
import CrawlerPanel from '../components/dashboard/CrawlerPanel';

export default function Dashboard() {
  const { loadJobs, jobs, getDashboardMetrics } = useJobStore();
  const { stats, loadStats } = useApplicationStore();
  const { userProfile, setUserProfile } = useResumeStore();

  useEffect(() => { loadJobs({ page_size: 200 }); loadStats(); }, [loadJobs, loadStats]);

  const metrics = useMemo(() => getDashboardMetrics(userProfile ?? undefined), [jobs, userProfile]);
  const matched = userProfile ? jobs.filter(j => j.matchScore >= 60).length : 0;

  const riskAlerts = useMemo(() => {
    const a: string[] = [];
    const highRisk = jobs.filter(j => j.riskLevel === 'red');
    if (highRisk.length > 0) a.push(`有 ${highRisk.length} 个高风险岗位，建议谨慎投递`);
    return a;
  }, [jobs]);

  const p = userProfile ?? { name:'', city:'', targetCities:[] as string[], industries:[] as string[], skills:[], expectedSalaryMin:15, expectedSalaryMax:35, education:'本科', experienceYears:3 };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>仪表盘</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>求职市场全景 & 个人进度概览</Typography>

      <Paper elevation={0} sx={{ p:2, mb:3, border:'1px solid', borderColor:'divider', display:'flex', gap:2, flexWrap:'wrap' }}>
        <FormControl size="small" sx={{ minWidth:140 }}>
          <InputLabel>目标城市</InputLabel>
          <Select value="" label="目标城市" onChange={e => { if(e.target.value && !p.targetCities.includes(e.target.value)) setUserProfile({...p,targetCities:[...p.targetCities,e.target.value as string]}); }}>
            {CITIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth:140 }}>
          <InputLabel>偏好行业</InputLabel>
          <Select value="" label="偏好行业" onChange={e => { if(e.target.value && !p.industries.includes(e.target.value)) setUserProfile({...p,industries:[...p.industries,e.target.value as string]}); }}>
            {INDUSTRIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </Select>
        </FormControl>
        <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, alignItems:'center' }}>
          {p.targetCities.map(c => <Chip key={c} label={c} size="small" onDelete={()=>setUserProfile({...p,targetCities:p.targetCities.filter(tc=>tc!==c)})} />)}
          {p.industries.map(i => <Chip key={i} label={i} size="small" color="primary" variant="outlined" onDelete={()=>setUserProfile({...p,industries:p.industries.filter(t=>t!==i)})} />)}
        </Box>
      </Paper>

      <CrawlerPanel onComplete={() => { loadJobs({ page_size: 200 }); }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs:12, sm:4 }}><MetricCard title="在招岗位" value={jobs.length} icon={<WorkIcon />} color="#1976D2" /></Grid>
        <Grid size={{ xs:12, sm:4 }}><MetricCard title="匹配岗位" value={matched} icon={<AssessmentIcon />} color="#2E7D32" /></Grid>
        <Grid size={{ xs:12, sm:4 }}><MetricCard title="已投递" value={stats.total} icon={<TrendingUpIcon />} color="#9C27B0" /></Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs:12, md:6 }}><Paper elevation={0} sx={{ p:2, border:'1px solid', borderColor:'divider' }}><Typography variant="subtitle1" fontWeight={600}>薪资热力图</Typography><SalaryHeatmap /></Paper></Grid>
        <Grid size={{ xs:12, md:6 }}><Paper elevation={0} sx={{ p:2, border:'1px solid', borderColor:'divider' }}><Typography variant="subtitle1" fontWeight={600}>公司风险雷达</Typography><CompanyRiskRadar /></Paper></Grid>
      </Grid>

      {riskAlerts.map((a,i) => <Alert key={i} severity="warning" variant="outlined" sx={{ mb:1 }}>{a}</Alert>)}
    </Box>
  );
}
