import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { Application } from '../../types';
import type { EChartsOption } from 'echarts';

export default function CalendarHeatmap({ applications }: { applications: Application[] }) {
  const option: EChartsOption = useMemo(() => {
    const dateMap = new Map<string, number>();
    applications.forEach(a => { const d = a.appliedAt?.split('T')[0]; if (d) dateMap.set(d, (dateMap.get(d)||0)+1); });
    const data = [...dateMap.entries()].map(([d, v]) => [d, v]);
    return {
      visualMap: { min: 0, max: 5, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#EBEDF0','#9BE9A8','#40C463','#30A14E','#216E39'] } },
      calendar: { range: '2026', cellSize: ['auto', 14], top: 30 },
      series: [{ type: 'heatmap', coordinateSystem: 'calendar', data }],
    };
  }, [applications]);
  return <ReactEChartsCore option={option} style={{ height: 180 }} />;
}
