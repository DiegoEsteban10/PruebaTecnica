import {navigate} from 'react-router-dom';


export default function RutaPrivada({children}){
    const Token = localStorage.getItem('token');
    return Token ? children : navigate('/login');
}