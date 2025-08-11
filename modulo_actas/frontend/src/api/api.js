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

export const crearGestion =  async (token, datos = {}) => {
    const formData = new FormData();
    formData.append("acta", datos.acta);
    formData.append("fecha", datos.fecha);
    formData.append("descripcion", datos.descripcion);
    formData.append("archivo_adjunto" , datos.archivo_adjunto)

    const response = await axios.post('http://localhost:8000/api/gestiones/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;

}


export default api;