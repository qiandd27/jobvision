import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { Job } from '../../types';
import type { EChartsOption } from 'echarts';

interface SalaryChartProps { job: Job; }

export default function SalaryChart({ job }: SalaryChartProps) {
  const option: EChartsOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie', radius: ['45%','70%'], center: ['50%','55%'],
        data: [
          { value: Math.round(job.salaryMin * 0.7), name: '底薪' },
          { value: Math.round(job.salaryMin * 0.2), name: '绩效' },
          { value: Math.round(job.salaryMin * 0.1), name: '福利补贴' },
        ],
        label: { fontSize: 11 },
      },
    ],
  }), [job]);
  return (
    <div>
      <ReactEChartsCore option={option} style={{ height: 220 }} />
      <div style={{ textAlign: 'center', fontSize: 13, color: '#666' }}>
        月薪 {job.salaryMin}K-{job.salaryMax}K · {job.salaryMonths}薪 · 年薪约 {job.salaryMin * job.salaryMonths}K-{job.salaryMax * job.salaryMonths}K
      </div>
    </div>
  );
}
