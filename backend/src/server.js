require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const { connectDB } = require('./db/connection')

// Rutas
const authRoutes      = require('./routes/auth')
const productsRoutes  = require('./routes/products')
const usersRoutes     = require('./routes/users')
const ordersRoutes    = require('./routes/orders')
const dashboardRoutes = require('./routes/dashboard')
const reviewsRoutes   = require('./routes/reviews')

const app  = express()
const PORT = process.env.PORT || 4000

// ─── Middlewares globales ──────────────────────────────────────────────────────
// Orígenes permitidos:
//  • Frontend web (Vite): 5173 / 3000
//  • App móvil Expo en modo web: 8081 (Metro) y 19006 (webpack legacy)
//  • App móvil nativa (Expo Go / build): NO envía cabecera Origin, por lo que
//    la petición llega con origin = undefined y también debe permitirse.
const allowedOrigins = [
  'http://localhost:5173', 'http://localhost:3000',
  'http://localhost:8081', 'http://localhost:19006',
]
app.use(cors({
  origin(origin, callback) {
    // Sin origin (apps nativas, curl, Postman) o dentro de la lista blanca.
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.\d+\.\d+):\d+$/.test(origin)) {
      return callback(null, true)
    }
    return callback(null, true) // Modo desarrollo: permitir el resto también.
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())       // Parsear body JSON
app.use(express.urlencoded({ extended: true }))

// ─── Ruta de salud ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app:    'ActivePaws API',
    version: '2.0.0',
    db:     'MongoDB',
    time:   new Date().toISOString(),
  })
})

// ─── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/products',  productsRoutes)
app.use('/api/users',     usersRoutes)
app.use('/api/orders',    ordersRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reviews',   reviewsRoutes)

// ─── Manejo de rutas no encontradas ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.path} no encontrada.` })
})

// ─── Manejo global de errores ──────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Error no manejado:', err)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

// ─── Conectar a MongoDB e iniciar servidor ─────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("corre perfectamenrte")
      
    })
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB. Revisa MONGODB_URI en tu .env')
    console.error(err.message)
    process.exit(1)
  })
