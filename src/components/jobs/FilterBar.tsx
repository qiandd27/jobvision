import { Paper, TextField, Select, MenuItem, FormControl, InputLabel, Box, Slider, Typography, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import type { FilterState, RiskLevel, DataSource } from '../../types';
import { CITIES, INDUSTRIES, EXPERIENCE_LEVELS, EDUCATION_LEVELS } from '../../utils/constants';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>城市</InputLabel>
          <Select value={filters.city} label="城市" onChange={e => onFilterChange('city', e.target.value)}>
            <MenuItem value="">全部</MenuItem>
            {CITIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>行业</InputLabel>
          <Select value={filters.industry} label="行业" onChange={e => onFilterChange('industry', e.target.value)}>
            <MenuItem value="">全部</MenuItem>
            {INDUSTRIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField size="small" placeholder="搜索关键词" value={filters.keywords} onChange={e => onFilterChange('keywords', e.target.value)} sx={{ minWidth: 150 }} />
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>经验</InputLabel>
          <Select value={filters.experience} label="经验" onChange={e => onFilterChange('experience', e.target.value)}>
            <MenuItem value="">不限</MenuItem>
            {EXPERIENCE_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>学历</InputLabel>
          <Select value={filters.education} label="学历" onChange={e => onFilterChange('education', e.target.value)}>
            <MenuItem value="">不限</MenuItem>
            {EDUCATION_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>排序</InputLabel>
          <Select value={filters.sortBy} label="排序" onChange={e => onFilterChange('sortBy', e.target.value as any)}>
            <MenuItem value="postedAt">最新</MenuItem>
            <MenuItem value="matchScore">匹配度</MenuItem>
            <MenuItem value="salary">薪资</MenuItem>
          </Select>
        </FormControl>
        <Button size="small" onClick={onReset}>重置</Button>
      </Box>
      <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">薪资</Typography>
        <Slider
          size="small"
          value={filters.salaryRange}
          onChange={(_, v) => onFilterChange('salaryRange', v as [number, number])}
          min={0} max={80} step={5}
          valueLabelDisplay="auto"
          valueLabelFormat={v => `${v}K`}
          sx={{ flex: 1, maxWidth: 300 }}
        />
        <ToggleButtonGroup size="small" value={filters.riskLevel} exclusive onChange={(_, v) => v && onFilterChange('riskLevel', v)}>
          <ToggleButton value="all">全部</ToggleButton>
          <ToggleButton value="green">安全</ToggleButton>
          <ToggleButton value="yellow">注意</ToggleButton>
          <ToggleButton value="red">高危</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}
