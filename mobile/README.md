# ActivePaws — App móvil de clientes 🐾📱

App móvil para los **clientes** de ActivePaws, construida con **React Native + Expo (SDK 54)** y **Expo Router**. Consume exactamente la **misma API REST y base de datos MongoDB** del backend que ya existe en `../backend`; no duplica lógica ni datos.

> Es la versión móvil de la parte de cliente del frontend web (`../frontend`): catálogo, carrito, compra, pedidos y reseñas. La administración (dashboard, gestión de productos/usuarios/pedidos) sigue viviendo solo en el frontend web.

---

## ✨ Funcionalidades

- **Autenticación completa** contra el backend:
  - Registro con envío de **código de verificación** al correo.
  - Pantalla de verificación de 6 dígitos (con reenvío).
  - Inicio de sesión con JWT (guardado de forma segura con `expo-secure-store`).
  - Recuperación de contraseña (`/forgot-password`).
  - Sesión persistente: al abrir la app se recupera el usuario con `/auth/me`.
- **Catálogo de productos** con búsqueda y filtro por categoría (consulta `/products`).
- **Detalle de producto** con descripción, stock, calificación promedio y **reseñas**.
- **Carrito** local (persistente en el dispositivo con AsyncStorage) con control de cantidades.
- **Checkout real**: crea el pedido en el backend (`/orders/checkout`), que valida stock y descuenta inventario. Exige sesión iniciada y **correo verificado**.
- **Mis pedidos**: historial del cliente (`/orders/mine`) con seguimiento de estado y detalle.
- **Reseñas**: escribir reseña de productos comprados y **entregados** (`/reviews`, `/reviews/can-review/:id`).
- **Perfil**: datos de la cuenta, estado de verificación y cierre de sesión.
- Navegación por **pestañas inferiores**: Inicio · Catálogo · Carrito · Pedidos · Perfil.

Todo comparte la misma base de datos que el frontend web: un pedido hecho desde el móvil aparece en el panel de administración web, y viceversa.

---

## 🚀 Puesta en marcha

### 1. Levantar el backend

```bash
cd ../backend
npm install
npm run seed     # (una sola vez) puebla MongoDB con datos de ejemplo
npm run dev      # API en http://localhost:4000
```

### 2. Configurar la URL de la API

La app necesita saber dónde está el backend. El valor por defecto está en
`app.json` → `expo.extra.apiUrl`. **Cámbialo por la IP de tu computadora** en tu
red local (no uses `localhost` si vas a probar en tu teléfono físico):

```json
"extra": { "apiUrl": "http://192.168.1.20:4000/api" }
```

Alternativas según dónde pruebes:

| Entorno de prueba            | URL de la API                     |
| ---------------------------- | --------------------------------- |
| Teléfono físico (Expo Go)    | `http://TU_IP_LOCAL:4000/api`     |
| Emulador de Android          | `http://10.0.2.2:4000/api`        |
| Simulador de iOS             | `http://localhost:4000/api`       |
| App en modo web              | `http://localhost:4000/api`       |

> Para saber tu IP local: `ipconfig` (Windows) o `ifconfig` / `ip a` (Mac/Linux).
> También puedes usar la variable de entorno `EXPO_PUBLIC_API_URL` (ver `.env.example`), que tiene prioridad sobre `app.json`.

### 3. Instalar y arrancar la app

```bash
cd ../mobile
npm install
npx expo start
```

Luego:
- **Teléfono**: instala **Expo Go** y escanea el QR (tu teléfono y tu PC deben estar en la **misma red Wi-Fi**).
- **Android**: presiona `a` (requiere Android Studio / emulador).
- **iOS**: presiona `i` (requiere Xcode / simulador, solo en macOS).
- **Web**: presiona `w`.

---

## 🔑 Credenciales de prueba (del seed del backend)

| Rol     | Usuario | Contraseña    |
| ------- | ------- | ------------- |
| Cliente | `luism` | `password123` |
| Admin   | `admin` | `admin123`    |

> La app está pensada para clientes. Para reseñar un producto, tu usuario debe tener un pedido **Entregado** que lo incluya (el seed ya deja algunos así, p. ej. Luis Martínez con el "Abrigo Azul").

---

## 🧱 Estructura del proyecto

```
mobile/
├── app/                      # Rutas (Expo Router, basado en archivos)
│   ├── _layout.jsx           # Proveedores globales + stack raíz
│   ├── index.jsx             # Entrada: recupera sesión y entra a las pestañas
│   ├── (auth)/               # Login, registro, verificación, recuperar contraseña
│   ├── (tabs)/               # Inicio, Catálogo, Carrito, Pedidos, Perfil
│   ├── product/[id].jsx      # Detalle de producto + reseñas
│   ├── order/[id].jsx        # Detalle de pedido con seguimiento
│   └── checkout.jsx          # Finalizar compra (datos de envío)
├── src/
│   ├── api/client.js         # Cliente HTTP + manejo del token JWT (SecureStore)
│   ├── config.js             # Resolución de la URL de la API y constantes
│   ├── context/              # AuthContext, CartContext, ToastContext
│   ├── components/           # UI reutilizable (Button, Field, ProductCard, …)
│   ├── theme/theme.js        # Paleta de marca (cream / paw / bark)
│   └── utils/format.js       # Formato de precios, iniciales, fechas
├── assets/                   # Íconos y splash
├── app.json                  # Configuración de Expo
└── package.json
```

## 🧩 Dependencias principales

| Paquete                                   | Uso                                    |
| ----------------------------------------- | -------------------------------------- |
| `expo` / `expo-router`                    | Framework y navegación basada en archivos |
| `expo-secure-store`                       | Guardado seguro del token JWT          |
| `@react-native-async-storage/async-storage` | Persistencia del carrito             |
| `expo-image`                              | Imágenes con caché                     |
| `@expo/vector-icons`                      | Iconografía (Ionicons)                 |

---

## 🛠️ Solución de problemas

- **"No se pudo conectar con el servidor"** → revisa que el backend esté corriendo y que `apiUrl` apunte a la IP correcta (no `localhost` en teléfono físico).
- **El teléfono no carga la app** → asegúrate de estar en la misma red Wi-Fi; algunos routers aíslan dispositivos (activa el modo "tunnel" con `npx expo start --tunnel`).
- **No llega el código de verificación** → si el backend no tiene SMTP configurado, el código se **imprime en la consola del backend** (ver `../backend/.env.example`).
- **`Cannot find module 'babel-preset-expo'`** (error 500 al abrir la app) → tu `node_modules` quedó incompleto o mal instalado. Solución:
  ```bash
  cd mobile
  rm -rf node_modules package-lock.json   # en Windows: borra las carpetas a mano
  npm install
  npx expo start -c                        # -c limpia la caché de Metro
  ```
  Ya dejamos `babel-preset-expo` declarado en `package.json`, así que un `npm install` limpio lo instala en la raíz de `node_modules`.
