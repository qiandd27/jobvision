import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { Job, UserProfile } from '../../types';
import type { EChartsOption } from 'echarts';

interface MatchRadarProps { job: Job; profile: UserProfile | null; }

export default function MatchRadar({ job, profile }: MatchRadarProps) {
  const option: EChartsOption = useMemo(() => {
    const indicators = [{name:'技术深度',max:100},{name:'项目经验',max:100},{name:'行业匹配',max:100},{name:'学历背景',max:100},{name:'软技能',max:100},{name:'薪资匹配',max:100}];
    return {
      legend: { bottom: 0, data: ['岗位需求','你的简历'], textStyle:{fontSize:10} },
      radar: { indicator: indicators, center: ['50%','48%'], radius: '60%' },
      series: [{
        type: 'radar',
        data: [
          { value: [job.matchScore, 85, 70, 75, 80, 65], name: '岗位需求', itemStyle: { color: '#1976D2' }, areaStyle: { opacity: 0.1 } },
          { value: profile ? [calculateSkill(job,profile), 70, 65, 70, 75, 60] : [0,0,0,0,0,0], name: '你的简历', itemStyle: { color: '#2E7D32' }, areaStyle: { opacity: 0.1 } },
        ],
      }],
    };
  }, [job, profile]);
  return <ReactEChartsCore option={option} style={{ height: 280 }} />;
}

function calculateSkill(job: Job, profile: UserProfile): number {
  const jdLower = (job.tags.join(' ') + job.description).toLowerCase();
  const matched = profile.skills.filter(s => jdLower.includes(s.toLowerCase()));
  return Math.min(100, Math.round(profile.skills.length > 0 ? (matched.length / profile.skills.length) * 100 : 50));
}
