import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps { message?: string; }

export default function LoadingSpinner({ message = '加载中...' }: LoadingSpinnerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{message}</Typography>
    </Box>
  );
}
