export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getApiUrl = (path: string) => `${API_URL}${path}`;

// Update this when deploying to production
export const updateApiUrl = (newUrl: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('API_URL', newUrl);
  }
};

export const getStoredApiUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('API_URL') || API_URL;
  }
  return API_URL;
};