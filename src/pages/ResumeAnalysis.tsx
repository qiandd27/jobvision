import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Grid, Slider, Button, Select, MenuItem, FormControl, InputLabel, Chip, Stack, LinearProgress, Alert, Divider, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import { Save as SaveIcon, AutoAwesome as AIIcon, School as SchoolIcon, ExpandMore } from '@mui/icons-material';
import { useResumeStore, useJobStore } from '../store';
import ResumeUploader from '../components/resume/ResumeUploader';
import { CITIES, INDUSTRIES } from '../utils/constants';
import { analyzeResume, generateInterviewQuestions } from '../api';
import type { UserProfile } from '../types';

export default function ResumeAnalysis() {
  const { userProfile, setUserProfile, resumeText, parsing } = useResumeStore();
  const { jobs, loadJobs } = useJobStore();
  const [targetJobId, setTargetJobId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => { loadJobs({ page_size: 200 }); }, []);

  const p = userProfile ?? { name:'', city:'', targetCities:[] as string[], industries:[] as string[], skills:[], expectedSalaryMin:15, expectedSalaryMax:35, education:'本科', experienceYears:3 };

  const handleUpdate = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setUserProfile({ ...p, [key]: value });

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setAnalyzing(true);
    const targetJob = jobs.find(j => j.id === targetJobId);
    const result = await analyzeResume(resumeText, targetJobId || undefined, targetJob?.title, targetJob?.description);
    setAnalysis(result);
    setAnalyzing(false);
    if (targetJob) {
      const q = await generateInterviewQuestions(targetJobId, targetJob.title, targetJob.description);
      setQuestions(q.questions);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>简历分析</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb:3 }}>上传简历 → 选择目标岗位 → AI对比分析与面试题库</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs:12, md:7 }}>
          <ResumeUploader />

          {resumeText && !parsing && (
            <Paper elevation={0} sx={{ p:3, mt:3, border:'1px solid', borderColor:'primary.light' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>JD对比分析</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth:240 }}>
                  <InputLabel>选择目标岗位</InputLabel>
                  <Select value={targetJobId} label="选择目标岗位" onChange={e => setTargetJobId(e.target.value)}>
                    {jobs.slice(0,30).map(j => <MenuItem key={j.id} value={j.id}>{j.title} · {j.companyName}</MenuItem>)}
                  </Select>
                </FormControl>
                <Button variant="contained" startIcon={analyzing?<CircularProgress size={16} color="inherit" />:<AIIcon />} onClick={handleAnalyze} disabled={!targetJobId||analyzing}>
                  {analyzing ? '分析中...' : 'AI对比分析'}
                </Button>
              </Stack>
              {jobs.find(j=>j.id===targetJobId) && <Alert severity="info" sx={{mt:1.5}}>目标：{jobs.find(j=>j.id===targetJobId)!.title} · {jobs.find(j=>j.id===targetJobId)!.companyName}</Alert>}
            </Paper>
          )}

          {analysis && (
            <Paper elevation={0} sx={{ p:3, mt:3, border:'1px solid', borderColor:'divider' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>匹配分析报告</Typography>
              <Box sx={{ textAlign:'center', mb:3 }}>
                <Box sx={{ position:'relative', display:'inline-flex' }}>
                  <CircularProgress variant="determinate" value={analysis.overallScore} size={100} thickness={6} color={analysis.overallScore>=80?'success':analysis.overallScore>=60?'warning':'error'} />
                  <Box sx={{ position:'absolute', top:0, left:0, bottom:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Typography variant="h5" fontWeight={700}>{analysis.overallScore}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt:1 }}>综合匹配度</Typography>
              </Box>
              <Grid container spacing={1} sx={{ mb:2 }}>
                {(['skills','experience','education','salary'] as const).map(k => (
                  <Grid key={k} size={{ xs:6 }}>
                    <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
                      <Typography variant="caption">{k==='skills'?'技能':k==='experience'?'经验':k==='education'?'学历':'薪资'}</Typography>
                      <Typography variant="caption" fontWeight={600}>{analysis.matchDetails[k].score}分</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={analysis.matchDetails[k].score} color={analysis.matchDetails[k].score>=80?'success':analysis.matchDetails[k].score>=60?'warning':'error'} sx={{ height:6, borderRadius:3 }} />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my:2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs:12, md:6 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="success.main">✅ 优势</Typography>
                  {analysis.strengths.map((s:string,i:number) => <Alert key={i} severity="success" sx={{py:0,mb:0.5}}>{s}</Alert>)}
                </Grid>
                <Grid size={{ xs:12, md:6 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="error.main">⚠️ 待改进</Typography>
                  {analysis.weaknesses.map((w:string,i:number) => <Alert key={i} severity="warning" sx={{py:0,mb:0.5}}>{w}</Alert>)}
                </Grid>
              </Grid>
              {analysis.missingKeywords?.length > 0 && (
                <Box sx={{ mt:2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>缺失关键技能</Typography>
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
                    {analysis.missingKeywords.map((k:string) => <Chip key={k} label={k} size="small" color="error" variant="outlined" />)}
                  </Box>
                </Box>
              )}
              <Box sx={{ mt:2 }}><Typography variant="subtitle2" fontWeight={600}>📝 优化建议</Typography>
                {analysis.suggestions.map((s:string,i:number) => <Alert key={i} severity="info" sx={{py:0,mb:0.5}}>{s}</Alert>)}
              </Box>
            </Paper>
          )}

          {questions.length > 0 && (
            <Paper elevation={0} sx={{ p:3, mt:3, border:'1px solid', borderColor:'divider' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom><SchoolIcon sx={{mr:1,verticalAlign:'middle'}} />面试题库 ({questions.length}题)</Typography>
              {(['high','medium','low'] as const).map(freq => {
                const qs = questions.filter((q:any) => q.frequency === freq);
                if (qs.length === 0) return null;
                return (
                  <Accordion key={freq} defaultExpanded={freq==='high'}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>{freq==='high'?'🔥高频':freq==='medium'?'📌中频':'💡低频'} ({qs.length}题)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {qs.map((q:any,i:number) => (
                        <Box key={i} sx={{ mb:1.5 }}>
                          <Typography variant="body2" fontWeight={500}>{i+1}. {q.question}</Typography>
                          {q.hint && <Typography variant="caption" color="primary.main">{q.hint}</Typography>}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Paper>
          )}
        </Grid>

        <Grid size={{ xs:12, md:5 }}>
          <Paper elevation={0} sx={{ p:3, border:'1px solid', borderColor:'divider' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>求职偏好</Typography>
            <Stack spacing={2}>
              <TextField size="small" label="姓名" value={p.name} onChange={e => handleUpdate('name', e.target.value)} fullWidth />
              <FormControl fullWidth size="small"><InputLabel>城市</InputLabel><Select value={p.city} label="城市" onChange={e => handleUpdate('city', e.target.value)}>{CITIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>目标城市</InputLabel><Select value="" label="目标城市" onChange={e => { if(e.target.value && !p.targetCities.includes(e.target.value)) handleUpdate('targetCities',[...p.targetCities,e.target.value]) }}>{CITIES.filter(c => !p.targetCities.includes(c)).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</Select></FormControl>
              <Box sx={{display:'flex',flexWrap:'wrap',gap:0.5}}>{p.targetCities.map(c => <Chip key={c} label={c} size="small" onDelete={()=>handleUpdate('targetCities',p.targetCities.filter(tc=>tc!==c))} />)}</Box>
              <FormControl fullWidth size="small"><InputLabel>偏好行业</InputLabel><Select value="" label="偏好行业" onChange={e => { if(e.target.value && !p.industries.includes(e.target.value)) handleUpdate('industries',[...p.industries,e.target.value]) }}>{INDUSTRIES.filter(i => !p.industries.includes(i)).map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}</Select></FormControl>
              <Box sx={{display:'flex',flexWrap:'wrap',gap:0.5}}>{p.industries.map(i => <Chip key={i} label={i} size="small" color="primary" variant="outlined" onDelete={()=>handleUpdate('industries',p.industries.filter(t=>t!==i))} />)}</Box>
              <TextField size="small" label="技能" fullWidth onKeyDown={e=>{if(e.key==='Enter'){const t=e.target as HTMLInputElement;if(t.value.trim()){handleUpdate('skills',[...p.skills,t.value.trim()]);t.value=''}}}} placeholder="回车添加" />
              <Box sx={{display:'flex',flexWrap:'wrap',gap:0.5}}>{p.skills.map(s => <Chip key={s} label={s} size="small" color="secondary" variant="outlined" onDelete={()=>handleUpdate('skills',p.skills.filter(sk=>sk!==s))} />)}</Box>
              <FormControl fullWidth size="small"><InputLabel>学历</InputLabel><Select value={p.education} label="学历" onChange={e => handleUpdate('education', e.target.value)}>{['大专','本科','硕士','博士'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl>
              <Box><Typography variant="body2" color="text.secondary" gutterBottom>年限: {p.experienceYears}年</Typography><Slider value={p.experienceYears} onChange={(_,v) => handleUpdate('experienceYears',v as number)} min={0} max={20} size="small" /></Box>
              <Box><Typography variant="body2" color="text.secondary" gutterBottom>薪资: {p.expectedSalaryMin}K-{p.expectedSalaryMax}K</Typography><Slider value={[p.expectedSalaryMin,p.expectedSalaryMax]} onChange={(_,v)=>{const[a,b]=v as [number,number];handleUpdate('expectedSalaryMin',a);handleUpdate('expectedSalaryMax',b)}} min={5} max={80} size="small" /></Box>
              <Button variant="contained" startIcon={<SaveIcon />} fullWidth>保存偏好</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
