import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, CircularProgress, Chip, Alert, LinearProgress } from '@mui/material';
import { CloudDownload as CrawlIcon } from '@mui/icons-material';
import { crawlBossJobs } from '../../api';

interface CrawlerPanelProps { onComplete?: () => void; }

export default function CrawlerPanel({ onComplete }: CrawlerPanelProps) {
  const [city, setCity] = useState('北京');
  const [keyword, setKeyword] = useState('前端');
  const [maxPages, setMaxPages] = useState(2);
  const [crawling, setCrawling] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCrawl = async () => {
    setCrawling(true); setError(null); setResult(null);
    try { const r = await crawlBossJobs(city, keyword, maxPages); setResult(r); onComplete?.(); }
    catch (e) { setError((e as Error).message); }
    finally { setCrawling(false); }
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px dashed', borderColor: 'primary.light', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CrawlIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>数据采集</Typography>
        <Chip label="BETA" size="small" color="primary" variant="outlined" />
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <TextField label="城市" size="small" value={city} onChange={e => setCity(e.target.value)} sx={{ width: 120 }} disabled={crawling} />
        <TextField label="关键词" size="small" value={keyword} onChange={e => setKeyword(e.target.value)} sx={{ width: 160 }} disabled={crawling} />
        <TextField label="页数" type="number" size="small" value={maxPages} onChange={e => setMaxPages(Math.min(10, Math.max(1, parseInt(e.target.value)||1)))} sx={{ width: 80 }} disabled={crawling} inputProps={{ min:1, max:10 }} />
        <Button variant="contained" size="small" startIcon={crawling ? <CircularProgress size={16} color="inherit" /> : <CrawlIcon />} onClick={handleCrawl} disabled={crawling}>
          {crawling ? '采集中...' : '开始采集'}
        </Button>
      </Box>
      {crawling && <LinearProgress sx={{ mt: 1 }} />}
      {result && <Alert severity={result.errors?.length > 0 ? 'warning' : 'success'} sx={{ mt: 1.5 }}>采集完成：新增 <strong>{result.newJobs}</strong> 个岗位</Alert>}
      {error && <Alert severity="error" sx={{ mt: 1.5 }}>{error}</Alert>}
    </Paper>
  );
}
