import { useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useJobStore, useFilterStore, useApplicationStore, useResumeStore } from '../store';
import FilterBar from '../components/jobs/FilterBar';
import JobCardList from '../components/jobs/JobCardList';
import type { Job } from '../types';

export default function JobList() {
  const { jobs, loadJobs, loading, loadFilterMeta } = useJobStore();
  const { filters, setFilter, resetFilters } = useFilterStore();
  const { addApplication } = useApplicationStore();
  const { userProfile } = useResumeStore();

  useEffect(() => { loadFilterMeta(); }, []);

  const fetchWithFilters = useCallback(() => {
    const params: Record<string, any> = { ...(filters.city && {city:filters.city}), ...(filters.industry && {industry:filters.industry}), ...(filters.salaryRange[0]>0 && {salary_min:filters.salaryRange[0]}), ...(filters.salaryRange[1]<80 && {salary_max:filters.salaryRange[1]}), ...(filters.experience && filters.experience!=='不限' && {experience:filters.experience}), ...(filters.education && filters.education!=='不限' && {education:filters.education}), ...(filters.keywords && {keywords:filters.keywords}), ...(filters.matchScoreMin>0 && {match_score_min:filters.matchScoreMin}), ...(filters.riskLevel!=='all' && {risk_level:filters.riskLevel}), sort_by: filters.sortBy, sort_order: filters.sortOrder };
    loadJobs(params);
  }, [filters, loadJobs]);

  useEffect(() => { fetchWithFilters(); }, [fetchWithFilters]);

  const handleQuickApply = (job: Job) => { window.open(job.sourceUrl, '_blank'); addApplication(job.id); };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>岗位列表</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>共 {jobs.length} 个岗位</Typography>
      <FilterBar filters={filters} onFilterChange={setFilter} onReset={resetFilters} />
      <JobCardList jobs={jobs} loading={loading} onQuickApply={handleQuickApply} userProfile={userProfile} />
    </Box>
  );
}
