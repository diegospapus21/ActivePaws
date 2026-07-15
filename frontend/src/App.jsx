import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Contexts (providers globales)
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'

// Protección de rutas
import PrivateRoute from './components/PrivateRoute'

// ── Pantallas públicas
import Home            from './screens/Home'
import Login            from './screens/Login'
import Register         from './screens/Register'
import VerifyCode       from './screens/VerifyCode'
import ForgotPassword   from './screens/ForgotPassword'
import ResetPassword    from './screens/ResetPassword'
import ProductList      from './screens/ProductList'
import ProductDetail    from './screens/ProductDetail'
import Cart             from './screens/Cart'
import Payment          from './screens/Payment'
import Reviews          from './screens/Reviews'
import MyOrders         from './screens/MyOrders'

// ── Pantallas administrativas
import Dashboard         from './screens/admin/Dashboard'
import ProductManagement from './screens/admin/ProductManagement'
import OrderManagement   from './screens/admin/OrderManagement'
import UserManagement    from './screens/admin/UserManagement'

export default function App() {
  return (
    // AuthProvider, ToastProvider y CartProvider envuelven TODA la app para
    // que cualquier componente pueda acceder a useAuth(), useToast() y useCart()
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>

              {/* ── Rutas Públicas ── */}
              <Route path="/"                    element={<Home />} />
              <Route path="/login"               element={<Login />} />
              <Route path="/registro"            element={<Register />} />
              <Route path="/verificar"           element={<VerifyCode />} />
              <Route path="/recuperar"           element={<ForgotPassword />} />
              <Route path="/restablecer/:token"  element={<ResetPassword />} />
              <Route path="/ropa-perros"         element={<ProductList category="perros" />} />
              <Route path="/ropa-gatos"          element={<ProductList category="gatos" />} />
              <Route path="/accesorios"          element={<ProductList category="accesorios" />} />
              <Route path="/producto/:id"        element={<ProductDetail />} />
              <Route path="/producto/:id/resenas" element={<Reviews />} />
              <Route path="/carrito"             element={<Cart />} />
              <Route path="/pago"                element={<Payment />} />

              {/* ── Rutas privadas de cliente ── */}
              <Route element={<PrivateRoute />}>
                <Route path="/mis-pedidos" element={<MyOrders />} />
              </Route>

              {/* ── Rutas Privadas (solo admin) ──
                  PrivateRoute verifica que haya sesión activa.
                  adminOnly={true} verifica además que el rol sea "admin".
              */}
              <Route element={<PrivateRoute adminOnly />}>
                <Route path="/admin"              element={<Dashboard />} />
                <Route path="/admin/productos"    element={<ProductManagement />} />
                <Route path="/admin/pedidos"      element={<OrderManagement />} />
                <Route path="/admin/usuarios"     element={<UserManagement />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
