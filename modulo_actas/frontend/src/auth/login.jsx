import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const [err, setErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            await login(correo, password);
            window.location.href = "/actas";
        } catch {
            setErr("Credenciales inválidas");
        }
    };

    return (
    <div className="app-container">
      <div className="card" style={{maxWidth:420, margin:"40px auto"}}>
        <h1 className="h1">Bienvenido 👋</h1>
        <p className="sub">Inicia sesión para gestionar actas, compromisos y gestiones.</p>

        <form className="form-grid" onSubmit={handleSubmit} style={{marginTop:16}}>
          <input
            className="input"
            type="email"
            value={correo}
            onChange={(e)=>setCorreo(e.target.value)}
            placeholder="Correo institucional"
            required
          />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          {err && <div className="error">{err}</div>}
          <button className="btn btn-primary" type="submit">Ingresar</button>
          <span className="note">¿Olvidaste tu contraseña? Contacta al administrador.</span>
        </form>
      </div>
    </div>
  );
}
