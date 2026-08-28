function Button({ children, type = 'button', onClick, disabled = false }) {
  return <button type={type} onClick={onClick} disabled={disabled} className="w-full rounded-lg bg-[#9d5f4b] px-5 py-2.5 font-semibold text-[#fffaf2] transition hover:bg-[#617568] disabled:cursor-not-allowed disabled:bg-gray-400">{children}</button>
}

export default Button
