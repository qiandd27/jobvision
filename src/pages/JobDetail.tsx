import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, IconButton, Breadcrumbs, Link, Alert } from '@mui/material';
import { ArrowBack as BackIcon, OpenInNew as OpenIcon } from '@mui/icons-material';
import { useJobStore, useApplicationStore, useResumeStore } from '../store';
import type { Job, CompanyIntel } from '../types';
import JobOverview from '../components/job-detail/JobOverview';
import SalaryChart from '../components/job-detail/SalaryChart';
import SWOTQuadrant from '../components/job-detail/SWOTQuadrant';
import MatchRadar from '../components/job-detail/MatchRadar';
import JobTimeline from '../components/job-detail/JobTimeline';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, getCompanyById, loadJobs, loading } = useJobStore();
  const { applications, addApplication, loadApplications } = useApplicationStore();
  const { userProfile } = useResumeStore();
  const [job, setJob] = useState<Job | undefined>();
  const [company, setCompany] = useState<CompanyIntel | undefined>();

  useEffect(() => { loadJobs({ page_size: 200 }); loadApplications(); }, []);

  useEffect(() => {
    if (id) { getJobById(id).then(j => { setJob(j); if (j) setCompany(getCompanyById(j.companyId)); }); }
  }, [id, getJobById, getCompanyById]);

  const app = job ? applications.find(a => a.jobId === job.id) : undefined;

  const handleApply = useCallback(() => {
    if (!job) return;
    window.open(job.sourceUrl, '_blank');
    addApplication(job.id).catch(()=>{});
  }, [job, addApplication]);

  if (loading && !job) return <LoadingSpinner message="加载岗位详情..." />;
  if (!job) return <EmptyState title="岗位不存在" description="该岗位可能已被删除" action={{ label: '返回岗位列表', onClick: () => navigate('/jobs') }} />;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor:'pointer' }}>首页</Link>
        <Link underline="hover" color="inherit" onClick={() => navigate('/jobs')} sx={{ cursor:'pointer' }}>岗位列表</Link>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p:2, mb:3, display:'flex', alignItems:'center', gap:1, border:'1px solid', borderColor:'divider', position:'sticky', top:64, zIndex:10, bgcolor:'#fff' }}>
        <IconButton onClick={() => navigate(-1)} size="small"><BackIcon /></IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ flex:1 }}>{job.title} · {job.companyName}</Typography>
        {app && <Typography variant="caption" color={app.status==='offer'?'success.main':'text.secondary'} sx={{mr:1}}>状态: {app.status}</Typography>}
        <Button variant="contained" onClick={handleApply} startIcon={<OpenIcon />}>一键投递</Button>
      </Paper>

      <JobOverview job={job} company={company ?? undefined} />

      {company && company.riskLevel !== 'green' && (
        <Alert severity={company.riskLevel==='red'?'error':'warning'} sx={{ mb:3 }}>
          {company.shortName ?? company.name} 风险提示：{company.riskFactors.join('、')}
        </Alert>
      )}

      <Typography variant="h6" fontWeight={600} sx={{ mb:2 }}>薪资分析</Typography>
      <Box sx={{ display:'flex', gap:3, mb:3, flexDirection:{ xs:'column', md:'row' } }}>
        <Paper elevation={0} sx={{ p:2, flex:1, border:'1px solid', borderColor:'divider' }}><SalaryChart job={job} /></Paper>
        <Paper elevation={0} sx={{ p:2, flex:1, border:'1px solid', borderColor:'divider' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb:1 }}>机会风险评估</Typography>
          <SWOTQuadrant job={job} company={company} />
        </Paper>
      </Box>

      <Typography variant="h6" fontWeight={600} sx={{ mb:2 }}>能力匹配</Typography>
      <Paper elevation={0} sx={{ p:2, mb:3, border:'1px solid', borderColor:'divider' }}><MatchRadar job={job} profile={userProfile} /></Paper>

      <Typography variant="h6" fontWeight={600} sx={{ mb:2 }}>职业发展</Typography>
      <JobTimeline job={job} company={company} />
    </Box>
  );
}
