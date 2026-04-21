import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public screens
import Home           from './screens/Home'
import Login          from './screens/Login'
import Register       from './screens/Register'
import ProductList    from './screens/ProductList'
import ProductDetail  from './screens/ProductDetail'
import Cart           from './screens/Cart'
import Payment        from './screens/Payment'
import Reviews        from './screens/Reviews'

// Admin screens
import Dashboard         from './screens/admin/Dashboard'
import ProductManagement from './screens/admin/ProductManagement'
import OrderManagement   from './screens/admin/OrderManagement'
import UserManagement    from './screens/admin/UserManagement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/registro"      element={<Register />} />
        <Route path="/ropa-perros"   element={<ProductList category="perros" />} />
        <Route path="/ropa-gatos"    element={<ProductList category="gatos" />} />
        <Route path="/accesorios"    element={<ProductList category="accesorios" />} />
        <Route path="/producto/:id"  element={<ProductDetail />} />
        <Route path="/carrito"       element={<Cart />} />
        <Route path="/pago"          element={<Payment />} />
        <Route path="/resenas"       element={<Reviews />} />

        {/* ── Admin ── */}
        <Route path="/admin"                 element={<Dashboard />} />
        <Route path="/admin/productos"       element={<ProductManagement />} />
        <Route path="/admin/pedidos"         element={<OrderManagement />} />
        <Route path="/admin/usuarios"        element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  )
}
