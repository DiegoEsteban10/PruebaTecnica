import { useEffect, useState } from "react";    
import api from "../api/api";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ActaDetalle() {
    const { id } = useParams();    
    const [acta, setActa] = useState(null);

    useEffect(() => {
        api.get(`/actas/${id}/`).then((response) => setActa(response.data));
    }, [id]);

    if (!acta) {
        return <div>Loading...</div>;
    }

    const hanleVerPDF = () => {
        window.open('http://localhost:8000/api/actas/${id}/archivo/', '_blank');
    };

    return (
        <div>
            <h2>Detalle de Acta</h2>
            <p>Título: {acta.titulo}</p>
            <p>Estado: {acta.estado}</p>
            <p>Fecha: {acta.fecha}</p>
            <button onClick={hanleVerPDF}>Ver PDF</button>
        </div>
    );
}

const { user } = useAuth();

{(user.rol === "ADMIN" || user.id === acta.creador.id) && (
    <Link to={`/gestiones/nueva/${acta.id}`}>
        <button>Agregar Gestión</button> 
    </Link>
)}