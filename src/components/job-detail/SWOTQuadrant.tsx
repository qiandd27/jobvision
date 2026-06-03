import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { Job, CompanyIntel } from '../../types';
import type { EChartsOption } from 'echarts';

interface SWOTProps { job: Job; company: CompanyIntel | undefined; }

export default function SWOTQuadrant({ job, company }: SWOTProps) {
  const option: EChartsOption = useMemo(() => {
    const items = [
      { value: [25, 65], name: `优势\n前端技术栈` },
      { value: [75, 65], name: `机会\n${company?.industry || '互联网'}\n增长快` },
      { value: [25, 25], name: `劣势\n${job.experience}经验` },
      { value: [75, 25], name: `风险\n${job.riskLevel==='red'?'高风险关注':job.riskLevel==='yellow'?'中风险':'低风险'}` },
    ];
    return {
      grid: { left: 0, right: 0, top: 10, bottom: 10 },
      xAxis: { min: 0, max: 100, show: false, axisLine: { show: true, lineStyle: { color: '#ccc' } }, splitLine: { show: true, lineStyle: { color: '#eee', type: 'dashed' }, interval: 50 } },
      yAxis: { min: 0, max: 100, show: false, axisLine: { show: true, lineStyle: { color: '#ccc' } }, splitLine: { show: true, lineStyle: { color: '#eee', type: 'dashed' }, interval: 50 } },
      series: [{
        type: 'scatter', data: items,
        symbolSize: (v: number[]) => v[0] > 50 ? 120 : 100,
        label: { show: true, formatter: (p: any) => p.name, fontSize: 10, lineHeight: 14 },
        itemStyle: { color: (p: any) => p.dataIndex === 0 ? '#2E7D32' : p.dataIndex === 1 ? '#1976D2' : p.dataIndex === 2 ? '#ED6C02' : '#D32F2F', opacity: 0.2 },
        emphasis: { itemStyle: { opacity: 0.4 } },
      }],
    };
  }, [job, company]);
  return <ReactEChartsCore option={option} style={{ height: 200 }} />;
}
