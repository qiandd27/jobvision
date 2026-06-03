import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import { useJobStore } from '../../store';
import type { EChartsOption } from 'echarts';

const CITY_LIST = ['北京','上海','广州','深圳','杭州'];
const IND_LIST = ['互联网/IT','金融','教育','医疗','制造'];

export default function SalaryHeatmap() {
  const jobs = useJobStore(s => s.jobs);
  const option: EChartsOption = useMemo(() => {
    const data: [number,number,number][] = [];
    CITY_LIST.forEach((city, ci) => {
      IND_LIST.forEach((ind, ii) => {
        const matches = jobs.filter(j => j.city === city);
        const avg = matches.length > 0 ? matches.reduce((s,j) => s + (j.salaryMin+j.salaryMax)/2, 0) / matches.length : 0;
        if (avg > 0) data.push([ii, ci, Math.round(avg)]);
      });
    });
    return {
      tooltip: { formatter: (p: any) => `${IND_LIST[p.value[0]]} · ${CITY_LIST[p.value[1]]}<br/>均薪: ${p.value[2]}K` },
      grid: { left: 80, right: 20, top: 20, bottom: 50 },
      xAxis: { type: 'category', data: IND_LIST, axisLabel: { fontSize: 10 }, splitArea: { show: true } },
      yAxis: { type: 'category', data: CITY_LIST, axisLabel: { fontSize: 10 }, splitArea: { show: true } },
      visualMap: { min: 15, max: 50, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#BBDEFB','#42A5F5','#1565C0'] } },
      series: [{ type: 'heatmap', data, label: { show: true, fontSize: 9 }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }],
    };
  }, [jobs]);
  return <ReactEChartsCore option={option} style={{ height: 250 }} />;
}
