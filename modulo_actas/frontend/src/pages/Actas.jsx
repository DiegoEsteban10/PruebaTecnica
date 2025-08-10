import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Actas() {
    const [actas, setActas] = useState([]);

    useEffect(() => {
        api.get('/actas/').then((response) => setActas(response.data));
    }, []);

    return (
        <div>
      <h2>Lista de Actas</h2>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {actas.map((acta) => (
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
}
