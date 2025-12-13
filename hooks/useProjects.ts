import { useState, useEffect, useCallback } from 'react';
import { ProjectTemplate } from '../types';
import { INITIAL_PROJECTS, DEMO_PROJECT } from '../constants';
import * as FirebaseService from '../services/firebase';
import { templateToProject } from '../constants/templates';

export const useProjects = (user: any) => {
  const [projects, setProjects] = useState<ProjectTemplate[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(true);

  // Load Projects (Dual: Local + Cloud)
  useEffect(() => {
    if (!user) {
        setProjects(INITIAL_PROJECTS);
        return;
    }

    setLoading(true);

    // 1. Load Local
    const loadLocalProjects = (): ProjectTemplate[] => {
      try {
        const localProjects = JSON.parse(localStorage.getItem('validai_projects') || '[]');
        const userProjects = localProjects.filter((p: any) => p.userId === user.uid);
        return userProjects.length > 0 ? userProjects : [];
      } catch (e) {
        console.error('Error loading local projects:', e);
        return [];
      }
    };
    
    const localProjects = loadLocalProjects();
    if (localProjects.length > 0) {
      setProjects(prev => {
         // Merge with defaults
         const defaults = INITIAL_PROJECTS.filter(d => !localProjects.find(l => l.id === d.id));
         return [...defaults, ...localProjects];
      });
    }

    // 2. Subscribe Cloud
    const unsubscribe = FirebaseService.subscribeToProjects(user.uid, (data) => {
      // Merge Strategy: Defaults + Cloud + Local (Unique IDs)
      const allIds = new Set<string>();
      const merged: ProjectTemplate[] = [];

      // Add Defaults
      INITIAL_PROJECTS.forEach(p => {
         merged.push(p);
         allIds.add(p.id);
      });

      // Add Cloud
      data.forEach(p => {
         if (!allIds.has(p.id)) {
            merged.push(p);
            allIds.add(p.id);
         }
      });

      // Add Local (if not present)
      localProjects.forEach(p => {
         if (!allIds.has(p.id)) {
            merged.push(p);
            allIds.add(p.id);
         }
      });

      setProjects(merged);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Actions
  const createProject = useCallback(async (templateId: string) => {
     if (!user) throw new Error("User required");
     
     const template = templateToProject(templateId);
     const newProject: ProjectTemplate = {
       ...template,
       id: Date.now().toString(),
       userId: user.uid,
       createdAt: new Date().toISOString(),
       interviews: [],
       questions: template.questions || [],
       hypothesis: template.hypothesis || { problem: '', solution: '' }
     };

     // Optimistic Local Save
     try {
       const current = JSON.parse(localStorage.getItem('validai_projects') || '[]');
       localStorage.setItem('validai_projects', JSON.stringify([...current, newProject]));
     } catch (e) { console.error("LS Pre-save failed", e); }

     // UI Update
     setProjects(prev => [...prev, newProject]);

     // Cloud Save
     try {
        await FirebaseService.createProject(user.uid, newProject);
     } catch (e) {
        console.error("Cloud save failed", e);
        // Silent fail as local copy exists
     }

     return newProject;
  }, [user]);

  const updateProject = useCallback(async (updated: ProjectTemplate) => {
     // Optimistic Local
     if (updated.id === 'demo_project_001') {
        localStorage.setItem('demo_project_001', JSON.stringify(updated));
     } else {
        try {
           const local = JSON.parse(localStorage.getItem('validai_projects') || '[]');
           const next = local.map((p: any) => p.id === updated.id ? updated : p);
           if (!local.find((p: any) => p.id === updated.id)) next.push(updated);
           localStorage.setItem('validai_projects', JSON.stringify(next));
        } catch (e) { console.error("LS Update failed", e); }
     }

     // UI Update
     setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));

     // Cloud Update
     if (updated.id !== 'demo_project_001') {
        try {
           await FirebaseService.updateProject(updated);
        } catch (e) { console.error("Cloud update failed", e); }
     }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
     try {
        await FirebaseService.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        
        // Also remove from local
        try {
           const local = JSON.parse(localStorage.getItem('validai_projects') || '[]');
           const next = local.filter((p: any) => p.id !== id);
           localStorage.setItem('validai_projects', JSON.stringify(next));
        } catch (e) { console.error("LS Delete failed", e); }

     } catch (e) {
        console.error("Delete failed", e);
        throw e;
     }
  }, []);

  return { projects, loading, createProject, updateProject, deleteProject };
};
