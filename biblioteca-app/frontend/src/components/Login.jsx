import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from './Input'
import Button from './Button'

function Login({ onCreateAccount, onRecoverPassword }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [recordarme, setRecordarme] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validarCampo = (name, value) => {
    let error = ''
    if (name === 'email') {
      if (!value.trim()) error = 'El correo electrónico es obligatorio.'
      else if (!validarEmail(value)) error = 'Ingrese un correo electrónico válido.'
    }
    if (name === 'password' && !value.trim()) error = 'La contraseña es obligatoria.'
    setErrors((previous) => ({ ...previous, [name]: error }))
  }
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    validarCampo(name, value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    validarCampo('email', formData.email)
    validarCampo('password', formData.password)
    if (!formData.email || !validarEmail(formData.email) || !formData.password) return
    setServerError('')
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.mensaje || 'No fue posible iniciar sesión.')
        localStorage.setItem('biblioteca_token', data.token)
        localStorage.setItem('biblioteca_user', JSON.stringify(data.usuario))
        if (!recordarme) localStorage.removeItem('biblioteca_user_session')
        setLoggedIn(true)
        navigate('/')
      })
      .catch((error) => setServerError(error.message))
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-amber-900/10 bg-[#fffaf2] p-8 shadow-xl sm:mt-10">
      <div className="mb-6 text-center"><div className="mb-3 text-5xl">📚</div><h2 className="text-3xl font-bold text-[#617568]">Iniciar sesión</h2><p className="mt-2 text-[#75685f]">Ingresa a tu cuenta de la biblioteca</p></div>
      {loggedIn && <p className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">Inicio de sesión exitoso.</p>}
      {serverError && <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{serverError}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="ejemplo@correo.com" maxLength={100} />
        <Input label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="Ingrese su contraseña" maxLength={50} />
        <label className="mb-5 flex items-center gap-2 text-sm text-[#75685f]"><input type="checkbox" checked={recordarme} onChange={(event) => setRecordarme(event.target.checked)} className="h-4 w-4 accent-[#9d5f4b]" />Recordarme</label>
        <Button type="submit">Iniciar sesión</Button>
      </form>
      <div className="mt-5 text-center"><button type="button" onClick={onRecoverPassword} className="text-sm font-semibold text-[#9d5f4b] hover:underline">¿Olvidaste tu contraseña?</button></div>
      <div className="my-5 border-t border-amber-900/10" />
      <button type="button" onClick={onCreateAccount} className="w-full rounded-lg border-2 border-[#617568] px-5 py-2.5 font-semibold text-[#617568] transition hover:bg-[#617568]/10">Crear cuenta</button>
    </div>
  )
}

export default Login
