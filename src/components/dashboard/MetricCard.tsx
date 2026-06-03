import { Paper, Typography, Box } from '@mui/material';

interface MetricCardProps {
  title: string; value: number | string; icon: React.ReactNode; color?: string; trend?: number;
}

export default function MetricCard({ title, value, icon, color = '#1976D2', trend }: MetricCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{value}</Typography>
          {trend !== undefined && (
            <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15` }}>{icon}</Box>
      </Box>
    </Paper>
  );
}
