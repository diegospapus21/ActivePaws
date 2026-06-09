require('dotenv').config()

const express    = require('express')
const cors       = require('cors')

// Rutas
const authRoutes      = require('./routes/auth')
const productsRoutes  = require('./routes/products')
const usersRoutes     = require('./routes/users')
const ordersRoutes    = require('./routes/orders')
const dashboardRoutes = require('./routes/dashboard')

const app  = express()
const PORT = process.env.PORT || 4000

// ─── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],  // Vite dev server
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
    version: '1.0.0',
    time:   new Date().toISOString(),
  })
})

// ─── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/products',  productsRoutes)
app.use('/api/users',     usersRoutes)
app.use('/api/orders',    ordersRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ─── Manejo de rutas no encontradas ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.path} no encontrada.` })
})

// ─── Manejo global de errores ──────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Error no manejado:', err)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

// ─── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🐾 ActivePaws API corriendo en http://localhost:${PORT}`)
  console.log(`📋 Endpoints disponibles:`)
  console.log(`   GET  http://localhost:${PORT}/api/health`)
  console.log(`   POST http://localhost:${PORT}/api/auth/login`)
  console.log(`   POST http://localhost:${PORT}/api/auth/register`)
  console.log(`   CRUD http://localhost:${PORT}/api/products`)
  console.log(`   CRUD http://localhost:${PORT}/api/users`)
  console.log(`   CRUD http://localhost:${PORT}/api/orders`)
  console.log(`   GET  http://localhost:${PORT}/api/dashboard\n`)
})
