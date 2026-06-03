import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/', label: '仪表盘' },
  { path: '/jobs', label: '岗位列表' },
  { path: '/applications', label: '投递管理' },
  { path: '/resume', label: '简历分析' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <WorkIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mr: 4, cursor: 'pointer' }} onClick={() => navigate('/')}>
          JobVision
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {NAV.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{ fontWeight: location.pathname === item.path ? 700 : 400, opacity: location.pathname === item.path ? 1 : 0.7 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
