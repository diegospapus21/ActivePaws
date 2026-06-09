const fs   = require('fs')
const path = require('path')

// Ruta del archivo JSON que actúa como base de datos
const DB_PATH = path.join(__dirname, '../../db.json')

// ─── Estructura inicial de la base de datos ───────────────────────────────────
const INITIAL_DATA = {
  users: [
    { id: 1, name: 'Administrador',  email: 'admin@activepaws.com',   username: 'admin',   password: '$2b$10$5MT1F6wD7Uyk9QDqDFZ1TOiCME4yu2wVOt4QvjCoX2A0iZelBJZCq', role: 'admin',   status: 'Activo' },
    { id: 2, name: 'Luis Martínez',  email: 'luis@marte.com',          username: 'luism',   password: '$2b$10$9ZrpRmHyId2U2WmigyhPvuuv3r/kkQdH9CmfV2GYwTzpgplf9iFc6', role: 'client',  status: 'Activo' },
    { id: 3, name: 'Carla Rivera',   email: 'carla@marte.com',         username: 'carlar',  password: '$2b$10$9ZrpRmHyId2U2WmigyhPvuuv3r/kkQdH9CmfV2GYwTzpgplf9iFc6', role: 'client',  status: 'Activo' },
    { id: 4, name: 'Julio Gómez',    email: 'julio@marte.com',         username: 'juliog',  password: '$2b$10$9ZrpRmHyId2U2WmigyhPvuuv3r/kkQdH9CmfV2GYwTzpgplf9iFc6', role: 'admin',   status: 'Activo' },
    { id: 5, name: 'Ana Torres',     email: 'ana@marte.com',           username: 'anat',    password: '$2b$10$9ZrpRmHyId2U2WmigyhPvuuv3r/kkQdH9CmfV2GYwTzpgplf9iFc6', role: 'client',  status: 'Inactivo' },
    { id: 6, name: 'Sergio Mendoza', email: 'sergio@narate.com',       username: 'sergiom', password: '$2b$10$9ZrpRmHyId2U2WmigyhPvuuv3r/kkQdH9CmfV2GYwTzpgplf9iFc6', role: 'client',  status: 'Inactivo' },
  ],
  // NOTA: todas las contraseñas demo son "password123" (hasheadas con bcrypt)

  products: [
    { id: 1,  name: 'Suéter Azul',       category: 'Ropa para Perros', price: 320, currency: 'MXN', stock: 53, sold: 150, status: 'Activo',   description: 'Suéter cálido y resistente, ideal para días fríos.', tags: ['perro','suéter','invierno'], image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop' },
    { id: 2,  name: 'Vestido Amarillo',  category: 'Ropa para Perros', price: 160, currency: 'MXN', stock: 6,  sold: 132, status: 'Inactivo', description: 'Vestido ligero y colorido, perfecto para el verano.', tags: ['perro','vestido','verano'], image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=300&h=300&fit=crop' },
    { id: 3,  name: 'Suéter Beige',      category: 'Ropa para Gatos',  price: 420, currency: 'MXN', stock: 34, sold: 110, status: 'Inactivo', description: 'Suéter elegante en tono beige para gatos activos.', tags: ['gato','suéter','casual'], image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop' },
    { id: 4,  name: 'Suéter Rayas',      category: 'Ropa para Gatos',  price: 830, currency: 'MXN', stock: 100,sold: 98,  status: 'Activo',   description: 'Diseño a rayas clásico. Tejido suave y duradero.', tags: ['gato','suéter','rayas'], image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=300&h=300&fit=crop' },
    { id: 5,  name: 'Abrigo Azul',       category: 'Ropa para Gatos',  price: 530, currency: 'MXN', stock: 83, sold: 98,  status: 'Activo',   description: 'Mantiene el pelaje seco durante los paseos bajo la lluvia.', tags: ['gato','abrigo','impermeable'], image: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=300&h=300&fit=crop' },
    { id: 6,  name: 'Abrigo Amarillo',   category: 'Ropa para Perros', price: 480, currency: 'MXN', stock: 45, sold: 87,  status: 'Activo',   description: 'Abrigo impermeable amarillo brillante para días lluviosos.', tags: ['perro','abrigo','impermeable'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop' },
    { id: 7,  name: 'Abrigo Beige',      category: 'Ropa para Perros', price: 510, currency: 'MXN', stock: 28, sold: 75,  status: 'Activo',   description: 'Elegante abrigo en tono beige con interior polar.', tags: ['perro','abrigo','elegante'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
    { id: 8,  name: 'Collar Premium',    category: 'Accesorios',       price: 150, currency: 'MXN', stock: 60, sold: 210, status: 'Activo',   description: 'Collar artesanal de cuero genuino con hebilla dorada.', tags: ['accesorio','collar','cuero'], image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=300&h=300&fit=crop' },
    { id: 9,  name: 'Correa Trenzada',   category: 'Accesorios',       price: 220, currency: 'MXN', stock: 38, sold: 143, status: 'Activo',   description: 'Correa de nylon trenzado resistente para paseos diarios.', tags: ['accesorio','correa','paseos'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop' },
  ],

  orders: [
    { id: '001256', client: 'Luis Martínez',  avatar: 'LM', total: 920,  currency: 'MXN', status: 'Pendiente', date: '05/08/2026', items: 3 },
    { id: '001257', client: 'Carla Rivera',   avatar: 'CR', total: 160,  currency: 'MXN', status: 'Enviado',   date: '05/08/2026', items: 1 },
    { id: '001252', client: 'Julio Gómez',    avatar: 'JG', total: 160,  currency: 'MXN', status: 'Entregado', date: '05/08/2026', items: 1 },
    { id: '001251', client: 'Ana Torres',     avatar: 'AT', total: 420,  currency: 'MXN', status: 'Cancelado', date: '09/08/2026', items: 2 },
    { id: '001253', client: 'Sergio Mendoza', avatar: 'SM', total: 520,  currency: 'MXN', status: 'Pendiente', date: '09/10/2026', items: 2 },
    { id: '001261', client: 'Sergio Azul',    avatar: 'SA', total: 530,  currency: 'MXN', status: 'Pendiente', date: '05/10/2026', items: 2 },
  ],

  nextId: { users: 10, products: 10, orders: 262 },
}

// ─── Leer la base de datos 
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    // Primera vez: crear el archivo con los datos iniciales
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf8')
    console.log('📄 Base de datos creada con datos de ejemplo.')
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

// ─── Escribir la base de datos 
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}

// ─── Generar ID único para cada colección 
function nextId(collection) {
  const db = readDB()
  const id = db.nextId[collection]
  db.nextId[collection] = id + 1
  writeDB(db)
  return id
}

module.exports = { readDB, writeDB, nextId }
