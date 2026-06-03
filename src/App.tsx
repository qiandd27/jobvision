import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import ApplicationTracker from './pages/ApplicationTracker';
import ResumeAnalysis from './pages/ResumeAnalysis';

const theme = createTheme({
  palette: {
    primary: { main: '#1976D2', light: '#42A5F5', dark: '#1565C0' },
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#D32F2F' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderRadius: 12 } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 } } },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/applications" element={<ApplicationTracker />} />
          <Route path="/resume" element={<ResumeAnalysis />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
