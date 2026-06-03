import { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Avatar, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';
import { useJobStore } from '../../store';

interface Message { role: 'interviewer' | 'candidate'; content: string; score?: number; feedback?: string; }

export default function MockInterview() {
  const { jobs } = useJobStore();
  const [targetJobId, setTargetJobId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectedJob = jobs.find(j => j.id === targetJobId);

  const startInterview = async () => {
    if (!selectedJob) return;
    setMessages([]); setLoading(true);
    try {
      const res = await fetch('/api/ai/mock-interview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ jobTitle: selectedJob.title, jdText: selectedJob.description||'', conversation: [] }) });
      const data = await res.json();
      setMessages([{ role:'interviewer', content: data.reply, score: data.score, feedback: data.feedback }]);
    } catch { setMessages([{ role:'interviewer', content: '你好，请做一个自我介绍，重点谈谈相关经验。' }]); }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedJob) return;
    const userMsg: Message = { role:'candidate', content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/mock-interview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ jobTitle: selectedJob.title, jdText: selectedJob.description||'', conversation: newMsgs.map(m=>({role:m.role,content:m.content})) }) });
      const data = await res.json();
      setMessages([...newMsgs, { role:'interviewer', content: data.reply, score: data.score, feedback: data.feedback }]);
    } catch { setMessages([...newMsgs, { role:'interviewer', content: '接下来请回答：你在项目中遇到的最大技术挑战是什么？' }]); }
    setLoading(false);
  };

  return (
    <Paper elevation={0} sx={{ p:3, border:'1px solid', borderColor:'divider' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>AI 模拟面试</Typography>
      <Box sx={{ display:'flex', gap:2, mb:2, alignItems:'center' }}>
        <FormControl size="small" sx={{ minWidth:240 }}>
          <InputLabel>选择目标岗位</InputLabel>
          <Select value={targetJobId} label="选择目标岗位" onChange={e=>setTargetJobId(e.target.value)}>
            {jobs.slice(0,20).map(j => <MenuItem key={j.id} value={j.id}>{j.title} · {j.companyName}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      {targetJobId && messages.length===0 && (
        <Box sx={{ textAlign:'center', py:3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>DeepSeek 将扮演 {selectedJob?.companyName} 的面试官进行模拟面试</Typography>
          <Typography variant="body2" color="primary.main" sx={{ cursor:'pointer', fontWeight:600 }} onClick={startInterview}>点击开始面试 →</Typography>
        </Box>
      )}
      {messages.length > 0 && (<>
        <Box sx={{ maxHeight:400, overflow:'auto', mb:2, p:1, bgcolor:'#f8f9fa', borderRadius:2 }}>
          {messages.map((msg,i) => (
            <Box key={i} sx={{ display:'flex', gap:1.5, mb:2, flexDirection: msg.role==='candidate'?'row-reverse':'row' }}>
              <Avatar sx={{ bgcolor: msg.role==='interviewer'?'#1976D2':'#2E7D32', width:32, height:32 }}>
                {msg.role==='interviewer'?<SmartToy sx={{fontSize:18}}/>:<Person sx={{fontSize:18}}/>}
              </Avatar>
              <Box sx={{ maxWidth:'75%' }}>
                <Paper sx={{ p:1.5, bgcolor: msg.role==='interviewer'?'#E3F2FD':'#E8F5E9' }}>
                  <Typography variant="body2">{msg.content}</Typography>
                </Paper>
                {msg.score && <Typography variant="caption" color="text.secondary">评分: {msg.score}/10 {msg.feedback||''}</Typography>}
              </Box>
            </Box>
          ))}
          {loading && <CircularProgress size={20} sx={{ display:'block', mx:'auto' }}/>}
          <div ref={chatEnd}/>
        </Box>
        <Box sx={{ display:'flex', gap:1 }}>
          <TextField size="small" fullWidth placeholder="输入你的回答..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}}} disabled={loading}/>
          <IconButton color="primary" onClick={sendMessage} disabled={loading||!input.trim()}><Send/></IconButton>
        </Box>
      </>)}
    </Paper>
  );
}
