import { useEffect, useState } from "react";    
import api from "../api/api";
import { Link, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ActaDetalle() {
    const { id } = useParams();    
    const [acta, setActa] = useState(null);
    const { user, token } = useAuth();

    useEffect(() => {
        api.get(`/actas/${id}/`).then((response) => setActa(response.data));
    }, [id]);

    if (!acta) {
        return <div>Loading...</div>;
    }

    const handleVerPDF = () => {
        if (token) {
        window.open('http://localhost:8000/api/actas/${id}/archivo/', '_blank');
    } else {
        alert("Tienes que iniciar sesión para ver el PDF");
    }
    }

    return (
        <div>
            <h2>Detalle de Acta</h2>
            <p><strong>Título:</strong> {acta.titulo}</p>
            <p><strong>Estado:</strong> {acta.estado}</p>
            <p><strong>Fecha:</strong> {acta.fecha}</p>

            {token && (
                <button onClick={handleVerPDF}>Ver PDF</button>
            )}

            {(user?.rol === "ADMIN" || user?.id === acta.creador?.id) && (
                <Link to={`gestiones/nueva/${id}`}>
                    <button>Agregar Gestión</button> 
                </Link>
            )}
        </div>
    );
}