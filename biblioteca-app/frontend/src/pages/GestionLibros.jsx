import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const libroInicial = { titulo: '', autor: '', categoria: '', isbn: '', disponible: true, imagen: '', descripcion: '' }

function GestionLibros() {
  const navigate = useNavigate()
  const [libros, setLibros] = useState([])
  const [formulario, setFormulario] = useState(libroInicial)
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const token = localStorage.getItem('biblioteca_token')
  const usuario = JSON.parse(localStorage.getItem('biblioteca_user') || 'null')
  const puedeGestionar = usuario?.rol === 'Administrador' || usuario?.rol === 'Empleado'

  const cargarLibros = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/libros`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      if (!response.ok) throw new Error(data.mensaje || 'No fue posible cargar los libros.')
      setLibros(data.libros)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    if (!token || !puedeGestionar) return
    cargarLibros()
  }, [token, puedeGestionar])

  if (!token || !usuario) return <main className="min-h-screen bg-[#f6efe5] px-4 py-16 text-center"><h1 className="text-3xl font-bold text-[#617568]">Inicia sesión para continuar</h1><Link className="mt-6 inline-block rounded-lg bg-[#9d5f4b] px-5 py-3 font-semibold text-white" to="/login">Ir a iniciar sesión</Link></main>
  if (!puedeGestionar) return <main className="min-h-screen bg-[#f6efe5] px-4 py-16 text-center"><h1 className="text-3xl font-bold text-[#617568]">Acceso restringido</h1><p className="mt-3 text-[#75685f]">Esta sección es para administradores y empleados.</p><Link className="mt-6 inline-block rounded-lg bg-[#9d5f4b] px-5 py-3 font-semibold text-white" to="/">Volver al inicio</Link></main>

  const actualizarCampo = (event) => setFormulario((actual) => ({ ...actual, [event.target.name]: event.target.value }))
  const cancelarEdicion = () => { setEditandoId(null); setFormulario(libroInicial); setError('') }
  const guardarLibro = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')
    const method = editandoId ? 'PUT' : 'POST'
    const endpoint = editandoId ? `${API_URL}/api/v1/libros/${editandoId}` : `${API_URL}/api/v1/libros`
    try {
      const response = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formulario) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.mensaje || 'No fue posible guardar el libro.')
      setMensaje(data.mensaje)
      cancelarEdicion()
      await cargarLibros()
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  const editarLibro = (libro) => { setEditandoId(libro.id_libro); setFormulario({ ...libro, disponible: Boolean(libro.disponible) }); setMensaje(''); setError('') }
  const cambiarDisponibilidad = async (libro) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/libros/${libro.id_libro}/disponibilidad`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ disponible: !libro.disponible }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.mensaje || 'No fue posible cambiar la disponibilidad.')
      setMensaje(data.mensaje)
      await cargarLibros()
    } catch (requestError) { setError(requestError.message) }
  }
  const eliminarLibro = async (id) => {
    if (!window.confirm('¿Eliminar este libro?')) return
    try {
      const response = await fetch(`${API_URL}/api/v1/libros/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      if (!response.ok) throw new Error(data.mensaje || 'No fue posible eliminar el libro.')
      setMensaje(data.mensaje)
      await cargarLibros()
    } catch (requestError) { setError(requestError.message) }
  }

  return <main className="min-h-screen bg-[#f6efe5] px-4 py-10 sm:px-8"><div className="mx-auto max-w-7xl">
    <div className="mb-8 flex flex-col gap-4 border-b border-amber-900/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-[#b96f55]">Panel de {usuario.rol}</p><h1 className="mt-2 text-4xl font-bold text-[#617568]">Gestión de libros</h1><p className="mt-2 text-[#75685f]">Administra el catálogo de la biblioteca.</p></div><button type="button" onClick={() => { localStorage.removeItem('biblioteca_token'); localStorage.removeItem('biblioteca_user'); navigate('/login') }} className="rounded-lg border border-[#b96f55] px-4 py-2 font-semibold text-[#9d5f4b]">Cerrar sesión</button></div>
    {mensaje && <p className="mb-5 rounded-lg bg-green-100 p-3 text-green-800">{mensaje}</p>}{error && <p className="mb-5 rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <form onSubmit={guardarLibro} className="h-fit rounded-xl border border-amber-900/10 bg-[#fffaf2] p-6 shadow-lg"><h2 className="mb-5 text-2xl font-bold text-[#617568]">{editandoId ? 'Editar libro' : 'Nuevo libro'}</h2><div className="space-y-3">{[['titulo','Título'],['autor','Autor'],['categoria','Categoría'],['isbn','ISBN'],['imagen','Imagen']].map(([name, label]) => <label key={name} className="block text-sm font-semibold text-[#617568]">{label}<input name={name} value={formulario[name]} onChange={actualizarCampo} required={name !== 'imagen'} maxLength={name === 'titulo' ? 150 : name === 'autor' || name === 'categoria' ? 100 : 255} className="mt-1 w-full rounded-md border border-[#ded1c2] bg-white px-3 py-2 font-normal text-[#493a32]" /></label>)}<label className="block text-sm font-semibold text-[#617568]">Descripción<textarea name="descripcion" value={formulario.descripcion} onChange={actualizarCampo} rows="4" className="mt-1 w-full rounded-md border border-[#ded1c2] bg-white px-3 py-2 font-normal text-[#493a32]" /></label><label className="flex items-center gap-2 text-sm font-semibold text-[#617568]"><input type="checkbox" name="disponible" checked={formulario.disponible} onChange={(event) => setFormulario((actual) => ({ ...actual, disponible: event.target.checked }))} />Disponible</label></div><div className="mt-5 flex gap-3"><button type="submit" className="flex-1 rounded-lg bg-[#9d5f4b] px-4 py-2.5 font-semibold text-white">{editandoId ? 'Guardar cambios' : 'Crear libro'}</button>{editandoId && <button type="button" onClick={cancelarEdicion} className="rounded-lg border border-[#617568] px-4 py-2.5 font-semibold text-[#617568]">Cancelar</button>}</div></form>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold text-[#617568]">Catálogo ({libros.length})</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{libros.map((libro) => <article key={libro.id_libro} className="rounded-xl border border-amber-900/10 bg-[#fffaf2] p-5 shadow-md"><div className="mb-3 flex items-start justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${libro.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{libro.disponible ? 'Disponible' : 'Prestado'}</span><span className="text-xs text-[#75685f]">#{libro.id_libro}</span></div><h3 className="text-xl font-bold text-[#493a32]">{libro.titulo}</h3><p className="mt-1 text-sm text-[#75685f]">{libro.autor}</p><p className="mt-3 text-sm text-[#75685f]">{libro.categoria} · ISBN {libro.isbn}</p>{libro.descripcion && <p className="mt-3 line-clamp-3 text-sm text-[#75685f]">{libro.descripcion}</p>}<div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => editarLibro(libro)} className="rounded-md bg-[#617568] px-3 py-2 text-sm font-semibold text-white">Editar</button><button type="button" onClick={() => cambiarDisponibilidad(libro)} className="rounded-md border border-[#617568] px-3 py-2 text-sm font-semibold text-[#617568]">{libro.disponible ? 'Prestar' : 'Disponible'}</button>{usuario.rol === 'Administrador' && <button type="button" onClick={() => eliminarLibro(libro.id_libro)} className="col-span-2 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700">Eliminar</button>}</div></article>)}</div></section>
    </div></div></main>
}

export default GestionLibros