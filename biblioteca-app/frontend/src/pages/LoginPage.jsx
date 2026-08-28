import { useState } from 'react'
import Login from '../components/Login'
import RecoverPassword from '../components/RecoverPassword'
import RegisterModal from '../components/RegisterModal'

function LoginPage() {
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false)

  if (mostrarRecuperacion) {
    return <main className="min-h-screen bg-[#f6efe5] px-4 py-10"><RecoverPassword onBack={() => setMostrarRecuperacion(false)} /></main>
  }

  return <main className="min-h-screen bg-[#f6efe5] px-4 py-10"><Login onCreateAccount={() => setMostrarRegistro(true)} onRecoverPassword={() => setMostrarRecuperacion(true)} />{mostrarRegistro && <RegisterModal onClose={() => setMostrarRegistro(false)} />}</main>
}

export default LoginPage
