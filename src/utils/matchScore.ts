import type { Job, UserProfile } from '../types';
import { MATCH_WEIGHTS } from './constants';

export function calculateMatchScore(job: Job, profile: UserProfile): number {
  let skillScore = 0.5;
  if (profile.skills.length > 0) {
    const jdLower = (job.tags.join(' ') + ' ' + job.description).toLowerCase();
    const matched = profile.skills.filter((s) => jdLower.includes(s.toLowerCase()));
    skillScore = matched.length / Math.max(profile.skills.length, 1);
    skillScore = Math.min(skillScore * 1.2, 1);
  }
  const expDiff = Math.abs(profile.experienceYears - 3);
  const expScore = Math.max(0, 1 - expDiff * 0.15);
  const eduScore = profile.education === '硕士' ? 0.9 : profile.education === '本科' ? 0.7 : profile.education === '博士' ? 0.95 : 0.5;
  const jobMid = (job.salaryMin + job.salaryMax) / 2;
  const profileMid = (profile.expectedSalaryMin + profile.expectedSalaryMax) / 2;
  const salaryRatio = Math.min(jobMid, profileMid) / Math.max(jobMid, profileMid);
  const salaryScore = Math.max(0, salaryRatio);

  return Math.round(
    (skillScore * MATCH_WEIGHTS.skills + expScore * MATCH_WEIGHTS.experience + eduScore * MATCH_WEIGHTS.education + salaryScore * MATCH_WEIGHTS.salary) * 100
  );
}
