import { useState } from 'react'
import Input from './Input'
import Button from './Button'

function RecoverPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)
  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const handleChange = (event) => {
    const value = event.target.value
    setEmail(value)
    setEnviado(false)
    setError(!value.trim() ? 'El correo electrónico es obligatorio.' : !validarEmail(value) ? 'Ingrese un correo electrónico válido.' : '')
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return setError('El correo electrónico es obligatorio.')
    if (!validarEmail(email)) return setError('Ingrese un correo electrónico válido.')
    setError('')
    setEnviado(true)
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-amber-900/10 bg-[#fffaf2] p-8 shadow-xl sm:mt-10">
      <div className="mb-6 text-center"><div className="mb-3 text-5xl">🔐</div><h2 className="text-3xl font-bold text-[#617568]">Recuperar contraseña</h2><p className="mt-2 text-[#75685f]">Ingresa tu correo para recuperar el acceso a tu cuenta.</p></div>
      {enviado && <div className="mb-5 rounded-lg bg-green-100 p-3 text-sm text-green-700">Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.</div>}
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Correo electrónico" name="email" type="email" value={email} onChange={handleChange} error={error} placeholder="ejemplo@correo.com" maxLength={100} />
        <Button type="submit">Recuperar contraseña</Button>
      </form>
      <button type="button" onClick={onBack} className="mt-5 w-full text-center text-sm font-semibold text-[#9d5f4b] hover:underline">← Volver al inicio de sesión</button>
    </div>
  )
}

export default RecoverPassword
