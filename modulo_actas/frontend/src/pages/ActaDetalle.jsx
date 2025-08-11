import { useEffect, useState } from "react";    
import api from "../api/api";
import { Link, useParams, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ActaDetalle() {
  const { id } = useParams();
  const location = useLocation();     
  const { user, token } = useAuth();

  const [acta, setActa] = useState(null);
  const [gestiones, setGestiones] = useState([]);
  const [cargandoGestiones, setCargandoGestiones] = useState(true);
  const [errorGestiones, setErrorGestiones] = useState("");

  useEffect(() => {
    api.get(`/actas/${id}/`).then((response) => setActa(response.data));
  }, [id]);

  useEffect(() => {
    let cancelado = false;
    setCargandoGestiones(true);
    setErrorGestiones("");

    api.get(`/gestiones/`)
      .then((r) => {
        const data = r.data;
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.gestiones)
          ? data.gestiones
          : [];
        if (!cancelado) {
          const filtradas = lista.filter((g) => String(g.acta) === String(id));
          setGestiones(filtradas);
        }
      })
      .catch(() => !cancelado && setErrorGestiones("No se pudieron cargar las gestiones"))
      .finally(() => !cancelado && setCargandoGestiones(false));

    return () => {
      cancelado = true;
    };
  }, [id, location.key]);

  if (!acta) return <div>Cargando...</div>;

  const handleVerPDF = async () => {
    if (!token) {
      alert("Tienes que iniciar sesión para ver el PDF");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/actas/${acta.id}/pdf/`, {
        method: 'GET',
        headers: { 'Authorization': `Token ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener el PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Error al abrir el PDF");
    }
  };

  // 🔧 solo esencial: construir bien la URL del adjunto
  const buildAdjuntoURL = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `http://localhost:8000${path}`;
    return `http://localhost:8000/media/${path}`;
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="h1">Detalle de Acta</h1>
        <div className="row" style={{marginBottom:8}}>
          <div style={{flex:1}}>
            <p><strong>Título:</strong> {acta.titulo}</p>
            <p><strong>Estado:</strong> <span className={((e)=>{e=(e||"").toLowerCase();return e==="aprobado"?"badge badge-aprob":e==="rechazado"?"badge badge-rech":"badge badge-pend"})(acta.estado)}>{acta.estado}</span></p>
            <p><strong>Fecha:</strong> {acta.fecha}</p>
          </div>
          <div className="row" style={{alignItems:"center"}}>
            {token && <button className="btn btn-ghost" onClick={handleVerPDF}>Ver PDF</button>}
            {(user?.rol==="ADMIN" || user?.id===acta.creador?.id) && (
              <Link to={`/actas/${acta.id}/gestiones/nueva`}><button className="btn btn-primary">Agregar Gestión</button></Link>
            )}
          </div>
        </div>

        <div className="divider" />

        <div className="section">
          <h2 className="h2">Gestiones</h2>
          {cargandoGestiones && <p className="sub">Cargando gestiones…</p>}
          {errorGestiones && <p className="error">{errorGestiones}</p>}
          {!cargandoGestiones && gestiones.length===0 && <p className="sub">No hay gestiones para esta acta.</p>}

          {gestiones.length>0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Archivo</th>
                </tr>
              </thead>
              <tbody>
                {gestiones.map((g)=>(
                  <tr key={g.id}>
                    <td>{g.fecha}</td>
                    <td>{g.descripcion}</td>
                    <td>
                      {g.archivo_adjunto ? (
                        <a className="link" href={buildAdjuntoURL(g.archivo_adjunto)} target="_blank" rel="noreferrer">Ver adjunto</a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}