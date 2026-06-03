import { Box } from '@mui/material';
import JobCard from './JobCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import type { Job, UserProfile } from '../../types';

interface JobCardListProps {
  jobs: Job[];
  loading: boolean;
  userProfile?: UserProfile | null;
  onQuickApply: (job: Job) => void;
}

export default function JobCardList({ jobs, loading, onQuickApply }: JobCardListProps) {
  if (loading) return <LoadingSpinner />;
  if (jobs.length === 0) return <EmptyState title="暂无匹配岗位" description="试试调整筛选条件" />;
  return (
    <Box>
      {jobs.map((job) => <JobCard key={job.id} job={job} onQuickApply={onQuickApply} />)}
    </Box>
  );
}
