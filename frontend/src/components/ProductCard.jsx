import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, size = 'md' }) {
  const isSmall = size === 'sm'
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <Link
      to={`/producto/${product.id}`}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-md transition-all duration-200 flex flex-col ${isSmall ? 'text-xs' : ''}`}
    >
      <div className={`overflow-hidden bg-cream-100 ${isSmall ? 'h-28' : 'h-44'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className={`p-3 flex flex-col gap-1 ${isSmall ? 'p-2' : ''}`}>
        <p className={`font-semibold text-bark-700 ${isSmall ? 'text-xs' : 'text-sm'} line-clamp-1`}>{product.name}</p>
        <p className={`text-paw-600 font-bold ${isSmall ? 'text-xs' : 'text-sm'}`}>
          ${Number(product.price).toLocaleString()} {product.currency}
        </p>
        {!isSmall && (
          <button
            onClick={handleAdd}
            className={`mt-2 w-full flex items-center justify-center gap-2 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-300 ${
              added ? 'bg-green-500' : 'bg-paw-500 hover:bg-paw-600'
            }`}
          >
            <ShoppingCart size={12} />
            {added ? '✓ Agregado' : 'Agregar'}
          </button>
        )}
      </div>
    </Link>
  )
}
