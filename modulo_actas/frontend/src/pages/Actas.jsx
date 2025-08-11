import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Actas() {
    const [actas, setActas] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');

    useEffect(() => {
        api.get('/actas/').then((response) => setActas(response.data));
    }, []);

    const actasFiltradas = actas.filter((acta) => {
        acta.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
        (filtroEstado === '' || acta.estado.toLowerCase() === (filtroEstado.toLowerCase()) &&
        (filtroFecha === '' || acta.fecha === filtroFecha)
    );

    return (
        <div>
            <h2>Lista de Actas</h2>

            {/* Filtros */}
            <div style={{ marginBottom: "1rem" }}>
                <input 
                    type="text" 
                    placeholder="Filtrar por título" 
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Filtrar por estado" 
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                />
                <input 
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {actasFiltradas.map((acta) => (
                        <tr key={acta.id}>
                            <td>{acta.titulo}</td>
                            <td>{acta.estado}</td>
                            <td>{acta.fecha}</td>
                            <td>
                                <Link to={`/actas/${acta.id}`}>Ver Detalle</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    })
}

