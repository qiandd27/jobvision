import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Work as WorkIcon, TrendingUp, Warning } from '@mui/icons-material';
import type { Job, CompanyIntel } from '../../types';

const colorMap: Record<string, string> = { primary: '#1976D2', success: '#2E7D32', warning: '#ED6C02', error: '#D32F2F' };

export default function JobTimeline({ job, company }: { job: Job; company: CompanyIntel | undefined }) {
  const rl = company?.riskLevel ?? job.riskLevel;
  const steps = [
    { time: '1-3个月', title: '入职适应期', desc: `熟悉${job.companyName}技术栈与业务流程`, color: 'primary', icon: <WorkIcon /> },
    { time: '3-6个月', title: '独立贡献期', desc: `在${job.title}岗位独立承担模块开发`, color: 'success', icon: <TrendingUp /> },
    ...(rl === 'red' ? [
      { time: '6-12个月', title: '⚠️ 风险分叉', desc: `企业风险较高，建议密切观察`, color: 'error', icon: <Warning /> },
      { time: '12-18个月', title: '评估跳槽窗口', desc: '如经营未改善，开始寻找新机会', color: 'warning', icon: <Warning /> },
    ] : rl === 'yellow' ? [
      { time: '6-12个月', title: '成长与观察期', desc: '技术提升，关注企业风险变化', color: 'warning', icon: <TrendingUp /> },
      { time: '12-18个月', title: '职业跃迁窗口', desc: '可考虑内部晋升或外部机会，薪资预期涨幅20-30%', color: 'primary', icon: <WorkIcon /> },
    ] : [
      { time: '6-12个月', title: '深度贡献期', desc: `在${job.companyName}建立专业影响力`, color: 'success', icon: <TrendingUp /> },
      { time: '12-18个月', title: '晋升或跃迁', desc: '考虑内部晋升或更高平台', color: 'primary', icon: <WorkIcon /> },
    ]),
  ];

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>职业发展时间线</Typography>
      <Box sx={{ position: 'relative', pl: 4 }}>
        {steps.map((step, i) => (
          <Box key={i} sx={{ position: 'relative', pb: i < steps.length - 1 ? 3 : 0, pl: 3,
            '&::before': { content: '""', position: 'absolute', left: -21, top: 40, bottom: i < steps.length - 1 ? 0 : undefined, width: 2, bgcolor: i < steps.length - 1 ? '#E0E0E0' : 'transparent' },
          }}>
            <Avatar sx={{ position: 'absolute', left: -34, top: 0, width: 28, height: 28, bgcolor: colorMap[step.color] ?? '#1976D2' }}>{step.icon}</Avatar>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25 }}>{step.time}</Typography>
            <Typography variant="subtitle2" fontWeight={600}>{step.title}</Typography>
            <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
