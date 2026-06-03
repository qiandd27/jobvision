export type RiskLevel = 'green' | 'yellow' | 'red';
export type DataSource = 'boss' | 'lagou' | '51job' | 'zhilian' | 'manual';
export type ApplicationStatus = 'saved' | 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected' | 'archived';

export interface Job {
  id: string; title: string; companyName: string; companyId: string;
  city: string; district?: string; salaryMin: number; salaryMax: number; salaryMonths: number;
  experience: string; education: string; tags: string[]; description: string;
  sourceUrl: string; source: DataSource; postedAt: string; matchScore: number; riskLevel: RiskLevel;
  company?: { industry: string; riskLevel: RiskLevel; shortName?: string; size?: string; riskFactors: string[]; employeeReviewSummary?: string; antiOvertimeIndex?: number };
}

export interface CompanyIntel {
  id: string; name: string; shortName?: string; industry: string; size: string;
  registeredCapital?: string; establishedAt?: string; address?: string;
  riskLevel: RiskLevel; riskFactors: string[]; employeeReviewSummary: string; antiOvertimeIndex: number; logo?: string;
}

export interface Application {
  id: string; jobId: string; jobSnapshot: { title: string; companyName: string; city: string; salaryMin: number; salaryMax: number };
  status: ApplicationStatus; appliedAt: string; updatedAt: string; notes: string;
  resumeVersion?: string; followUpDate?: string; interviewDate?: string;
}

export interface UserProfile {
  name: string; city: string; targetCities: string[]; industries: string[]; skills: string[];
  expectedSalaryMin: number; expectedSalaryMax: number; education: string; experienceYears: number;
  resumeText?: string; resumeStructured?: ResumeData;
}

export interface ResumeData {
  personal: { name: string; phone?: string; email?: string; city?: string };
  education: Array<{ school: string; degree: string; major: string; startYear: number; endYear: number }>;
  experience: Array<{ company: string; title: string; startDate: string; endDate?: string; description: string }>;
  projects: Array<{ name: string; description: string; techStack: string[] }>;
  skills: string[]; rawText: string;
}

export interface FilterState {
  city: string; industry: string; salaryRange: [number, number]; experience: string; education: string;
  keywords: string; matchScoreMin: number; riskLevel: RiskLevel | 'all'; source: DataSource | 'all';
  sortBy: 'matchScore' | 'salary' | 'postedAt'; sortOrder: 'asc' | 'desc';
}
