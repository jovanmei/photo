const GIST_API_URL = 'https://api.github.com/gists';
const GIST_ID_KEY = 'photoGallery_gistId';
const GIST_TOKEN_KEY = 'photoGallery_gistToken';
const LAST_SYNC_KEY = 'photoGallery_lastSync';
const GIST_FILENAME = 'photo-gallery-data.json';

interface GistFile {
  filename: string;
  content: string;
}

interface GistResponse {
  id: string;
  html_url: string;
  files: {
    [filename: string]: {
      content: string;
    };
  };
  updated_at: string;
}

interface SyncStatus {
  isConnected: boolean;
  gistId: string | null;
  gistUrl: string | null;
  lastSyncTime: string | null;
}

export const GistSyncService = {
  getToken: (): string | null => {
    return localStorage.getItem(GIST_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(GIST_TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(GIST_TOKEN_KEY);
  },

  getGistId: (): string | null => {
    return localStorage.getItem(GIST_ID_KEY);
  },

  setGistId: (id: string): void => {
    localStorage.setItem(GIST_ID_KEY, id);
  },

  removeGistId: (): void => {
    localStorage.removeItem(GIST_ID_KEY);
  },

  getLastSyncTime: (): string | null => {
    return localStorage.getItem(LAST_SYNC_KEY);
  },

  setLastSyncTime: (time: string): void => {
    localStorage.setItem(LAST_SYNC_KEY, time);
  },

  removeLastSyncTime: (): void => {
    localStorage.removeItem(LAST_SYNC_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!GistSyncService.getToken();
  },

  getSyncStatus: (): SyncStatus => {
    const token = GistSyncService.getToken();
    const gistId = GistSyncService.getGistId();
    const lastSyncTime = GistSyncService.getLastSyncTime();
    
    return {
      isConnected: !!token,
      gistId: gistId,
      gistUrl: gistId ? `https://gist.github.com/${gistId}` : null,
      lastSyncTime: lastSyncTime
    };
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  createGist: async (data: any): Promise<{ id: string; url: string }> => {
    const token = GistSyncService.getToken();
    if (!token) throw new Error('No GitHub token configured');

    const response = await fetch(GIST_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        description: 'Photo Gallery Backup - Synced across devices',
        public: false,
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create Gist (${response.status})`);
    }
    
    const gist: GistResponse = await response.json();
    GistSyncService.setGistId(gist.id);
    
    return { 
      id: gist.id, 
      url: gist.html_url 
    };
  },

  updateGist: async (data: any): Promise<{ id: string; url: string }> => {
    const token = GistSyncService.getToken();
    const gistId = GistSyncService.getGistId();
    
    if (!token) throw new Error('No GitHub token configured');
    
    if (!gistId) {
      return GistSyncService.createGist(data);
    }

    const response = await fetch(`${GIST_API_URL}/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        GistSyncService.removeGistId();
        return GistSyncService.createGist(data);
      }
      throw new Error(errorData.message || `Failed to update Gist (${response.status})`);
    }
    
    const gist: GistResponse = await response.json();
    
    return { 
      id: gist.id, 
      url: gist.html_url 
    };
  },

  downloadGist: async (): Promise<any> => {
    const token = GistSyncService.getToken();
    const gistId = GistSyncService.getGistId();
    
    if (!token) throw new Error('No GitHub token configured');
    if (!gistId) throw new Error('No Gist ID found. Please upload data first.');

    const response = await fetch(`${GIST_API_URL}/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        GistSyncService.removeGistId();
        throw new Error('Gist not found. It may have been deleted.');
      }
      throw new Error(errorData.message || `Failed to download Gist (${response.status})`);
    }
    
    const gist: GistResponse = await response.json();
    const content = gist.files[GIST_FILENAME]?.content;
    
    if (!content) {
      throw new Error('No data found in Gist');
    }
    
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('Invalid JSON data in Gist');
    }
  },

  deleteGist: async (): Promise<void> => {
    const token = GistSyncService.getToken();
    const gistId = GistSyncService.getGistId();
    
    if (!token || !gistId) return;

    try {
      await fetch(`${GIST_API_URL}/${gistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
        }
      });
    } catch (error) {
      console.error('Failed to delete Gist:', error);
    }

    GistSyncService.removeGistId();
  },

  disconnect: (): void => {
    GistSyncService.removeToken();
    GistSyncService.removeGistId();
    GistSyncService.removeLastSyncTime();
  },

  upload: async (data: any): Promise<{ id: string; url: string }> => {
    const result = await GistSyncService.updateGist(data);
    const now = new Date().toISOString();
    GistSyncService.setLastSyncTime(now);
    return result;
  },

  download: async (): Promise<any> => {
    const data = await GistSyncService.downloadGist();
    const now = new Date().toISOString();
    GistSyncService.setLastSyncTime(now);
    return data;
  }
};
