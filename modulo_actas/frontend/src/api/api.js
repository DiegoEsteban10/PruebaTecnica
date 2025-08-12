import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api'
});


api.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export const crearGestion =  async (token, formData) => {
    const response = await axios.post('http://localhost:8000/api/gestiones/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
        }
    });
    return response.data;
};

export const ListarCompromisos =  async () => {
    const res = await api.get('/compromisos/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
}

export const marcarCompromisoCompleto =  async (id) => {
    const res = await api.put(`/compromisos/${id}/marcar_completado/`);
    return res.data;
}
        
    



export default api;