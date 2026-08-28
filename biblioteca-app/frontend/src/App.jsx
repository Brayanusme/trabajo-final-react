import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Index from "./pages/Index";
import QuienesSomos from "./pages/QuienesSomos";
import Contacto from "./pages/Contacto";
import LoginPage from "./pages/LoginPage";
import GestionLibros from "./pages/GestionLibros";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/gestion-libros" element={<GestionLibros />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
