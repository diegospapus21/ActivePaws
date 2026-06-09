import { useParams, Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { products, bestSellers } from '../data/data'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === Number(id)) || products[0]
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
  const topSellers = bestSellers.slice(0, 5)
  const [added, setAdded] = useState(false)

  const addToCart = () => {
    const savedCart = localStorage.getItem('cart')
    const currentCart = savedCart ? JSON.parse(savedCart) : []
    
    const existingIndex = currentCart.findIndex(item => item.id === product.id)
    
    if (existingIndex !== -1) {
      currentCart[existingIndex].quantity += 1
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.image,
        description: product.description,
        quantity: 1
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart))
    window.dispatchEvent(new Event('cartUpdated'))
    
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 w-full py-8">
        <nav className="text-xs text-bark-400 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-paw-600">Inicio</Link>
          {' / '}
          <Link to={`/${product.category === 'Ropa para Perros' ? 'ropa-perros' : product.category === 'Ropa para Gatos' ? 'ropa-gatos' : 'accesorios'}`} className="hover:text-paw-600">
            {product.category}
          </Link>
          {' / '}
          <span className="text-bark-700">{product.name}</span>
        </nav>

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
              <p className="text-xs text-bark-400 uppercase tracking-wide mb-1">Descripción:</p>
              <p className="text-sm text-bark-600 leading-relaxed">{product.description}</p>
            </div>
            <div>
              <p className="text-xs text-bark-400 uppercase tracking-wide mb-1">Stock disponible:</p>
              <p className="text-sm text-bark-600">{product.stock} unidades</p>
            </div>
            <button 
              onClick={addToCart}
              className={`btn-primary flex items-center justify-center gap-2 w-full md:w-64 mt-4 transition-all duration-300 ${
                added ? 'bg-green-500 hover:bg-green-600' : ''
              }`}
            >
              <ShoppingCart size={18} />
              {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="font-cursive text-xl text-bark-700 mb-4">Productos relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

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