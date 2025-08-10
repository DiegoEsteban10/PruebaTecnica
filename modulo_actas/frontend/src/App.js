import { BrowserRouter, Routes, Route } from "react-router-dom";    
import Login from "./auth/login";
import RutaPrivada from "./auth/rutaPrivada";
import Actas from "./pages/Actas";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;