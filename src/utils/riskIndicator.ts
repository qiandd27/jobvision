import type { RiskLevel } from '../types';
import { HIGH_RISK_FACTORS, MEDIUM_RISK_FACTORS } from './constants';

export function calculateRiskLevel(factors: string[]): RiskLevel {
  const highCount = factors.filter((f) => HIGH_RISK_FACTORS.includes(f)).length;
  const mediumCount = factors.filter((f) => MEDIUM_RISK_FACTORS.includes(f)).length;
  if (highCount > 0 || mediumCount >= 3) return 'red';
  if (mediumCount >= 1) return 'yellow';
  return 'green';
}
