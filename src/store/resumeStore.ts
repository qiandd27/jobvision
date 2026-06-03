import { create } from 'zustand';
import type { ResumeData, UserProfile } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { parseResumeText } from '../utils/resumeParser';

function loadProfile(): UserProfile | null { try { const s = localStorage.getItem(STORAGE_KEYS.USER_PROFILE); return s ? JSON.parse(s) : null; } catch { return null; } }

interface ResumeState {
  userProfile: UserProfile | null; resumeText: string; resumeData: ResumeData | null; parsing: boolean; parseError: string | null;
  parseResume: (file: File) => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
  clearResume: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  userProfile: loadProfile(), resumeText: '', resumeData: null, parsing: false, parseError: null,
  parseResume: async (file) => {
    set({ parsing: true, parseError: null });
    try {
      const text = await extractText(file);
      const data = parseResumeText(text);
      set({ resumeText: text, resumeData: data, parsing: false });
    } catch (e) { set({ parsing: false, parseError: (e as Error).message }); }
  },
  setUserProfile: (profile) => { localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile)); set({ userProfile: profile }); },
  clearResume: () => set({ resumeText: '', resumeData: null, parseError: null }),
}));

async function extractText(file: File): Promise<string> {
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const pdfjsLib = await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const texts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      texts.push(content.items.map((item: any) => item.str || '').join(' '));
    }
    return texts.join('\n');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
}
