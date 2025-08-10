import { useEffect, useState } from "react";    
import api from "../api/api";
import { useParams } from "react-router-dom";

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