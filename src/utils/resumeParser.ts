import type { ResumeData } from '../types';

const SKILL_BANK = ['JavaScript','TypeScript','React','Vue','Angular','Node.js','Python','Java','Go','Rust','C++','C#','PHP','Ruby','Swift','Kotlin','SQL','MySQL','PostgreSQL','MongoDB','Redis','Docker','Kubernetes','AWS','Azure','GCP','Git','Linux','Nginx','GraphQL','REST','gRPC','Webpack','Vite','Next.js','Spring','Django','Flask','TensorFlow','PyTorch'];

export function parseResumeText(text: string): ResumeData {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const nameMatch = text.match(/([姓名])[：:]s*(\S{2,4})/) || text.match(/^(\S{2,4})\s*[|｜]/);
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const phoneMatch = text.match(/(1[3-9]\d{9})/);
  const cityMatch = text.match(/(北京|上海|广州|深圳|杭州|成都|南京|武汉|西安|苏州)/);
  const schoolMatch = text.match(/([大学学院])\s*[,，]?\s*(\S+专业)?/);
  const skills = SKILL_BANK.filter((s) => text.toLowerCase().includes(s.toLowerCase()));
  const expMatches = text.match(/\d+\s*年[^龄]/g);
  const experiences = (expMatches || []).map((m, i) => ({ company: `经历${i + 1}`, title: '', startDate: '', description: m }));

  return {
    personal: { name: nameMatch?.[1] || nameMatch?.[2] || '', phone: phoneMatch?.[1], email: emailMatch?.[1], city: cityMatch?.[1] },
    education: schoolMatch ? [{ school: schoolMatch[0], degree: '本科', major: schoolMatch[2] || '', startYear: 2018, endYear: 2022 }] : [],
    experience: experiences,
    projects: [],
    skills,
    rawText: text,
  };
}
