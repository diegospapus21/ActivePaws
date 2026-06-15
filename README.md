Integrantes:

 Diego Gabriel Hernandez Colorado  20230048 
 Ian Raul Orellana Meza  20240211 
 Alvaro Alexander Vasquez Cortez  20240408 

 Descripción

Tienda en línea para mascotas ActivePaws que ofrece ropa y accesorios para perros y gatos.  
Esta primera entrega implementa las interfaces en React JS + Vite + Tailwind CSS con navegación funcional y datos quemados (sin conexión a API).


 Instalación y ejecución

bash
@@ -59,9 +29,6 @@ npm install
# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Build de producción
npm run build

 Dependencias principales

| Paquete | Versión | Uso |
@@ -76,7 +43,7 @@ npm run build

 Pantallas implementadas

Públicas
Públicas
- `/` — Inicio / Home
- `/login` — Inicio de Sesión
- `/registro` — Registro de cuenta
@@ -88,21 +55,20 @@ npm run build
- `/pago` — Método de pago
- `/resenas` — Reseñas de productos (vista móvil)

 Administración
Administración
- `/admin` — Dashboard con métricas y gráfica
- `/admin/productos` — Gestión de productos
- `/admin/pedidos` — Gestión de pedidos
- `/admin/usuarios` — Gestión de usuarios

---

 Acceso rápido (datos de prueba)
Acceso rápido (datos de prueba)

Para ingresar al panel admin, en la pantalla de login escribir `admin` como usuario.

---

 Diseño Responsivo
Diseño Responsivo

La aplicación es completamente responsiva:
- Móvil(< 768px): navegación inferior, layouts en columna
