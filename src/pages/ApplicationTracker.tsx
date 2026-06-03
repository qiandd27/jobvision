import { useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useApplicationStore } from '../store';
import FunnelChart from '../components/applications/FunnelChart';
import KanbanBoard from '../components/applications/KanbanBoard';
import CalendarHeatmap from '../components/applications/CalendarHeatmap';
import FollowUpList from '../components/applications/FollowUpList';
import EmptyState from '../components/shared/EmptyState';
import type { Application } from '../types';

export default function ApplicationTracker() {
  const { applications, loading, loadApplications, updateStatus } = useApplicationStore();

  useEffect(() => { loadApplications(); }, []);

  if (loading) return <Typography color="text.secondary">加载中...</Typography>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>投递管理</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb:3 }}>共 {applications.length} 条记录</Typography>

      {applications.length === 0 ? (
        <EmptyState title="暂无投递记录" description="在岗位列表找到心仪岗位后点击一键投递" />
      ) : (
        <>
          <Paper elevation={0} sx={{ p:2, mb:3, border:'1px solid', borderColor:'divider' }}><FunnelChart applications={applications} /></Paper>
          <Paper elevation={0} sx={{ p:2, mb:3, border:'1px solid', borderColor:'divider' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb:2 }}>看板视图</Typography>
            <KanbanBoard applications={applications} onStatusChange={(id, status) => updateStatus(id, status as any)} />
          </Paper>
          <Grid container spacing={3}>
            <Grid size={{ xs:12, md:7 }}><Paper elevation={0} sx={{ p:2, border:'1px solid', borderColor:'divider' }}><CalendarHeatmap applications={applications} /></Paper></Grid>
            <Grid size={{ xs:12, md:5 }}><FollowUpList applications={applications} onFollowUp={(id) => updateStatus(id, 'viewed')} onArchive={(id) => updateStatus(id, 'archived')} /></Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
