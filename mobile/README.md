# 🐾 ActivePaws — Tienda en línea para mascotas

Tienda en línea de ropa y accesorios para perros y gatos. El proyecto tiene tres partes que comparten la **misma API REST y base de datos MongoDB**:

| Carpeta | Qué es | Tecnología |
|---|---|---|
| `backend/` | API REST (login, registro, perfil, productos, carrito/pedidos, reseñas, recuperación de contraseña) | Node.js + Express + MongoDB (Mongoose) |
| `frontend/` | Sitio web público y panel de administración | React + Vite + Tailwind CSS |
| `mobile/` | **App móvil para clientes (Android)** | React Native + Expo SDK 54 + Expo Router |

**Instituto Técnico Ricaldone** — 3.er año de Bachillerato Técnico en Desarrollo de Software
Módulo 5: Desarrollo de componentes para dispositivos móviles · Docente: Daniel Wilfredo Granados Hernández

---

## 👥 Integrantes

| Nombre | Carnet |
|---|---|
| Diego Gabriel Hernández Colorado | 20230048 |
| Ian Raúl Orellana Meza | 20240211 |
| Álvaro Alexander Vásquez Cortez | 20240408 |
| Marcos Alejandro Torres Rodríguez | 20200209 |
| David Eduardo López Miranda | 20240089 |

---

## 📱 Descarga del APK

**Enlace de descarga:** _(pegar aquí el enlace del APK generado con EAS)_

---

## ✅ Funcionalidades de la app móvil

| Funcionalidad | Dónde está |
|---|---|
| **Splash screen** personalizado con el logo de ActivePaws | `app.json` → plugin `expo-splash-screen`, imagen `assets/splash-logo.png` |
| **Inicio de sesión**: valida si ya hay una sesión guardada (token en `expo-secure-store`) y redirige al Home; si la sesión existe, el login no se vuelve a mostrar | `src/screens/LoginScreen.jsx`, `src/navigation/InitialRoute.jsx` |
| **Registro de usuarios** con verificación del correo por código de 6 dígitos | `RegisterScreen.jsx`, `VerifyScreen.jsx` |
| **Edición del perfil** (nombre, correo, usuario, edad, teléfono y cambio de contraseña) | `EditProfileScreen.jsx` → `PUT /api/auth/me` |
| **Home** con el **nombre real** del usuario logueado | `HomeScreen.jsx` |
| **Catálogo** con búsqueda, filtro por categoría y valoración promedio de cada producto | `ProductsScreen.jsx`, `ProductDetailScreen.jsx` |
| **Valoraciones y comentarios**: solo se puede reseñar un producto **comprado y entregado** (una reseña por producto) | `ReviewForm.jsx`, `ReviewCard.jsx` |
| **Carrito de compras**: agregar, modificar cantidades, quitar y finalizar el pedido. Si está vacío se avisa y no se permite comprar | `CartScreen.jsx`, `CheckoutScreen.jsx`, `CartContext.jsx` |
| **Validaciones de stock**: no se puede agregar ni comprar más de lo disponible ni productos agotados; el carrito se sincroniza con el stock real | `CartContext.jsx` + `POST /api/orders/checkout` |
| **Cancelar pedido**: un pedido "Pendiente" se puede cancelar y **el stock vuelve a estar disponible** | `OrderDetailScreen.jsx` → `PUT /api/orders/:id/cancel` |
| **Historial de compras** y detalle de cada pedido | `OrdersScreen.jsx`, `OrderDetailScreen.jsx` |
| **Recuperación de contraseña** dentro de la app (código de 6 dígitos al correo + nueva contraseña) | `ForgotPasswordScreen.jsx`, `ResetPasswordScreen.jsx` |
| **Menú de navegación** tipo Tab (Inicio, Catálogo, Carrito, Pedidos, Perfil) | `src/navigation/TabNavigator.jsx` |

### Validaciones

Se validan en la app (`src/utils/validators.js`) **y** en la API (`backend/src/utils/validators.js`):

- Campos vacíos en todos los formularios.
- Correo con formato válido.
- **Edad**: número entero entre 13 y 100 (no negativa, no decimal).
- Contraseña de mínimo 6 caracteres y confirmación igual.
- Teléfono de 8 a 15 dígitos.
- Cantidades enteras ≥ 1 (nunca negativas) y ≤ stock disponible.
- Precio y stock de productos no negativos (panel admin).
- Comentario de reseña de 5 a 300 caracteres y calificación de 1 a 5.

---

## 🗂️ Estructura de la app móvil

```
mobile/
├── app/                    # Rutas de Expo Router (solo re-exportan pantallas)
│   ├── _layout.jsx         #   → src/navigation/RootNavigator
│   ├── index.jsx           #   → src/navigation/InitialRoute
│   ├── (auth)/             #   login, register, verify, forgot-password, reset-password
│   ├── (tabs)/             #   index (home), products, cart, orders, profile
│   ├── product/[id].jsx    #   detalle de producto
│   ├── order/[id].jsx      #   detalle de pedido
│   ├── checkout.jsx
│   └── edit-profile.jsx
├── src/
│   ├── screens/            # Pantallas (toda la lógica de cada vista)
│   ├── components/         # Componentes reutilizables (Button, Field, ProductCard, CartItem…)
│   ├── navigation/         # RootNavigator (Stack), TabNavigator (Tabs), AuthNavigator, InitialRoute
│   ├── context/            # Estado global: AuthContext, CartContext, ToastContext
│   ├── api/client.js       # Peticiones HTTP con fetch nativo + token JWT
│   ├── utils/              # validators.js, format.js
│   ├── theme/theme.js      # Colores, espaciados y sombras
│   └── config.js           # URL de la API, categorías
├── assets/                 # Ícono y splash
├── app.json                # Configuración de Expo (splash, ícono, URL de la API)
└── eas.json                # Perfiles de compilación del APK
```

> Con Expo Router no existe `App.js`: el punto de entrada es `expo-router/entry` y cada archivo de `app/` es una sola línea que exporta su pantalla desde `src/screens`, así que la carpeta de rutas queda con el mínimo de código.

**Componentes**: `ActionRow`, `Button`, `Card`, `CartItem`, `EmptyState`, `Field`, `InfoLine`, `InfoRow`, `Loading`, `OrderCard`, `OrderTracker`, `PasswordField`, `ProductCard`, `QuantitySelector`, `ReviewCard`, `ReviewForm`, `SectionTitle`, `Stars`, `StatusBadge`.

**Peticiones HTTP**: todas usan `fetch` nativo de JavaScript desde `src/api/client.js`.

**Estado**: los datos globales (usuario, carrito) viven en Context y bajan a los componentes por props. Al cerrar sesión se limpia el carrito y los formularios se reinician después de enviarse.

---

## 📦 Dependencias

### App móvil (`mobile/package.json`)

| Paquete | Uso |
|---|---|
| `expo` ~54 | Plataforma base |
| `expo-router` | Navegación por archivos (Stack + Tabs) |
| `expo-secure-store` | Guardar el token JWT de forma segura |
| `@react-native-async-storage/async-storage` | Guardar el carrito en el dispositivo |
| `expo-splash-screen` | Splash screen personalizado |
| `expo-build-properties` | Permitir HTTP en el APK (`usesCleartextTraffic`) |
| `expo-image` | Imágenes de productos con caché |
| `expo-constants` | Leer la URL de la API desde `app.json` |
| `@expo/vector-icons` | Íconos (Ionicons) |
| `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets` | Requeridas por la navegación |
| `expo-status-bar`, `expo-system-ui`, `expo-linking`, `expo-font` | Utilidades de Expo |

### Backend (`backend/package.json`)

| Paquete | Uso |
|---|---|
| `express` | Servidor y rutas de la API |
| `mongoose` | Modelos y conexión a MongoDB |
| `bcryptjs` | Encriptar contraseñas |
| `jsonwebtoken` | Sesiones con JWT |
| `nodemailer` | Envío de correos (verificación y recuperación) |
| `cors`, `dotenv` | CORS y variables de entorno |
| `nodemon` (dev) | Recarga automática en desarrollo |

---

## ⚙️ Instalación y configuración

### 1. Backend

```bash
cd backend
npm install
# Crear backend/.env (ver variables abajo)
npm run seed     # carga datos de prueba
npm run dev      # API en http://localhost:4000/api
```

Variables de `backend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:clave@cluster.mongodb.net/activepaws
JWT_SECRET=una_clave_secreta_larga
PORT=4000
# Correo (opcional; sin esto los códigos se imprimen en la consola del servidor)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=contraseña_de_aplicacion
EMAIL_FROM="ActivePaws <tucorreo@gmail.com>"
FRONTEND_URL=http://localhost:5173
```

### 2. App móvil

```bash
cd mobile
npm install
npx expo start          # abrir con Expo Go
```

Antes de iniciar, poner la URL de la API en `mobile/app.json` → `expo.extra.apiUrl`
(la IP de tu PC en la red local, p. ej. `http://192.168.1.20:4000/api`, o la URL del backend publicado).

### 3. Generar el APK

```bash
npm install -g eas-cli
eas login
cd mobile
eas build -p android --profile preview    # genera un .apk descargable
```

Configuraciones adicionales hechas en el proyecto:

- `eas.json`: el perfil `preview` genera **APK** (`buildType: apk`).
- `app.json`: plugin `expo-build-properties` con `usesCleartextTraffic: true` para que el APK pueda usar una API `http://`.
- `app.json`: splash con el logo (`assets/splash-logo.png`) y fondo `#efe4d2`.
- `backend`: CORS habilitado para peticiones de la app nativa (que no envían `Origin`).

---

## 🧪 Datos de prueba (`npm run seed`)

| Usuario | Contraseña | Para probar |
|---|---|---|
| `admin` | `admin123` | Panel administrativo (web) |
| `luism` | `password123` | Historial con pedidos entregados (puede reseñar **Collar Premium**) y un pedido **Pendiente** para cancelar |
| `marial` | `password123` | Pedido entregado **sin reseñas** (puede reseñar **Correa Trenzada** y **Suéter Rayas**) y un pedido Pendiente |
| `carlar` | `password123` | Pedido **Enviado** (todavía no puede reseñar) |

Incluye 9 productos (2 inactivos), 9 pedidos y 3 reseñas. Para reseñar una compra nueva, el administrador debe cambiar el pedido a **Entregado** desde el panel web.

---

## 🔌 Endpoints principales de la API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro (nombre, correo, usuario, edad, contraseña) |
| POST | `/api/auth/verify-code` | Verificar correo con código |
| POST | `/api/auth/login` | Iniciar sesión |
| GET / PUT | `/api/auth/me` | Ver / **editar** mi perfil |
| POST | `/api/auth/forgot-password` | Enviar código de recuperación |
| POST | `/api/auth/reset-password` | Nueva contraseña con código (móvil) o enlace (web) |
| GET | `/api/products` | Catálogo (incluye `avgRating` y `reviewCount`) |
| POST | `/api/orders/checkout` | Comprar el carrito (valida stock) |
| GET | `/api/orders/mine` | Historial de pedidos |
| PUT | `/api/orders/:id/cancel` | Cancelar pedido pendiente (devuelve stock) |
| GET / POST | `/api/reviews` | Ver / crear reseñas |

---

## 📄 Licencia

Este proyecto está bajo la licencia **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)

Puedes compartir y adaptar el material, dando crédito a los autores, **sin fines comerciales** y distribuyendo tus contribuciones bajo la misma licencia.
