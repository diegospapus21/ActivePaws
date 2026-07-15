import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { usePublicProducts } from '../hooks/usePublicProducts'

const CATEGORY_MAP = {
  perros:      { title: 'Ropa para perros', query: 'Ropa para Perros' },
  gatos:       { title: 'Ropa de gatos',    query: 'Ropa para Gatos' },
  accesorios:  { title: 'Accesorios',       query: 'Accesorios' },
}

export default function ProductList({ category = 'perros' }) {
  const { title, query } = CATEGORY_MAP[category] || CATEGORY_MAP.perros
  const { products, loading } = usePublicProducts(query)
  const topSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 w-full py-8">
        <h1 className="font-cursive text-3xl text-paw-600 text-center mb-8">
          {title}
          <span className="block w-16 h-0.5 bg-paw-300 mx-auto mt-2" />
        </h1>

        {/* Product grid */}
        {loading ? (
          <p className="text-center text-bark-400 py-10">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-bark-400 py-10">No hay productos en esta categoría todavía.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Promo banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="relative rounded-2xl overflow-hidden h-44 bg-bark-700">
            <img
              src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=500&h=300&fit=crop"
              alt="estilo"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative p-6 text-white h-full flex flex-col justify-end">
              <p className="font-bold text-lg">ESTILO Y COMODIDAD</p>
              <p className="text-xs opacity-80 mb-2">para tu mejor amigo</p>
              <button className="bg-paw-500 text-white text-xs px-4 py-1.5 rounded-full w-fit hover:bg-paw-600 transition-colors">
                EXPLORAR COLECCIÓN
              </button>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-44 bg-green-800">
            <img
              src="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=500&h=300&fit=crop"
              alt="aventura"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative p-6 text-white h-full flex flex-col justify-end">
              <p className="font-bold text-lg">¡Aventuras con Estilo!</p>
              <p className="text-xs opacity-80 mb-2">La ropa perfecta para explorar</p>
              <button className="bg-white text-bark-700 text-xs px-4 py-1.5 rounded-full w-fit hover:bg-cream-100 transition-colors">
                DESCUBRE MÁS
              </button>
            </div>
          </div>
        </div>

        {/* Lo más vendido */}
        {topSellers.length > 0 && (
          <>
            <h2 className="font-cursive text-2xl text-paw-600 text-center mb-4">
              Lo mas vendido
              <span className="block w-16 h-0.5 bg-paw-300 mx-auto mt-1" />
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {topSellers.map(p => <ProductCard key={p.id} product={p} size="sm" />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
