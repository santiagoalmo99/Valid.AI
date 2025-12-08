// utils/backup.ts - Local Data Backup System
// Provides export and import functionality for VALID.AI data

import { ProjectTemplate, Interview } from '../types';

/**
 * Backup all user data to a JSON file download
 */
export function exportAllData(userId: string): void {
  try {
    // Gather all data sources
    const projects = JSON.parse(localStorage.getItem('validai_projects') || '[]');
    const view = localStorage.getItem('validai_view');
    const activeProjectId = localStorage.getItem('validai_active_project_id');
    
    // Collect all interview data
    const allInterviews: Record<string, Interview[]> = {};
    projects.forEach((p: ProjectTemplate) => {
      const key = `offline_interviews_${p.id}`;
      const interviews = JSON.parse(localStorage.getItem(key) || '[]');
      if (interviews.length > 0) {
        allInterviews[p.id] = interviews;
      }
    });

    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      userId,
      data: {
        projects,
        interviews: allInterviews,
        settings: {
          view,
          activeProjectId
        }
      }
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validai_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Backup exported successfully');
  } catch (error) {
    console.error('❌ Backup export failed:', error);
    throw error;
  }
}

/**
 * Import data from a backup JSON file
 */
export function importBackup(file: File): Promise<{ projects: number; interviews: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string);
        
        // Validate backup structure
        if (!backup.version || !backup.data) {
          throw new Error('Invalid backup file format');
        }

        // Import projects
        if (backup.data.projects) {
          localStorage.setItem('validai_projects', JSON.stringify(backup.data.projects));
        }

        // Import interviews
        let interviewCount = 0;
        if (backup.data.interviews) {
          Object.entries(backup.data.interviews).forEach(([projectId, interviews]) => {
            localStorage.setItem(`offline_interviews_${projectId}`, JSON.stringify(interviews));
            interviewCount += (interviews as Interview[]).length;
          });
        }

        // Import settings
        if (backup.data.settings) {
          if (backup.data.settings.view) {
            localStorage.setItem('validai_view', backup.data.settings.view);
          }
          if (backup.data.settings.activeProjectId) {
            localStorage.setItem('validai_active_project_id', backup.data.settings.activeProjectId);
          }
        }

        console.log('✅ Backup imported successfully');
        resolve({
          projects: backup.data.projects?.length || 0,
          interviews: interviewCount
        });
      } catch (error) {
        console.error('❌ Backup import failed:', error);
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read backup file'));
    reader.readAsText(file);
  });
}

/**
 * Create automatic backup in localStorage (daily)
 */
export function createAutoBackup(): void {
  const lastBackupKey = 'validai_last_auto_backup';
  const backupDataKey = 'validai_auto_backup';
  
  const lastBackup = localStorage.getItem(lastBackupKey);
  const today = new Date().toISOString().split('T')[0];
  
  // Only backup once per day
  if (lastBackup === today) {
    return;
  }

  try {
    const projects = JSON.parse(localStorage.getItem('validai_projects') || '[]');
    
    // Collect interviews
    const allInterviews: Record<string, any[]> = {};
    projects.forEach((p: ProjectTemplate) => {
      const key = `offline_interviews_${p.id}`;
      const interviews = JSON.parse(localStorage.getItem(key) || '[]');
      if (interviews.length > 0) {
        allInterviews[p.id] = interviews;
      }
    });

    const autoBackup = {
      date: today,
      projects,
      interviews: allInterviews
    };

    localStorage.setItem(backupDataKey, JSON.stringify(autoBackup));
    localStorage.setItem(lastBackupKey, today);
    
    console.log('📦 Auto backup created:', today);
  } catch (error) {
    console.error('Auto backup failed:', error);
  }
}

/**
 * Restore from auto backup
 */
export function restoreFromAutoBackup(): boolean {
  try {
    const backupData = localStorage.getItem('validai_auto_backup');
    if (!backupData) {
      return false;
    }

    const backup = JSON.parse(backupData);
    
    // Restore projects
    if (backup.projects) {
      localStorage.setItem('validai_projects', JSON.stringify(backup.projects));
    }

    // Restore interviews
    if (backup.interviews) {
      Object.entries(backup.interviews).forEach(([projectId, interviews]) => {
        localStorage.setItem(`offline_interviews_${projectId}`, JSON.stringify(interviews));
      });
    }

    console.log('✅ Restored from auto backup:', backup.date);
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
}
