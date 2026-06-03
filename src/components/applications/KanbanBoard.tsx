import { Box, Typography, Paper, Chip, Select, MenuItem } from '@mui/material';
import type { Application } from '../../types';

const COLUMNS = [
  { key: 'applied', label: '已投递', color: '#1976D2' },
  { key: 'viewed', label: '已查看', color: '#ED6C02' },
  { key: 'interview', label: '面试中', color: '#9C27B0' },
  { key: 'offer', label: 'Offer', color: '#2E7D32' },
  { key: 'rejected', label: '已拒绝', color: '#D32F2F' },
];

interface KanbanProps { applications: Application[]; onStatusChange: (id: string, status: string) => void; }

export default function KanbanBoard({ applications, onStatusChange }: KanbanProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
      {COLUMNS.map(col => {
        const items = applications.filter(a => a.status === col.key);
        return (
          <Paper key={col.key} variant="outlined" sx={{ minWidth: 160, flex: 1, p: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: col.color }}>
              {col.label} ({items.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {items.map(app => (
                <Paper key={app.id} elevation={1} sx={{ p: 1 }}>
                  <Typography variant="caption" fontWeight={600}>{app.jobSnapshot.title}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{app.jobSnapshot.companyName}</Typography>
                  <Select size="small" value={app.status} onChange={e => onStatusChange(app.id, e.target.value)} sx={{ mt: 0.5, fontSize: 11, height: 28 }}>
                    {COLUMNS.map(c => <MenuItem key={c.key} value={c.key}>{c.label}</MenuItem>)}
                  </Select>
                </Paper>
              ))}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
