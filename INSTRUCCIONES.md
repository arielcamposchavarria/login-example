# 🔐 Login de Prueba - Test CORS

Este proyecto es un login básico para probar errores de CORS con el backend de **BackendHotelT**.

## 📋 Características

✅ **Login a la ruta de Admin**: `/api/auth/login` (AuthController)
✅ **Selector de servidor**: Prueba contra local o producción
✅ **Autenticación con tokens**: NO usa cookies (sin `credentials: 'include'`)
✅ **Vista de respuesta completa**: Headers, status, data
✅ **Detección de errores CORS**: Muestra errores claros en consola
✅ **TypeScript + React + Vite**: Moderno y rápido

## 🚀 Cómo usar

### 1. Instalar dependencias (si no lo has hecho)

```bash
cd C:\Users\USUARIO\downloads\login-example
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Esto abrirá la aplicación en: **http://localhost:5173**

### 3. Probar el login

1. **Selecciona el servidor** en el dropdown:
   - 🌐 **Producción (Render)**: `https://backendhotelt.onrender.com`
   - 💻 **Local (Docker)**: `http://localhost` (puerto 80)
   - 💻 **Local (Artisan)**: `http://localhost:8000`

2. **Ingresa credenciales válidas** de tu base de datos:
   - Email: `admin@ejemplo.com`
   - Password: `tu_password`

3. **Haz clic en "Iniciar Sesión"**

4. **Revisa la consola del navegador (F12)** para ver:
   - 🚀 Request URL
   - 📦 Request body
   - 📨 Response status
   - 📨 Response headers
   - 📨 Response data

## 🔍 Verificar CORS

### ✅ Si funciona correctamente:

En la consola deberías ver:
```
📨 Response headers: {
  "access-control-allow-origin": "http://localhost:5173",
  "access-control-allow-credentials": "true",
  ...
}
```

Y el login debería devolver:
```json
{
  "token": "1|abc123...",
  "user": { ... }
}
```

### ❌ Si hay error CORS:

Verás un error en rojo:
```
Access to fetch at 'https://backendhotelt.onrender.com/api/auth/login'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Causas comunes:**
1. El servidor no tiene `http://localhost:5173` en `CORS_ALLOWED_ORIGINS`
2. El servidor no está corriendo
3. Middleware `HandleCors` no está activo

## 🛠️ Configuración del Backend

Para que este login funcione **SIN errores CORS**, asegúrate de que tu backend tenga:

### En `.env` o variables de entorno de Render:

```env
CORS_ALLOWED_ORIGINS=https://una-hotel-system.vercel.app,http://localhost:5173,http://localhost:5174
```

### En `config/cors.php`:

```php
'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '')))),
'supports_credentials' => true,
```

### En `app/Http/Kernel.php`:

```php
protected $middleware = [
    \Illuminate\Http\Middleware\HandleCors::class, // ← Debe estar aquí
    // ...
];
```

## 📝 Notas importantes

### ⚠️ Este login NO usa `credentials: 'include'`

Esto significa:
- ✅ **Funciona con autenticación por tokens** (Sanctum tokens)
- ❌ **NO funciona con autenticación por cookies** (Sanctum stateful)
- ✅ **Más fácil de debugear** (menos problemas de CORS)

Si necesitas autenticación stateful (cookies), descomenta esta línea en `App.tsx`:

```typescript
// credentials: 'include',
```

Y asegúrate de que tu backend tenga:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,una-hotel-system.vercel.app
```

### 🎯 Ruta específica

Este login hace requests a:
```
POST /api/auth/login
```

**Controller:** `App\Http\Controllers\Api\Auth\AuthController::login()`

**NO** usa la ruta de clientes: `/api/clientes/auth/login`

## 🧪 Testing en producción

Para probar contra Render:

1. Selecciona **"🌐 Producción (Render)"** en el dropdown
2. Asegúrate de tener las variables de entorno correctas en Render Dashboard
3. Haz login con credenciales válidas

## 🔧 Troubleshooting

### "Error de conexión - Failed to fetch"

**Posibles causas:**
1. El servidor backend no está corriendo
2. Error de CORS (revisa consola)
3. URL incorrecta

**Solución:**
- Si es local: verifica que Docker esté corriendo o `php artisan serve`
- Si es Render: verifica que el servicio esté online
- Revisa la consola del navegador (F12) para ver el error exacto

### "Credenciales inválidas"

**Causa:** El email/password no existen en la BD o son incorrectos

**Solución:** Usa credenciales válidas de tu base de datos

### Error CORS persiste

**Solución:**
1. Actualiza `CORS_ALLOWED_ORIGINS` en Render
2. Haz **Manual Deploy con Clear Cache**
3. Ejecuta en Shell de Render:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

## 📚 Recursos

- [Laravel CORS](https://laravel.com/docs/11.x/routing#cors)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Creado para:** BackendHotelT
**Ruta:** `/api/auth/login` (Admin)
**Framework:** React + TypeScript + Vite
