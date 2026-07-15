const mongoose = require('mongoose')

// ─── Conexión a MongoDB ─────────────────────────────────────────────────────────
// Usa la variable de entorno MONGODB_URI (ver .env.example). Funciona tanto con
// una instancia local de MongoDB (mongodb://127.0.0.1:27017/activepaws) como
// con un clúster de MongoDB Atlas (mongodb+srv://...).
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/activepaws'

  mongoose.connection.on('connected', () => {
    console.log(`🍃 Conectado a MongoDB → ${mongoose.connection.name}`)
  })
  mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión a MongoDB:', err.message)
  })

  await mongoose.connect(uri)
  return mongoose.connection
}

module.exports = { connectDB, mongoose }
