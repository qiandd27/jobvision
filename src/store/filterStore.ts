import { create } from 'zustand';
import type { FilterState } from '../types';

const defaults: FilterState = { city:'', industry:'', salaryRange:[0,80], experience:'', education:'', keywords:'', matchScoreMin:0, riskLevel:'all', source:'all', sortBy:'postedAt', sortOrder:'desc' };

interface FilterState2 { filters: FilterState; setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void; resetFilters: () => void; }

export const useFilterStore = create<FilterState2>((set) => ({
  filters: { ...defaults },
  setFilter: (key, value) => set(s => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: { ...defaults } }),
}));
