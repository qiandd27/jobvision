import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { Application } from '../../types';
import type { EChartsOption } from 'echarts';

const STATUS_ORDER = ['applied','viewed','interview','offer'];
const STATUS_LABELS: Record<string,string> = { applied:'已投递', viewed:'已查看', interview:'面试中', offer:'Offer' };

export default function FunnelChart({ applications }: { applications: Application[] }) {
  const option: EChartsOption = useMemo(() => {
    const counts = STATUS_ORDER.map(s => ({ name: STATUS_LABELS[s], value: applications.filter(a => a.status === s).length || applications.filter(a => STATUS_ORDER.indexOf(a.status) >= STATUS_ORDER.indexOf(s)).length }));
    return {
      tooltip: { formatter: '{b}: {c}人' },
      series: [{ type: 'funnel', left: '10%', right: '10%', top: 20, bottom: 20, data: counts, gap: 2, label: { show: true, position: 'inside', fontSize: 12 }, itemStyle: { borderWidth: 0 } }],
    };
  }, [applications]);
  return <ReactEChartsCore option={option} style={{ height: 150 }} />;
}
