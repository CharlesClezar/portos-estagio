import axios from 'axios';
import { ApiFilters } from '@/types/port';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const portApi = {
  getResumo: () => api.get('/dashboard/resumo'),
  
  getVolumeDiario: (start: string, end: string, portid?: string) =>
    api.get('/dashboard/volume-diario', { params: { start, end, portid } }),

  getChamadasDiarias: (start: string, end: string, portid?: string) =>
    api.get('/dashboard/chamadas-diarias', { params: { start, end, portid } }),

  getDistribuicaoTipos: () => api.get('/dashboard/tipos'),

  getTopPortos: () => api.get('/dashboard/top-portos'),

  searchPorts: (search: string) => api.get('/ports', { params: { search } }),

  getPortActivity: (filters: ApiFilters) => api.get('/dashboard/atividade', { params: filters }),
};

export default api;
