import { Chip } from '@mui/material';
import type { RiskLevel } from '../../types';

const RISK_MAP: Record<RiskLevel, { label: string; color: 'success' | 'warning' | 'error' }> = {
  green: { label: '低风险', color: 'success' },
  yellow: { label: '中风险', color: 'warning' },
  red: { label: '高风险', color: 'error' },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const { label, color } = RISK_MAP[level] || RISK_MAP.green;
  return <Chip label={label} color={color} size="small" />;
}
