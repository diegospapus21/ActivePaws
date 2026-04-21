import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { dogProducts, catProducts, accessories, bestSellers } from '../data/data'

export default function ProductList({ category = 'perros' }) {
  const categoryMap = {
    perros: { title: 'Ropa para perros', products: dogProducts },
    gatos:  { title: 'Ropa de gatos',    products: catProducts },
    accesorios: { title: 'Accesorios',   products: accessories },
  }
  const { title, products } = categoryMap[category] || categoryMap.perros
  const topSellers = bestSellers.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 w-full py-8">
        <h1 className="font-cursive text-3xl text-paw-600 text-center mb-8">
          {title}
          <span className="block w-16 h-0.5 bg-paw-300 mx-auto mt-2" />
        </h1>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

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
        <h2 className="font-cursive text-2xl text-paw-600 text-center mb-4">
          Lo mas vendido
          <span className="block w-16 h-0.5 bg-paw-300 mx-auto mt-1" />
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {topSellers.map(p => <ProductCard key={p.id} product={p} size="sm" />)}
        </div>
      </div>
    </div>
  )
}
