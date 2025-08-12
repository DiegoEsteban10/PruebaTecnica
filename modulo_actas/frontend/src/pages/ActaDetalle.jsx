import { useEffect, useState } from "react";    
import api from "../api/api";
import { Link, useParams, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ActaDetalle() {
  const { id } = useParams();
  const location = useLocation();     
  const { user, token } = useAuth();

  const [acta, setActa] = useState(null);

  // Gestiones
  const [gestiones, setGestiones] = useState([]);
  const [cargandoGestiones, setCargandoGestiones] = useState(true);
  const [errorGestiones, setErrorGestiones] = useState("");

  // Compromisos
  const [compromisos, setCompromisos] = useState([]);
  const [cargandoComp, setCargandoComp] = useState(true);
  const [errorComp, setErrorComp] = useState("");

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

    return () => { cancelado = true; };
  }, [id, location.key]);

  // Cargar compromisos del acta
  useEffect(() => {
    let cancel = false;
    setCargandoComp(true); setErrorComp("");
    api.get("/compromisos/")
      .then((r) => {
        const data = r.data;
        const lista = Array.isArray(data) ? data : (data?.results || data?.compromisos || []);
        if (!cancel) setCompromisos(lista.filter(c => String(c.acta) === String(id)));
      })
      .catch(() => !cancel && setErrorComp("No se pudieron cargar los compromisos"))
      .finally(() => !cancel && setCargandoComp(false));
    return () => { cancel = true; };
  }, [id, location.key]);

  if (!acta) return <div>Cargando...</div>;

  const handleVerPDF = async () => {
    if (!token) { alert("Tienes que iniciar sesión para ver el PDF"); return; }
    try {
      const response = await fetch(`http://localhost:8000/api/actas/${acta.id}/pdf/`, {
        method: 'GET',
        headers: { 'Authorization': `Token ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener el PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      alert("Error al abrir el PDF");
    }
  };

  // URL segura para adjuntos
  const buildAdjuntoURL = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `http://localhost:8000${path}`;
    return `http://localhost:8000/media/${path}`;
  };

  // Marcar compromiso como completado
  const onMarcarCompletado = async (compId) => {
    try {
      await api.patch(`/compromisos/${compId}/marcar_completado/`);
      setCompromisos(prev => prev.map(c => c.id === compId ? { ...c, estado: "COMPLETADO" } : c));
    } catch {
      alert("No se pudo marcar el compromiso.");
    }
  };

  // Badge estado
  const estadoBadge = (estado) => {
    const e = (estado || "").toLowerCase();
    if (e === "aprobado") return "badge badge-aprob";
    if (e === "rechazado") return "badge badge-rech";
    return "badge badge-pend";
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="h1">Detalle de Acta</h1>

        <div className="row" style={{marginBottom:8}}>
          <div style={{flex:1}}>
            <p><strong>Título:</strong> {acta.titulo}</p>
            <p><strong>Estado:</strong> <span className={estadoBadge(acta.estado)}>{acta.estado}</span></p>
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

        {/* Gestiones */}
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

        <div className="divider" />

        {/* Compromisos */}
        <div className="section">
          <h2 className="h2">Compromisos</h2>
          {cargandoComp && <p className="sub">Cargando compromisos…</p>}
          {errorComp && <p className="error">{errorComp}</p>}
          {!cargandoComp && compromisos.length === 0 && <p className="sub">No hay compromisos para esta acta.</p>}

          {compromisos.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Fecha límite</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {compromisos.map((c) => (
                  <tr key={c.id}>
                    <td>{c.descripcion}</td>
                    <td>{c.fecha_limite}</td>
                    <td>{c.estado}</td>
                    <td style={{textAlign:"right"}}>
                      {c.estado !== "COMPLETADO" && (
                        <button className="btn btn-ghost" onClick={() => onMarcarCompletado(c.id)}>
                          Marcar completado
                        </button>
                      )}
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
