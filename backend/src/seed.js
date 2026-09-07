// ─── Script de siembra (seed) ──────────────────────────────────────────────────
// Pobla la base de datos MongoDB con datos de ejemplo para poder probar la
// aplicación de inmediato. Se ejecuta UNA sola vez con:
//
//   npm run seed
//
// Es seguro volver a ejecutarlo: primero limpia las colecciones y luego las
// vuelve a crear. Los datos NO viven en el código de la aplicación — sólo se
// usan para inicializar la base de datos real (MongoDB).

require('dotenv').config()
const bcrypt = require('bcryptjs')
const { connectDB, mongoose } = require('./db/connection')
const User    = require('./models/User')
const Product = require('./models/Product')
const Order   = require('./models/Order')
const Review  = require('./models/Review')

async function seed() {
  await connectDB()
  console.log('🌱 Sembrando datos de ejemplo en MongoDB...')

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
  ])

  const pwdAdmin  = await bcrypt.hash('admin123', 10)
  const pwdClient = await bcrypt.hash('password123', 10)

  const users = await User.insertMany([
    { name: 'Administrador',  email: 'admin@activepaws.com', username: 'admin',   password: pwdAdmin,  role: 'admin',  status: 'Activo',   emailConfirmed: true },
    { name: 'Luis Martínez',  email: 'luis@marte.com',       username: 'luism',   password: pwdClient, role: 'client', status: 'Activo',   emailConfirmed: true },
    { name: 'Carla Rivera',   email: 'carla@marte.com',      username: 'carlar',  password: pwdClient, role: 'client', status: 'Activo',   emailConfirmed: true },
    { name: 'Julio Gómez',    email: 'julio@marte.com',      username: 'juliog',  password: pwdClient, role: 'admin',  status: 'Activo',   emailConfirmed: true },
    { name: 'Ana Torres',     email: 'ana@marte.com',        username: 'anat',    password: pwdClient, role: 'client', status: 'Inactivo', emailConfirmed: true },
    { name: 'Sergio Mendoza', email: 'sergio@narate.com',    username: 'sergiom', password: pwdClient, role: 'client', status: 'Inactivo', emailConfirmed: true },
  ])

  const products = await Product.insertMany([
    { name: 'Suéter Azul',      category: 'Ropa para Perros', price: 320, currency: 'MXN', stock: 53, sold: 150, status: 'Activo',   description: 'Suéter cálido y resistente, ideal para días fríos.', tags: ['perro','suéter','invierno'], image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop' },
    { name: 'Vestido Amarillo', category: 'Ropa para Perros', price: 160, currency: 'MXN', stock: 6,  sold: 132, status: 'Inactivo', description: 'Vestido ligero y colorido, perfecto para el verano.', tags: ['perro','vestido','verano'], image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=300&h=300&fit=crop' },
    { name: 'Suéter Beige',     category: 'Ropa para Gatos',  price: 420, currency: 'MXN', stock: 34, sold: 110, status: 'Inactivo', description: 'Suéter elegante en tono beige para gatos activos.', tags: ['gato','suéter','casual'], image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop' },
    { name: 'Suéter Rayas',     category: 'Ropa para Gatos',  price: 830, currency: 'MXN', stock: 100,sold: 98,  status: 'Activo',   description: 'Diseño a rayas clásico. Tejido suave y duradero.', tags: ['gato','suéter','rayas'], image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=300&h=300&fit=crop' },
    { name: 'Abrigo Azul',      category: 'Ropa para Gatos',  price: 530, currency: 'MXN', stock: 83, sold: 98,  status: 'Activo',   description: 'Mantiene el pelaje seco durante los paseos bajo la lluvia.', tags: ['gato','abrigo','impermeable'], image: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=300&h=300&fit=crop' },
    { name: 'Abrigo Amarillo',  category: 'Ropa para Perros', price: 480, currency: 'MXN', stock: 45, sold: 87,  status: 'Activo',   description: 'Abrigo impermeable amarillo brillante para días lluviosos.', tags: ['perro','abrigo','impermeable'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop' },
    { name: 'Abrigo Beige',     category: 'Ropa para Perros', price: 510, currency: 'MXN', stock: 28, sold: 75,  status: 'Activo',   description: 'Elegante abrigo en tono beige con interior polar.', tags: ['perro','abrigo','elegante'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
    { name: 'Collar Premium',   category: 'Accesorios',       price: 150, currency: 'MXN', stock: 60, sold: 210, status: 'Activo',   description: 'Collar artesanal de cuero genuino con hebilla dorada.', tags: ['accesorio','collar','cuero'], image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=300&h=300&fit=crop' },
    { name: 'Correa Trenzada',  category: 'Accesorios',       price: 220, currency: 'MXN', stock: 38, sold: 143, status: 'Activo',   description: 'Correa de nylon trenzado resistente para paseos diarios.', tags: ['accesorio','correa','paseos'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop' },
  ])

  const byName = (name) => users.find(u => u.name === name)
  const prod   = (name) => products.find(p => p.name === name)

  const orders = await Order.insertMany([
    { orderNumber: '001001', userId: byName('Luis Martínez')._id,  client: 'Luis Martínez',  avatar: 'LM', total: 920, currency: 'MXN', status: 'Pendiente', date: '05/08/2026', items: [{ productId: prod('Suéter Azul')._id, name: 'Suéter Azul', price: 320, qty: 2 }, { productId: prod('Collar Premium')._id, name: 'Collar Premium', price: 150, qty: 2 }] },
    { orderNumber: '001002', userId: byName('Carla Rivera')._id,   client: 'Carla Rivera',   avatar: 'CR', total: 160, currency: 'MXN', status: 'Enviado',   date: '05/08/2026', items: [{ productId: prod('Vestido Amarillo')._id, name: 'Vestido Amarillo', price: 160, qty: 1 }] },
    { orderNumber: '001003', userId: byName('Julio Gómez')._id,    client: 'Julio Gómez',    avatar: 'JG', total: 160, currency: 'MXN', status: 'Entregado', date: '05/08/2026', items: [{ productId: prod('Vestido Amarillo')._id, name: 'Vestido Amarillo', price: 160, qty: 1 }] },
    { orderNumber: '001004', userId: byName('Ana Torres')._id,     client: 'Ana Torres',     avatar: 'AT', total: 420, currency: 'MXN', status: 'Entregado', date: '09/08/2026', items: [{ productId: prod('Suéter Beige')._id, name: 'Suéter Beige', price: 420, qty: 1 }] },
    { orderNumber: '001005', userId: byName('Sergio Mendoza')._id, client: 'Sergio Mendoza', avatar: 'SM', total: 530, currency: 'MXN', status: 'Pendiente', date: '09/10/2026', items: [{ productId: prod('Abrigo Azul')._id, name: 'Abrigo Azul', price: 530, qty: 1 }] },
    { orderNumber: '001006', userId: byName('Luis Martínez')._id,  client: 'Luis Martínez',  avatar: 'LM', total: 530, currency: 'MXN', status: 'Entregado', date: '05/10/2026', items: [{ productId: prod('Abrigo Azul')._id, name: 'Abrigo Azul', price: 530, qty: 1 }] },
  ])

  await Review.insertMany([
    { productId: prod('Abrigo Azul')._id,      userId: byName('Luis Martínez')._id, userName: 'Luis Martínez', rating: 5, comment: 'Excelente calidad, mi perrito quedó muy cómodo.', date: '10/03/2026' },
    { productId: prod('Vestido Amarillo')._id, userId: byName('Julio Gómez')._id,   userName: 'Julio Gómez',   rating: 4, comment: 'Bonito diseño aunque tardó un poco en llegar.',    date: '08/03/2026' },
    { productId: prod('Suéter Beige')._id,     userId: byName('Ana Torres')._id,    userName: 'Ana Torres',    rating: 5, comment: 'Mi gata lo usa todos los días, perfecto material.', date: '05/03/2026' },
  ])

  console.log(`✅ Listo: ${users.length} usuarios, ${products.length} productos, ${orders.length} pedidos y 3 reseñas.`)
  console.log('\n🔑 Credenciales de prueba:')
  console.log('   Admin:   admin / admin123')
  console.log('   Cliente: luism / password123\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Error al sembrar la base de datos:', err.message)
  process.exit(1)
})
