import { useState } from 'react'
import Input from './Input'
import Select from './Select'
import Button from './Button'

const initialForm = { nombre: '', apellido: '', tipoDocumento: '', numeroDocumento: '', direccion: '', telefono: '', email: '', password: '', confirmarPassword: '' }
const tiposDocumento = [{ value: 'CC', label: 'Cédula de ciudadanía' }, { value: 'TI', label: 'Tarjeta de identidad' }, { value: 'CE', label: 'Cédula de extranjería' }, { value: 'PAS', label: 'Pasaporte' }]

function RegisterModal({ onClose }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [registrado, setRegistrado] = useState(false)
  const [serverError, setServerError] = useState('')
  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validarCampo = (name, value, data = formData) => {
    let error = ''
    if (['nombre', 'apellido'].includes(name)) {
      const campo = name === 'nombre' ? 'nombre' : 'apellido'
      if (!value.trim()) error = `El ${campo} es obligatorio.`
      else if (value.length < 2) error = `El ${campo} debe tener mínimo 2 caracteres.`
      else if (value.length > 50) error = `El ${campo} no puede superar 50 caracteres.`
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) error = `El ${campo} solo puede contener letras.`
    } else if (name === 'tipoDocumento' && !value) error = 'Seleccione un tipo de documento.'
    else if (name === 'numeroDocumento') {
      if (!value.trim()) error = 'El número de documento es obligatorio.'
      else if (!/^\d+$/.test(value)) error = 'El documento solo puede contener números.'
      else if (value.length < 6 || value.length > 15) error = 'Debe tener entre 6 y 15 números.'
    } else if (name === 'direccion') {
      if (!value.trim()) error = 'La dirección es obligatoria.'
      else if (value.length < 5) error = 'La dirección debe tener mínimo 5 caracteres.'
      else if (value.length > 150) error = 'La dirección no puede superar 150 caracteres.'
    } else if (name === 'telefono') {
      if (!value.trim()) error = 'El teléfono es obligatorio.'
      else if (!/^\d+$/.test(value)) error = 'El teléfono solo puede contener números.'
      else if (value.length < 7 || value.length > 10) error = 'Debe tener entre 7 y 10 números.'
    } else if (name === 'email') {
      if (!value.trim()) error = 'El correo electrónico es obligatorio.'
      else if (!validarEmail(value)) error = 'Ingrese un correo electrónico válido.'
    } else if (name === 'password') {
      if (!value) error = 'La contraseña es obligatoria.'
      else if (value.length < 8) error = 'La contraseña debe tener mínimo 8 caracteres.'
      else if (!/[A-Z]/.test(value)) error = 'Debe contener al menos una letra mayúscula.'
      else if (!/\d/.test(value)) error = 'Debe contener al menos un número.'
    } else if (name === 'confirmarPassword') {
      if (!value) error = 'Debe confirmar la contraseña.'
      else if (value !== data.password) error = 'Las contraseñas no coinciden.'
    }
    return error
  }
  const handleChange = (event) => {
    const { name, value } = event.target
    const nextData = { ...formData, [name]: value }
    setFormData(nextData)
    setErrors((previous) => ({ ...previous, [name]: validarCampo(name, value, nextData), ...(name === 'password' && nextData.confirmarPassword ? { confirmarPassword: validarCampo('confirmarPassword', nextData.confirmarPassword, nextData) } : {}) }))
  }
  const validarFormulario = () => {
    const nextErrors = Object.fromEntries(Object.entries(formData).map(([name, value]) => [name, validarCampo(name, value)]))
    setErrors(nextErrors)
    return Object.values(nextErrors).every((error) => !error)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validarFormulario()) return
    setServerError('')
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombres: formData.nombre,
        apellidos: formData.apellido,
        tipo_documento: formData.tipoDocumento,
        numero_documento: formData.numeroDocumento,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password,
        confirmarPassword: formData.confirmarPassword,
      }),
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.mensaje || 'No fue posible registrar el usuario.')
        setRegistrado(true)
      })
      .catch((error) => setServerError(error.message))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#493a32]/60 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#fffaf2] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="registro-titulo">
        <div className="sticky top-0 flex items-center justify-between border-b border-amber-900/10 bg-[#fffaf2] px-6 py-4"><div><h2 id="registro-titulo" className="text-2xl font-bold text-[#617568]">Crear cuenta</h2><p className="text-sm text-[#75685f]">Registro de lector</p></div><button type="button" onClick={onClose} aria-label="Cerrar registro" className="rounded-full px-3 py-1 text-2xl text-[#75685f] hover:bg-[#eee4d6] hover:text-[#b96f55]">×</button></div>
        <div className="p-6">
          {registrado ? <div className="py-10 text-center"><div className="mb-4 text-6xl">✅</div><h3 className="text-2xl font-bold text-green-700">Registro completado</h3><p className="mt-3 text-[#75685f]">Tu cuenta ha sido registrada correctamente.</p><button type="button" onClick={onClose} className="mt-6 rounded-lg bg-[#9d5f4b] px-6 py-3 font-semibold text-white hover:bg-[#617568]">Continuar</button></div> : <form onSubmit={handleSubmit} noValidate>{serverError && <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{serverError}</p>}<div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} error={errors.nombre} placeholder="Ingrese su nombre" maxLength={50} /><Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} error={errors.apellido} placeholder="Ingrese su apellido" maxLength={50} /><Select label="Tipo de documento" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} error={errors.tipoDocumento} options={tiposDocumento} /><Input label="Número de documento" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} error={errors.numeroDocumento} placeholder="Ej: 1234567890" maxLength={15} /><Input label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} error={errors.direccion} placeholder="Ej: Calle 10 # 20-30" maxLength={150} /><Input label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} error={errors.telefono} placeholder="Ej: 3001234567" maxLength={10} /><div className="md:col-span-2"><Input label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="ejemplo@correo.com" maxLength={100} /></div><Input label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="Mínimo 8 caracteres" maxLength={50} /><Input label="Confirmar contraseña" name="confirmarPassword" type="password" value={formData.confirmarPassword} onChange={handleChange} error={errors.confirmarPassword} placeholder="Repita su contraseña" maxLength={50} /></div><div className="mt-4 rounded-lg bg-[#e4e5d7] p-4 text-sm text-[#617568]"><p className="font-semibold">Requisitos de contraseña:</p><ul className="mt-1 list-inside list-disc"><li>Mínimo 8 caracteres</li><li>Al menos una letra mayúscula</li><li>Al menos un número</li></ul></div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-lg border border-amber-900/20 px-6 py-2.5 font-semibold text-[#75685f] hover:bg-[#eee4d6]">Cancelar</button><div className="sm:w-48"><Button type="submit">Crear cuenta</Button></div></div></form>}
        </div>
      </div>
    </div>
  )
}

export default RegisterModal
