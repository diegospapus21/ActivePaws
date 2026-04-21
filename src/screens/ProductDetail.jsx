import { useParams, Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { products, bestSellers } from '../data/data'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === Number(id)) || products[0]
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
  const topSellers = bestSellers.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 w-full py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-bark-400 mb-6">
          <Link to="/" className="hover:text-paw-600">Inicio</Link>
          {' / '}
          <Link to="/ropa-perros" className="hover:text-paw-600">{product.category}</Link>
          {' / '}
          <span className="text-bark-700">{product.name}</span>
        </nav>

        {/* Product block */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-6 flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 h-56 rounded-xl overflow-hidden bg-cream-100 shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <h1 className="font-display text-2xl text-bark-800 font-semibold">{product.name}</h1>
            <div>
              <p className="text-xs text-bark-400 uppercase tracking-wide">Precio:</p>
              <p className="text-2xl font-bold text-paw-600">${product.price.toLocaleString()}.00 {product.currency}</p>
            </div>
            <div>
              <p className="text-xs text-bark-400 uppercase tracking-wide mb-1">Descripcion:</p>
              <p className="text-sm text-bark-600 leading-relaxed">{product.description}</p>
            </div>
            <button className="btn-primary flex items-center gap-2 w-fit mt-auto">
              <ShoppingCart size={16} />
              Agregar al carrito
            </button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

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
