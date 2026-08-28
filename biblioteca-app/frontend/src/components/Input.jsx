function Input({ label, name, type = 'text', value, onChange, error, placeholder, maxLength }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-[#493a32]">{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} className={`w-full rounded-lg border bg-[#fffaf2] px-4 py-2 outline-none transition ${error ? 'border-red-500 focus:ring-2 focus:ring-red-300' : 'border-amber-900/20 focus:border-[#b96f55] focus:ring-2 focus:ring-[#b96f55]/20'}`} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input
