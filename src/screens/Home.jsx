import { Link } from 'react-router-dom'
import { Truck, Award, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { bestSellers, products } from '../data/data'

export default function Home() {
  const novedades = products.slice(2, 6)
  const topSellers = bestSellers.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin />

      {/* Hero */}
      <section className="relative bg-cream-200 paw-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-cursive text-4xl md:text-5xl text-bark-800 leading-tight mb-4">
              Moda Elegante<br />para tus Mascotas
            </h1>
            <Link to="/ropa-perros" className="btn-primary inline-block mt-4">
              Calidad Garantizada
            </Link>
          </div>
          <div className="flex-1 relative h-56 md:h-72">
            <img
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop"
              alt="Mascotas con ropa"
              className="w-full h-full object-cover rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="bg-white border-y border-cream-200 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-display text-lg text-bark-700 mb-4">Novedades para tus mascotas</h2>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-bark-500">
            <div className="flex items-center gap-2"><Truck size={18} className="text-paw-500" /><span>Envío rápido</span></div>
            <div className="flex items-center gap-2"><Award size={18} className="text-paw-500" /><span>Calidad Garantizada</span></div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-paw-500" /><span>Compras seguras</span></div>
          </div>
        </div>
      </section>

      {/* Novedades grid */}
      <section className="max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {novedades.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banners */}
      <section className="max-w-7xl mx-auto px-4 pb-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden h-48 bg-bark-700 flex items-end p-6">
          <img
            src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=500&h=300&fit=crop"
            alt="estilo"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative text-white">
            <p className="font-bold text-lg leading-tight">ESTILO Y<br />COMODIDAD</p>
            <p className="text-xs opacity-80 mb-2">para tu mejor amigo</p>
            <Link to="/ropa-perros" className="bg-paw-500 text-white text-xs px-4 py-1.5 rounded-full hover:bg-paw-600 transition-colors">
              EXPLORAR COLECCIÓN
            </Link>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden h-48 bg-green-800 flex items-end p-6">
          <img
            src="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=500&h=300&fit=crop"
            alt="aventuras"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative text-white">
            <p className="font-bold text-lg leading-tight">¡Aventuras<br />con Estilo!</p>
            <p className="text-xs opacity-80 mb-2">La ropa perfecta para explorar</p>
            <Link to="/ropa-gatos" className="bg-white text-bark-700 text-xs px-4 py-1.5 rounded-full hover:bg-cream-100 transition-colors">
              DESCUBRE MÁS
            </Link>
          </div>
        </div>
      </section>

      {/* Lo más vendido */}
      <section className="max-w-7xl mx-auto px-4 pb-12 w-full">
        <h2 className="text-center font-cursive text-2xl text-paw-600 mb-6 relative">
          Lo mas vendido
          <span className="block w-16 h-0.5 bg-paw-400 mx-auto mt-1" />
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {topSellers.map(p => <ProductCard key={p.id} product={p} size="sm" />)}
        </div>
      </section>
    </div>
  )
}
