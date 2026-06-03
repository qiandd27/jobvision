import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import { useJobStore } from '../../store';
import type { EChartsOption } from 'echarts';

export default function CompanyRiskRadar() {
  const companies = useJobStore(s => s.companies);
  const option: EChartsOption = useMemo(() => {
    const top = [...companies].sort((a,b) => ({red:3,yellow:2,green:1}[b.riskLevel]||0) - ({red:3,yellow:2,green:1}[a.riskLevel]||0)).slice(0,5);
    const indicators = [{name:'工商健康',max:100},{name:'员工满意',max:100},{name:'法律合规',max:100},{name:'经营稳定',max:100},{name:'发展前景',max:100}];
    const riskColor = (l:string) => l==='red'?'#D32F2F':l==='yellow'?'#ED6C02':'#2E7D32';
    return {
      legend: { bottom: 0, data: top.map(c=>c.shortName||c.name), textStyle:{fontSize:9} },
      radar: { indicator: indicators, center: ['50%','45%'], radius: '60%' },
      series: [{
        type: 'radar',
        data: top.map(c => ({ value: [50+Math.random()*50, 30+Math.random()*40, 40+Math.random()*40, c.antiOvertimeIndex, 45+Math.random()*40], name: c.shortName||c.name, itemStyle: { color: riskColor(c.riskLevel) } })),
        symbol: 'circle', symbolSize: 4, lineStyle: { width: 2 }, areaStyle: { opacity: 0.08 },
      }],
    };
  }, [companies]);
  return <ReactEChartsCore option={option} style={{ height: 250 }} />;
}
