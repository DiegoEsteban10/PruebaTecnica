import {navigate} from 'react-router-dom';
import GestionForm from '../pages/GestionForm';


export default function RutaPrivada({children}){
    const Token = localStorage.getItem('token');
    return Token ? children : navigate('/login');
}

<Route
    path="/gestiones/nueva/:id"
    element={
        <RutaPrivada>
        <GestionForm />
        </RutaPrivada>
    }
/>