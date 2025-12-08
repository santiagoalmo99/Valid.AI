// utils/storage.ts - Typed localStorage helpers for VALID.AI
// Centralizes all localStorage access patterns

import { ProjectTemplate, Interview } from '../types';

// Keys
const KEYS = {
  PROJECTS: 'validai_projects',
  VIEW: 'validai_view',
  ACTIVE_PROJECT: 'validai_active_project_id',
  LEADS: 'validai_leads',
  AUTO_BACKUP: 'validai_auto_backup',
  LAST_BACKUP: 'validai_last_auto_backup',
  ONBOARDING: 'onboarding_completed',
  TREND_REPORT: 'validai_trend_report',
} as const;

// Generic get/set with JSON parsing
function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error);
  }
}

// Projects
export function getProjects(): ProjectTemplate[] {
  return getItem<ProjectTemplate[]>(KEYS.PROJECTS, []);
}

export function setProjects(projects: ProjectTemplate[]): void {
  setItem(KEYS.PROJECTS, projects);
}

export function addProject(project: ProjectTemplate): void {
  const projects = getProjects();
  const exists = projects.findIndex(p => p.id === project.id);
  if (exists >= 0) {
    projects[exists] = project;
  } else {
    projects.push(project);
  }
  setProjects(projects);
}

export function updateProject(project: ProjectTemplate): void {
  const projects = getProjects().map(p => p.id === project.id ? project : p);
  setProjects(projects);
}

export function removeProject(projectId: string): void {
  const projects = getProjects().filter(p => p.id !== projectId);
  setProjects(projects);
}

// Interviews (per project)
export function getInterviews(projectId: string): Interview[] {
  return getItem<Interview[]>(`offline_interviews_${projectId}`, []);
}

export function setInterviews(projectId: string, interviews: Interview[]): void {
  setItem(`offline_interviews_${projectId}`, interviews);
}

export function addInterview(interview: Interview): void {
  const interviews = getInterviews(interview.projectId);
  const exists = interviews.findIndex(i => i.id === interview.id);
  if (exists >= 0) {
    interviews[exists] = interview;
  } else {
    interviews.push(interview);
  }
  setInterviews(interview.projectId, interviews);
}

export function removeInterview(projectId: string, interviewId: string): void {
  const interviews = getInterviews(projectId).filter(i => i.id !== interviewId);
  setInterviews(projectId, interviews);
}

// View State
export function getActiveView(): string {
  return localStorage.getItem(KEYS.VIEW) || 'hub';
}

export function setActiveView(view: string): void {
  localStorage.setItem(KEYS.VIEW, view);
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(KEYS.ACTIVE_PROJECT);
}

export function setActiveProjectId(id: string | null): void {
  if (id) {
    localStorage.setItem(KEYS.ACTIVE_PROJECT, id);
  } else {
    localStorage.removeItem(KEYS.ACTIVE_PROJECT);
  }
}

// Onboarding
export function isOnboardingComplete(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING) === 'true';
}

export function setOnboardingComplete(): void {
  localStorage.setItem(KEYS.ONBOARDING, 'true');
}

// Clear all data (for testing/reset)
export function clearAllData(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  // Also clear interview keys
  const allKeys = Object.keys(localStorage);
  allKeys.filter(k => k.startsWith('offline_interviews_')).forEach(k => localStorage.removeItem(k));
}

export { KEYS };
