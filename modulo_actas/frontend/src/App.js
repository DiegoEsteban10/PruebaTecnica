import { BrowserRouter, Routes, Route } from "react-router-dom";    
import Login from "./auth/login";
import RutaPrivada from "./auth/rutaPrivada";
import Actas from "./pages/Actas";
import ActaDetalle from "./pages/ActaDetalle";
import GestionForm from "./pages/GestionForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/actas"
          element={
            <RutaPrivada>
              <Actas />
            </RutaPrivada>
          }
        />

        <Route
          path="/actas/:id"
          element={
            <RutaPrivada>
              <ActaDetalle />
            </RutaPrivada>
          }
        />

        <Route
          path="/actas/:id/gestiones/nueva"
          element={
            <RutaPrivada>
              <GestionForm />
            </RutaPrivada>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;