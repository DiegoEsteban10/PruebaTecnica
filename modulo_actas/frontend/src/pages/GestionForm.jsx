import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearGestion } from "../api/api";
import useAuth from "../hooks/useAuth";

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
    <div className="app-container">
      <div className="card" style={{maxWidth:720, margin:"0 auto"}}>
        <h1 className="h1">Nueva Gestión</h1>
        <p className="sub">Adjunta la evidencia (PDF o JPG) y describe brevemente la gestión realizada.</p>
        <form className="form-grid" onSubmit={handleSubmit} style={{marginTop:16}}>
          <div className="row">
            <div style={{flex:1}}>
              <label className="sub">Fecha</label>
              <input className="input" type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required />
            </div>
            <div style={{flex:2}}>
              <label className="sub">Archivo (PDF o JPG)</label>
              <input className="input" type="file" onChange={e=>setArchivo_adjunto(e.target.files[0])} required />
            </div>
          </div>

          <label className="sub">Descripción</label>
          <textarea className="textarea" rows={4} value={descripcion} onChange={e=>setDescripcion(e.target.value)} required />

          {error && <div className="error">{error}</div>}

          <div className="row" style={{justifyContent:"flex-end", marginTop:8}}>
            <button type="button" className="btn btn-ghost" onClick={()=>navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GestionForm;
            
