import { create } from 'zustand';
import type { Application, ApplicationStatus } from '../types';
import { fetchApplications, createApplication, updateApplicationStatus, deleteApplication, fetchApplicationStats } from '../api';

interface AppState {
  applications: Application[]; loading: boolean; error: string | null;
  stats: { total: number; byStatus: Record<string,number>; funnel: Record<string,number> };
  loadApplications: () => Promise<void>;
  addApplication: (jobId: string, notes?: string) => Promise<{id:string}>;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
  loadStats: () => Promise<void>;
}

export const useApplicationStore = create<AppState>((set, get) => ({
  applications: [], loading: false, error: null, stats: { total:0, byStatus:{}, funnel:{applied:0,viewed:0,interview:0,offer:0} },
  loadApplications: async () => { set({ loading:true }); try { const r = await fetchApplications(); set({ applications: r.data as Application[], loading:false }); } catch(e) { set({ error:(e as Error).message, loading:false }); } },
  addApplication: async (jobId, notes) => { const r = await createApplication(jobId, notes); await get().loadApplications(); await get().loadStats(); return r; },
  updateStatus: async (id, status) => { await updateApplicationStatus(id, status); set(s => ({ applications: s.applications.map(a => a.id===id ? {...a, status, updatedAt: new Date().toISOString()} : a) })); await get().loadStats(); },
  removeApplication: async (id) => { await deleteApplication(id); set(s => ({ applications: s.applications.filter(a => a.id!==id) })); await get().loadStats(); },
  loadStats: async () => { try { const s = await fetchApplicationStats(); set({ stats: s }); } catch {} },
}));
