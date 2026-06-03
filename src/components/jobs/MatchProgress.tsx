import { Box, Typography, LinearProgress } from '@mui/material';

interface MatchProgressProps { score: number; }

export default function MatchProgress({ score }: MatchProgressProps) {
  const color = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LinearProgress variant="determinate" value={score} color={color} sx={{ flex: 1, height: 8, borderRadius: 4 }} />
      <Typography variant="caption" fontWeight={600} color={`${color}.main`}>{score}%</Typography>
    </Box>
  );
}
