import { create } from 'zustand';
import type { Job, CompanyIntel, UserProfile } from '../types';
import { fetchJobs, fetchJobById, fetchFilterMeta } from '../api';
import { calculateMatchScore } from '../utils/matchScore';

interface JobState {
  jobs: Job[]; companies: CompanyIntel[]; loading: boolean; error: string | null;
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  filterMeta: { cities: string[]; industries: string[] };
  loadJobs: (filters?: any) => Promise<void>;
  getJobById: (id: string) => Promise<Job | undefined>;
  getCompanyById: (id: string) => CompanyIntel | undefined;
  loadFilterMeta: () => Promise<void>;
  getDashboardMetrics: (profile?: UserProfile) => any;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [], companies: [], loading: false, error: null, pagination: { page:1, page_size:20, total:0, total_pages:0 }, filterMeta: { cities:[], industries:[] },
  loadJobs: async (filters) => {
    set({ loading: true, error: null });
    try { const r = await fetchJobs(filters); set({ jobs: r.data as Job[], pagination: r.pagination as any, loading: false }); }
    catch (e) { set({ error: (e as Error).message, loading: false }); }
  },
  getJobById: async (id) => { try { const r = await fetchJobById(id); return r.data as Job; } catch { return undefined; } },
  getCompanyById: (id) => get().companies.find(c => c.id === id),
  loadFilterMeta: async () => { try { const m = await fetchFilterMeta(); set({ filterMeta: { cities: m.cities, industries: m.industries }, companies: m.industries.map((ind,i)=>({ id:`dyn-${i}`, name:ind, industry:ind, size:'', riskLevel:'green', riskFactors:[], employeeReviewSummary:'', antiOvertimeIndex:50 })) }); } catch {} },
  getDashboardMetrics: (profile) => {
    const { jobs } = get();
    let matched = 0;
    if (profile) matched = jobs.filter(j => calculateMatchScore(j, profile) >= 60).length;
    const cityCount = new Map<string,number>(); jobs.forEach(j => cityCount.set(j.city, (cityCount.get(j.city)||0)+1));
    const industryCount = new Map<string,number>();
    get().companies.forEach(c => { jobs.filter(j => j.companyId===c.id).forEach(() => industryCount.set(c.industry, (industryCount.get(c.industry)||0)+1)); });
    return {
      totalJobs: jobs.length, matchedJobs: matched,
      applicationProgress: { total:0, applied:0, viewed:0, interview:0, offer:0 },
      topCities: [...cityCount].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([city,count])=>({city,count})),
      topIndustries: [...industryCount].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([industry,count])=>({industry,count})),
    };
  },
}));
