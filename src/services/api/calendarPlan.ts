import axios from 'axios';

const API_URL = '/api/calendar-plan';

const api = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savePlan: async (data: { keyword: string; password: string; plan: any }) => {
    const res = await axios.post(`${API_URL}/save`, data);
    return res.data;
  },
  loadPlan: async (data: { keyword: string; password: string }) => {
    const res = await axios.post(`${API_URL}/load`, data);
    return res.data;
  },
};

export default api;
