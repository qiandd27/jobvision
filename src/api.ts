const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || `HTTP ${res.status}`); }
  return res.json();
}

export async function fetchJobs(filters: Record<string,any> = {}) {
  const params = new URLSearchParams();
  for (const [k,v] of Object.entries(filters)) { if (v !== undefined && v !== '' && v !== 'all') params.set(k, String(v)); }
  return request<{ data: any[]; pagination: any }>(`/jobs?${params}`);
}

export async function fetchJobById(id: string) { return request<{ data: any }>(`/jobs/${id}`); }
export async function fetchFilterMeta() { return request<{ cities: string[]; industries: string[] }>('/jobs/meta/filters'); }
export async function fetchApplications(status?: string) { return request<{ data: any[] }>(`/applications${status ? '?status='+status : ''}`); }
export async function createApplication(jobId: string, notes?: string) { return request<{ id: string }>('/applications', { method: 'POST', body: JSON.stringify({ job_id: jobId, notes }) }); }
export async function updateApplicationStatus(id: string, status: string) { return request<{ success: boolean }>(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
export async function deleteApplication(id: string) { return request<{ success: boolean }>(`/applications/${id}`, { method: 'DELETE' }); }
export async function fetchApplicationStats() { return request<{ total: number; funnel: any }>('/applications/meta/stats'); }
export async function crawlBossJobs(city: string, keyword: string, maxPages = 3) { return request<any>('/crawler/boss', { method: 'POST', body: JSON.stringify({ city, keyword, maxPages }) }); }
export async function getCrawlStatus() { return request<{ jobs: any; companies: number }>('/crawler/status'); }
export async function analyzeResume(text: string, jobId?: string, jt?: string, jd?: string) { return request<any>('/ai/analyze-resume', { method: 'POST', body: JSON.stringify({ resumeText: text, jobId, jobTitle: jt, jobDescription: jd }) }); }
export async function generateInterviewQuestions(jobId?: string, jt?: string, jd?: string) { return request<{ questions: any[]; total: number }>('/ai/interview-questions', { method: 'POST', body: JSON.stringify({ jobId, jobTitle: jt, jobDescription: jd }) }); }
