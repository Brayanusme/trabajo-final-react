import { useState } from 'react'

function Carousel({ items }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState('next')
  const itemAt = (offset) => items[(current + offset + items.length) % items.length]
  const previous = () => {
    setDirection('previous')
    setCurrent((current - 1 + items.length) % items.length)
  }
  const next = () => {
    setDirection('next')
    setCurrent((current + 1) % items.length)
  }

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white/80 p-4 shadow-xl sm:p-6">
      <div className="flex items-center justify-center gap-2 sm:gap-5">
        <button className="group relative w-14 shrink-0 overflow-hidden rounded-lg opacity-60 transition hover:scale-105 hover:opacity-100 sm:w-28" type="button" onClick={previous} aria-label={`Ver ${itemAt(-1).title}`}>
          <img className="h-28 w-full object-cover sm:h-44" src={itemAt(-1).image} alt={`Portada de ${itemAt(-1).title}`} />
          <span className="absolute inset-0 flex items-center justify-center bg-[#493a32]/75 px-1 text-[10px] font-bold uppercase text-[#fffaf2] sm:text-xs">Anterior</span>
        </button>
        <article key={`${current}-${direction}`} className="flex min-w-0 flex-1 flex-col items-center gap-4 rounded-xl border border-amber-900/10 bg-[#fffaf2] p-4 animate-[fade-in_450ms_ease] sm:flex-row sm:gap-7 sm:p-6">
          <img className="h-64 w-auto rounded-lg object-cover shadow-md sm:h-[360px]" src={items[current].image} alt={`Portada de ${items[current].title}`} />
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-[#617568] sm:text-3xl">{items[current].title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#75685f] sm:text-base">{items[current].description}</p>
          </div>
        </article>
        <button className="group relative w-14 shrink-0 overflow-hidden rounded-lg opacity-60 transition hover:scale-105 hover:opacity-100 sm:w-28" type="button" onClick={next} aria-label={`Ver ${itemAt(1).title}`}>
          <img className="h-28 w-full object-cover sm:h-44" src={itemAt(1).image} alt={`Portada de ${itemAt(1).title}`} />
          <span className="absolute inset-0 flex items-center justify-center bg-[#493a32]/75 px-1 text-[10px] font-bold uppercase text-[#fffaf2] sm:text-xs">Siguiente</span>
        </button>
      </div>
    </section>
  )
}

export default Carousel