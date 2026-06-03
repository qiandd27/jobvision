import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Alert, Chip, Box } from '@mui/material';
import { Settings as SettingsIcon, CheckCircle, Key } from '@mui/icons-material';

const STORAGE_KEY = 'jobvision_deepseek_key';

export function getDeepSeekKey(): string { return localStorage.getItem(STORAGE_KEY) || ''; }
export function setDeepSeekKey(key: string) { localStorage.setItem(STORAGE_KEY, key); }

export default function ApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(getDeepSeekKey());
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setDeepSeekKey(key.trim()); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (<>
    <Button size="small" variant={getDeepSeekKey()?'outlined':'contained'} color={getDeepSeekKey()?'success':'primary'} startIcon={getDeepSeekKey()?<CheckCircle/>:<Key/>} onClick={()=>setOpen(true)} sx={{borderRadius:2}}>
      {getDeepSeekKey()?'DeepSeek':'配置 API Key'}
    </Button>
    <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle><Box sx={{display:'flex',alignItems:'center',gap:1}}><SettingsIcon/>DeepSeek API 配置</Box></DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{mb:2}}>去 <strong>platform.deepseek.com</strong> 注册获取 Key（新用户送免费额度）。Key 仅存你浏览器 localStorage，不上传任何服务器。</Alert>
        <TextField autoFocus fullWidth label="DeepSeek API Key" type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxx" size="small" sx={{mb:1}}/>
        {saved && <Chip icon={<CheckCircle/>} label="已保存" color="success" sx={{mt:1}}/>}
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)}>取消</Button>
        <Button variant="contained" onClick={handleSave} disabled={!key.trim().startsWith('sk-')}>保存</Button>
      </DialogActions>
    </Dialog>
  </>);
}
