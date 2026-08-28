import Carousel from '../components/Carousel.jsx'
import libro1 from '../assets/images/libro1_cien_anos_de_soledad.png'
import libro2 from '../assets/images/libro2_harry_potter.png'
import libro3 from '../assets/images/libro3_it_stephen_king.png'
import libro4 from '../assets/images/libro4_el_principito.png'
import libro5 from '../assets/images/libro5_los_juegos_del_hambre.png'
import libro6 from '../assets/images/libro6_juego_de_tronos.png'
import libro7 from '../assets/images/libro7_el_codigo_da_vinci.png'
import libro8 from '../assets/images/libro8_orgullo_y_prejuicio.png'
import libro9 from '../assets/images/libro9_el_hobbit.png'
import libro10 from '../assets/images/libro10_don_quijote.png'

const books = [
  { title: 'Cien años de soledad', image: libro1, description: 'La historia de una familia y un pueblo que permanecen en la memoria.' },
  { title: 'Harry Potter', image: libro2, description: 'Una aventura mágica sobre amistad, valentía y descubrimientos.' },
  { title: 'It', image: libro3, description: 'El clásico de Stephen King que explora el miedo y los lazos de la infancia.' },
  { title: 'El principito', image: libro4, description: 'Una lectura entrañable sobre la amistad, el amor y lo esencial.' },
  { title: 'Los juegos del hambre', image: libro5, description: 'Una historia de supervivencia, resistencia y decisiones difíciles.' },
  { title: 'Juego de tronos', image: libro6, description: 'Intrigas, alianzas y ambición en un mundo de reinos enfrentados.' },
  { title: 'El código Da Vinci', image: libro7, description: 'Un misterio de símbolos, arte e historia que no da tregua.' },
  { title: 'Orgullo y prejuicio', image: libro8, description: 'Una novela sobre primeras impresiones, carácter y sentimientos.' },
  { title: 'El Hobbit', image: libro9, description: 'El viaje inesperado de Bilbo Bolsón hacia una gran aventura.' },
  { title: 'Don Quijote', image: libro10, description: 'El viaje inmortal de un caballero guiado por sus ideales.' },
]

function Index() {
  return (
    <main className="min-h-screen bg-[#f6efe5] px-4 py-10 sm:py-14">
      <section className="mx-auto max-w-6xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-[#617568] sm:text-4xl">Bienvenido a nuestra Biblioteca</h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-[#75685f]">
          Encuentra libros, consulta nuestro catálogo y disfruta de nuestros servicios bibliotecarios.
        </p>

        <h2 className="mb-5 text-2xl font-bold text-[#617568]">Catálogo destacado</h2>
        <Carousel items={books} />
      </section>
    </main>
  );
}

export default Index;