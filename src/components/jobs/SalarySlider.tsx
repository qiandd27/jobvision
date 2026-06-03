import { Box, Slider, Typography } from '@mui/material';

interface SalarySliderProps { min: number; max: number; }

export default function SalarySlider({ min, max }: SalarySliderProps) {
  return (
    <Box sx={{ px: 1 }}>
      <Slider value={[min, max]} min={0} max={80} disabled size="small" sx={{ '& .MuiSlider-thumb': { display: 'none' } }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">0K</Typography>
        <Typography variant="caption" color="primary.main" fontWeight={600}>{min}K-{max}K</Typography>
        <Typography variant="caption" color="text.secondary">80K</Typography>
      </Box>
    </Box>
  );
}
