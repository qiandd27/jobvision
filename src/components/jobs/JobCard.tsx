import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MatchProgress from './MatchProgress';
import RiskBadge from './RiskBadge';
import { formatSalary, timeAgo } from '../../utils/helpers';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onQuickApply: (job: Job) => void;
}

export default function JobCard({ job, onQuickApply }: JobCardProps) {
  const navigate = useNavigate();
  return (
    <Card sx={{ mb: 2, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} onClick={() => navigate(`/jobs/${job.id}`)}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">{job.companyName} · {job.city}</Typography>
          </Box>
          <Button variant="contained" size="small" startIcon={<OpenInNew />} onClick={(e) => { e.stopPropagation(); onQuickApply(job); }}>
            投递
          </Button>
        </Box>
        <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ mb: 1 }}>
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryMonths)}
        </Typography>
        <MatchProgress score={job.matchScore} />
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <RiskBadge level={job.riskLevel} />
          {job.tags.slice(0, 4).map((t) => <Chip key={t} label={t} size="small" variant="outlined" />)}
          <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>{job.source} · {timeAgo(job.postedAt)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
