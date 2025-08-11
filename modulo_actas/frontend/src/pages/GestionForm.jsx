import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearGestion } from "../api/api";
import { useAuth } from "../hooks/useAuth";

const GestionForm = () => {
    const { token } = useAuth();
    const { id } = useParams();    
    const navigate = useNavigate();

    const [fecha, setFecha] = useState('');    
    const [descripcion, setDescripcion] = useState('');    
    const [archivo_adjunto, setArchivo_adjunto] = useState('');
    const [error, setError] = useState("");

    const validarArchivo = (file) => {
        if (!file) {
            setError('Debes seleccionar un archivo');
            return false;
        }

        const ext = file.name.split('.').pop().toLowerCase();
        if (!['jpg', 'pdf'].includes(ext)) {
            setError('El archivo debe ser un PDF o en JPG');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('El archivo debe ser menor a 5MB');
            return false;
        }
        setError('');
        return true;
    };
}

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarArchivo(archivo_adjunto)) return;

        try {
            const formData = new FormData();
            formData.append('acta', id);
            formData.append('fecha', fecha);
            formData.append('descripcion', descripcion);
            formData.append('archivo_adjunto', archivo_adjunto);

            await crearGestion(token, formData);
            navigate(`/actas/${id}`);
        } catch (error) {
            setError("Error al crear la gestion")
        }
    };


    return (
    <div>
        <h2>Nueva Gestión</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
        <label>Fecha:</label>
        <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
        />

        <label>Descripción:</label>
        <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
        ></textarea>

        <label>Archivo:</label>
        <input
            type="file"
            onChange={(e) => setArchivo(e.target.files[0])}
            required
        />

        <button type="submit">Guardar</button>
        </form>
    </div>
    );

export default GestionForm;
            
