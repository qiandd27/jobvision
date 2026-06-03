import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import type { Application } from '../../types';

interface FollowUpProps {
  applications: Application[];
  onFollowUp: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function FollowUpList({ applications, onFollowUp, onArchive }: FollowUpProps) {
  const stale = applications.filter(a => {
    const diff = Date.now() - new Date(a.appliedAt).getTime();
    return diff > 7 * 86400000 && a.status === 'applied';
  });

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>待跟进 ({stale.length})</Typography>
      {stale.length === 0 ? (
        <Typography variant="body2" color="text.secondary">暂无超7天无反馈的投递</Typography>
      ) : (
        <List dense>
          {stale.map(app => (
            <ListItem key={app.id} sx={{ px: 0 }} secondaryAction={
              <Box>
                <Button size="small" onClick={() => onFollowUp(app.id)}>跟进</Button>
                <Button size="small" color="error" onClick={() => onArchive(app.id)}>放弃</Button>
              </Box>
            }>
              <ListItemText primary={app.jobSnapshot.title} secondary={`${app.jobSnapshot.companyName} · ${Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000)}天前投递`} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
