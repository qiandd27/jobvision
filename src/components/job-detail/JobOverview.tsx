import { Box, Typography, Grid, Paper } from '@mui/material';
import MatchProgress from '../jobs/MatchProgress';
import RiskBadge from '../jobs/RiskBadge';
import { formatSalary, timeAgo } from '../../utils/helpers';
import type { Job, CompanyIntel } from '../../types';

interface JobOverviewProps { job: Job; company: CompanyIntel | undefined; }

export default function JobOverview({ job, company }: JobOverviewProps) {
  const metrics = [
    { label: '匹配度', value: <MatchProgress score={job.matchScore} /> },
    { label: '风险等级', value: <RiskBadge level={job.riskLevel} /> },
    { label: '薪资分位', value: <Typography fontWeight={700} color="primary.main">{formatSalary(job.salaryMin, job.salaryMax, job.salaryMonths)}</Typography> },
  ];

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{job.title}</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {job.companyName} · {job.city} · {job.experience} · {job.education}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>{job.description}</Typography>
      <Typography variant="caption" color="text.disabled">{job.source} · {timeAgo(job.postedAt)}</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {metrics.map((m, i) => (
          <Grid key={i} size={{ xs: 4 }}>
            <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{m.label}</Typography>
              <Box sx={{ mt: 0.5 }}>{m.value}</Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
