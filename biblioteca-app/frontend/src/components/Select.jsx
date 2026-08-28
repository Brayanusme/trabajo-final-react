function Select({ label, name, value, onChange, error, options }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-[#493a32]">{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className={`w-full rounded-lg border bg-[#fffaf2] px-4 py-2 outline-none transition ${error ? 'border-red-500 focus:ring-2 focus:ring-red-300' : 'border-amber-900/20 focus:border-[#b96f55] focus:ring-2 focus:ring-[#b96f55]/20'}`}>
        <option value="">Seleccione una opción</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Select
