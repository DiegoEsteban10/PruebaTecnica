import GestionForm from '../pages/GestionForm';
import { Navigate } from "react-router-dom";


export default function RutaPrivada({children}){
    const Token = localStorage.getItem('token');
    return Token ? children : Navigate ('/login');
}
