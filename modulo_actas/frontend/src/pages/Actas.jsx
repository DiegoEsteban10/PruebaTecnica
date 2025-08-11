import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Actas() {
    const [actas, setActas] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');

    useEffect(() => {
    api.get('/actas/').then((response) => {
        console.log("Datos recibidos:", response.data); // 👈 Para ver estructura real
        if (Array.isArray(response.data)) {
            setActas(response.data);
        } else if (Array.isArray(response.data.results)) {
            setActas(response.data.results);
        } else if (Array.isArray(response.data.actas)) {
            setActas(response.data.actas);
        } else {
            setActas([]); // Evita error si no hay datos
        }
    });
}, []);

    const actasFiltradas = actas.filter((acta) => {
        return (
        acta.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
        (filtroEstado === '' || acta.estado.toLowerCase() === (filtroEstado.toLowerCase()) &&
        (filtroFecha === '' || acta.fecha === filtroFecha)
    ));
    });

    const estadoBadge = (estado)=>{
    const e = (estado||"").toLowerCase();
    if (e==="aprobado") return "badge badge-aprob";
    if (e==="rechazado") return "badge badge-rech";
    return "badge badge-pend";
  };

    return (
    <div className="app-container">
      <div className="card">
        <h1 className="h1">Actas</h1>
        <div className="toolbar">
          <input className="input" placeholder="Filtrar por título" value={filtroTitulo} onChange={e=>setFiltroTitulo(e.target.value)} />
          <input className="input" placeholder="Estado (pendiente/aprobado/rechazado)" value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)} />
          <input className="input" type="date" value={filtroFecha} onChange={e=>setFiltroFecha(e.target.value)} />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actasFiltradas.map(a=>(
              <tr key={a.id}>
                <td>{a.titulo}</td>
                <td><span className={estadoBadge(a.estado)}>{a.estado}</span></td>
                <td>{a.fecha}</td>
                <td><Link className="link" to={`/actas/${a.id}`}>Ver detalle</Link></td>
              </tr>
            ))}
            {actasFiltradas.length===0 && (
              <tr><td colSpan={4} className="sub center" style={{padding:16}}>No hay actas con esos filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

