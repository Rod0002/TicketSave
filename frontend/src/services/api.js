import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: (data) => api.post('/auth/login', data),
  cadastro: (data) => api.post('/auth/cadastro', data),
};

export const ticketService = {
  listar: () => api.get('/tickets'),
  buscarPorId: (id) => api.get(`/tickets/${id}`),
  buscarPorStatus: (status) => api.get(`/tickets/status/${status}`),
  criar: (ticket) => api.post('/tickets', ticket),
  atualizarStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),
  atualizar: (id, ticket) => api.put(`/tickets/${id}`, ticket),
  deletar: (id) => api.delete(`/tickets/${id}`),
  
  // A MUDANÇA ESTÁ AQUI
  exportarCSV: async () => {
    try {
      const response = await api.get('/tickets/export', { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_tickets.csv'); 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Não foi possível baixar o relatório. Verifique o console.');
    }
  },
};

export default api;