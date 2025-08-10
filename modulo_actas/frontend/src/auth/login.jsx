import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(correo, password);
            window.location.href = "/actas";
        } catch (error) {
            alert("Credenciales inválidas");
        }
    };
    } 

    return(
        <div>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo"
            />
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            />
        <button type="submit">Ingresar</button>
    </form>
    </div>
    );
