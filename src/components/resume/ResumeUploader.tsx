import { useCallback, useRef } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Chip } from '@mui/material';
import { CloudUpload, Description } from '@mui/icons-material';
import { useResumeStore } from '../../store';

export default function ResumeUploader() {
  const { parsing, parseError, resumeText, resumeData, parseResume } = useResumeStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    parseResume(file);
  }, [parseResume]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <Paper
      elevation={0}
      sx={{ p: 4, border: '2px dashed', borderColor: resumeText ? 'success.light' : 'divider', textAlign: 'center', cursor: 'pointer' }}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={e => { if(e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      <CloudUpload sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {resumeText ? '简历已加载' : '上传简历'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        支持 PDF / Word / TXT 格式，拖拽或点击上传
      </Typography>

      {parsing && <Box sx={{ mt: 2 }}><LinearProgress /><Typography variant="caption" color="text.secondary">解析中...</Typography></Box>}

      {parseError && <Typography variant="caption" color="error" sx={{ mt: 1 }}>{parseError}</Typography>}

      {resumeData && !parsing && (
        <Box sx={{ mt: 2, textAlign: 'left' }}>
          {resumeData.personal.name && (
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {resumeData.personal.name}
              {resumeData.personal.email && ` · ${resumeData.personal.email}`}
              {resumeData.personal.phone && ` · ${resumeData.personal.phone}`}
            </Typography>
          )}
          {resumeData.skills.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {resumeData.skills.map(s => <Chip key={s} label={s} size="small" color="primary" variant="outlined" />)}
            </Box>
          )}
          {resumeData.education.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              🎓 {resumeData.education[0].school} · {resumeData.education[0].degree} · {resumeData.education[0].major}
            </Typography>
          )}
          <Button variant="text" size="small" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }} sx={{ mt: 1 }}>
            重新上传
          </Button>
        </Box>
      )}
    </Paper>
  );
}
