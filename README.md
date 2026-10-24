# ASM Market — Frontend Web App (Entrega 3)

Aplicación web construida con **Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS v4** para **ASM Market** (curaduría e importación de productos de *Beauty*, *Vitaminas* y *Fashion* desde Estados Unidos hacia Colombia). Migra el sitio estático de la Entrega 1 a una arquitectura modular por *features* conectada en tiempo real a nuestra API REST y PostgreSQL.

## 🔗 Enlaces de Despliegue y Repositorios

- **Repositorio Frontend:** [https://github.com/juanocampo08/asm-market-frontend](https://github.com/juanocampo08/asm-market-frontend)
- **Repositorio Backend:** [https://github.com/juanocampo08/asm-market-backend](https://github.com/juanocampo08/asm-market-backend)
- **URL de la API en producción (Render):** [https://asm-market-backend.onrender.com](https://asm-market-backend.onrender.com)
- **URL del Sitio Web en producción (Vercel):** [https://asm-market-frontend.vercel.app](https://asm-market-frontend.vercel.app)

---

## 🔑 Credenciales de Prueba (Creadas por el `seed`)

*(También disponibles con botones de acceso rápido directamente en la vista `/login`)*:

| Rol | Correo electrónico | Contraseña | Vistas y acciones habilitadas |
| :--- | :--- | :--- | :--- |
| **`admin`** | `admin@asmmarket.com` | `Admin123*` | Acceso al **Panel Administrativo (`/admin`)**, creación/edición/eliminación de productos con diálogo de confirmación y gestión global de todos los encargos y sus estados. |
| **`user`** | `cliente@asmmarket.com` | `Cliente123*` | Solicitud de encargos personalizados en `/#encargos` y seguimiento de sus pedidos en **Mis Encargos (`/mis-encargos`)**. |

---

## ⚙️ Cómo ejecutar el proyecto en local

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/juanocampo08/asm-market-frontend.git
   cd asm-market-frontend
   npm install
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env.local` en la raíz basándote en `.env.example`:
   ```env
   NEXT_PUBLIC_API_HOST=http://localhost:3001
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre `http://localhost:3000` en tu navegador.

---

## 🗂️ Organización por Features

Siguiendo la arquitectura modular del curso, todo el código de negocio vive en `src/features/` sin llamadas `fetch` directas en los componentes:
- **`src/features/common/`**: Configuración central (`config.ts`), cliente HTTP único (`http.ts`) que inyecta el token `Bearer` y redirige a `/login` ante un `401`, `Navbar`, `Footer`, `Pagination` y `ConfirmDialog` (+1 pto de bonificación).
- **`src/features/auth/`**: Dominio, servicio, hook `useAuth` y vista editorial dividida `AuthView` para `/login` y `/registro`.
- **`src/features/productos/`**: Dominio, servicio, hook `useProducts`, `ProductCard` y `CatalogSection` con paginación y filtros combinados sincronizados en la URL (`?page=&categoria=&search=&minPrecio=&maxPrecio=`, +2 pts de bonificación).
- **`src/features/encargos/`**: Dominio, servicio, hook `useEncargos`, formulario `EncargoFormSection`, vista privada `MisEncargosView` (`/mis-encargos`) y panel `AdminDashboardView` (`/admin`).
- **`src/proxy.ts`**: Protección de rutas del lado del servidor en Next.js 16 leyendo las cookies `auth_token` y `auth_role` (+3 pts de bonificación).

---

## 🧠 Decisiones Técnicas (En mis propias palabras)

### 1. Flujo completo de un Login hasta que una ruta protegida responde
1. El usuario envía su correo y contraseña en `/login`. `AuthView` valida los campos localmente y llama a `useAuth().login()`, el cual invoca a `authService.login()` -> `apiRequest('/auth/login', { method: 'POST' })`.
2. El backend valida las credenciales con `bcrypt.compare()`, genera un JWT firmado con `{ id, role }` y expiración de 1 hora, y devuelve `{ user, token }`.
3. En el frontend, `tokenStorage.saveSession()` almacena el token y los datos del usuario en `localStorage` y sincroniza las cookies `auth_token` y `auth_role`, disparando el evento `auth-change` para actualizar inmediatamente el `Navbar`.
4. Al entrar a `/mis-encargos`, primero `src/proxy.ts` verifica en el servidor la presencia de la cookie `auth_token`; luego `useEncargos('mios')` llama a `encargoService.getMine()`, y `apiRequest` adjunta automáticamente el header `Authorization: Bearer <token>`.
5. El middleware `authenticateToken` del backend valida el JWT, extrae `req.user.id` y retorna exclusivamente los encargos de ese cliente.

### 2. ¿Dónde guardo el token en el frontend y qué riesgo tiene esa decisión?
El token se guarda en `localStorage` (para adjuntarlo en el header `Authorization` desde `apiRequest`) y en la cookie `auth_token` (para que `src/proxy.ts` pueda redirigir en el servidor).
El riesgo principal de que el token sea accesible desde JavaScript en el cliente es un ataque **XSS (*Cross-Site Scripting*)**, en el que código JavaScript inyectado por un tercero podría leer `localStorage` o `document.cookie` y extraer el JWT. Como mitigación, confiamos en el escapado automático de JSX en React, evitamos inyecciones de HTML crudo y definimos una expiración corta en el token (`3600s`).

### 3. ¿En qué caso mi API responde `401` y en cuál `403`? Ejemplo real del proyecto
- **`401 Unauthorized`:** Cuando la petición no tiene una sesión válida (falta el header `Authorization`, el token expiró o las credenciales de login son incorrectas). Ejemplo: hacer `GET /api/encargos/mios` sin haber iniciado sesión devuelve `401`, y nuestro cliente `http.ts` limpia la sesión y redirige automáticamente a `/login`.
- **`403 Forbidden`:** Cuando el usuario sí está autenticado con un token válido, pero su rol no tiene autorización para el recurso. Ejemplo: si un usuario con rol `user` (`cliente@asmmarket.com`) intenta ejecutar `DELETE /api/productos/3` o `PATCH /api/encargos/1/estado`, el middleware `soloAdmin` responde con `403 Forbidden`.

### 4. Uso de Inteligencia Artificial y correcciones realizadas
Usé IA como asistente para trasladar la propuesta visual de lujo editorial de Figma a clases de Tailwind CSS y estructurar los hooks personalizados. Durante la integración tuve que diagnosticar y corregir:
1. **Contrato de endpoints y doble serialización JSON:** Ajusté `product.service.ts` para consumir `/api/productos` en lugar de `/api/products` y eliminé el `JSON.stringify` manual en los servicios de productos y encargos porque `apiRequest` ya serializaba el objeto `body`.
2. **Contador de encargos en el Dashboard Admin:** Cuando `GET /api/encargos` respondía sin objeto `pagination`, el operador `??` tomaba `DEFAULT_PAGINATION.total` (`0`) en vez de `response.data.length`. Lo corregí en `useEncargos.ts` para reflejar el total real de solicitudes.
3. **Reglas de React 19 (`set-state-in-effect`) y Next.js 16 (`Suspense`):** Envolví las vistas que usan `useSearchParams()` dentro de `<Suspense>` para que el *build* estático de producción (`next build`) compilara sin errores.

---

## 🌐 Captura de Petición Protegida (Pestaña Network con Header `Authorization`)

![Captura Network Authorization](./public/assets/images/network-auth.png)