import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const autenticado = Boolean(localStorage.getItem('biblioteca_token'))
  const usuario = JSON.parse(localStorage.getItem('biblioteca_user') || 'null')
  const puedeGestionar = usuario?.rol === 'Administrador' || usuario?.rol === 'Empleado'
  const cerrarSesion = () => {
    localStorage.removeItem('biblioteca_token')
    localStorage.removeItem('biblioteca_user')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#fffaf2] shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Navegación principal">
        <Link className="text-xl font-semibold tracking-tight text-[#9d5f4b]" to="/">📚 Biblioteca Digital</Link>

        <div className="flex gap-5 text-sm font-medium text-[#75685f]">
          <Link className="transition hover:text-[#b96f55]" to="/">Inicio</Link>
          {" | "}
          <Link className="transition hover:text-[#b96f55]" to="/quienes-somos">¿Quiénes Somos?</Link>
          {" | "}
          <Link className="transition hover:text-[#b96f55]" to="/contacto">Contacto</Link>
          {puedeGestionar && <Link key={location.pathname} className="rounded-lg bg-[#617568] px-4 py-2 font-semibold text-white transition hover:bg-[#4f6257]" to="/gestion-libros">Gestionar libros</Link>}
          {autenticado ? <button type="button" onClick={cerrarSesion} className="rounded-lg bg-[#d69b45] px-4 py-2 font-semibold text-[#493a32] transition hover:bg-[#e2b15e]">Cerrar sesión</button> : <Link className="rounded-lg bg-[#d69b45] px-4 py-2 font-semibold text-[#493a32] transition hover:bg-[#e2b15e]" to="/login">Iniciar sesión</Link>}
        </div>
      </nav>
    </header>
  );
}

export default Header;