# 🐾 ActivePaws – Tienda en Línea

Proyecto formativo del módulo 3.8 – Instituto Técnico Ricaldone  
**Docente:** Ing. Daniel Wilfredo Granados Hernández  
**Nivel:** 3° año Bachillerato en Desarrollo de Software

---

## 👥 Integrantes del equipo

| Nombre | Carné |
|--------|-------|
| (Nombre 1) | — |
| (Nombre 2) | — |
| (Nombre 3) | — |
| (Nombre 4) | — |

---

## 📋 Descripción

Tienda en línea para mascotas **ActivePaws** que ofrece ropa y accesorios para perros y gatos.  
Esta primera entrega implementa las interfaces en **React JS + Vite + Tailwind CSS** con navegación funcional y datos quemados (sin conexión a API).

---

## 🗂️ Estructura de carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── AdminNavbar.jsx
│   ├── ProductCard.jsx
│   ├── StatusBadge.jsx
│   └── MobileNav.jsx
├── screens/             # Pantallas de la aplicación
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Payment.jsx
│   ├── Reviews.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── ProductManagement.jsx
│       ├── OrderManagement.jsx
│       └── UserManagement.jsx
├── data/
│   └── data.js          # Datos quemados (productos, pedidos, usuarios)
├── App.jsx              # Rutas principales (React Router)
├── main.jsx
└── index.css
```

---

## 🚀 Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Build de producción
npm run build
```

---

## 📦 Dependencias principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| react | ^18.2.0 | Framework principal |
| react-dom | ^18.2.0 | Renderizado DOM |
| react-router-dom | ^6.22.0 | Navegación entre pantallas |
| recharts | ^2.10.3 | Gráfica de ventas en dashboard |
| lucide-react | ^0.344.0 | Iconos |
| tailwindcss | ^3.4.1 | Estilos utilitarios |
| vite | ^5.1.0 | Herramienta de construcción |

---

## 🎨 Paleta de colores

| Variable | Color | Uso |
|----------|-------|-----|
| `paw-500` | `#c9891a` | Botones principales, acentos |
| `bark-700` | `#5c3d2e` | Texto principal |
| `cream-100` | `#f5efe6` | Fondos suaves |
| `cream-200` | `#ede0d0` | Bordes, fondos secundarios |

---

## 🖥️ Pantallas implementadas

### Públicas
- `/` — Inicio / Home
- `/login` — Inicio de Sesión
- `/registro` — Registro de cuenta
- `/ropa-perros` — Catálogo ropa para perros
- `/ropa-gatos` — Catálogo ropa para gatos
- `/accesorios` — Catálogo accesorios
- `/producto/:id` — Detalle de producto
- `/carrito` — Carrito de compras
- `/pago` — Método de pago
- `/resenas` — Reseñas de productos (vista móvil)

### Administración
- `/admin` — Dashboard con métricas y gráfica
- `/admin/productos` — Gestión de productos
- `/admin/pedidos` — Gestión de pedidos
- `/admin/usuarios` — Gestión de usuarios

---

## 🔑 Acceso rápido (datos de prueba)

Para ingresar al panel admin, en la pantalla de login escribir **`admin`** como usuario.

---

## 📱 Diseño Responsivo

La aplicación es completamente responsiva:
- **Móvil** (< 768px): navegación inferior, layouts en columna
- **Tablet** (768px – 1024px): grids adaptados
- **Escritorio** (> 1024px): layout completo con navbar horizontal
