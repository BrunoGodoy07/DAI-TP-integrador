# DAI TP Integrador - Backend

## Configuración del Proyecto

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# JWT Secret Key (cambiar por una clave segura en producción)
JWT_SECRET=mi_clave_secreta_super_segura_para_jwt_2025

# Database Configuration (ajustar según tu configuración)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Configurar Base de Datos
- Asegúrate de que PostgreSQL esté ejecutándose
- Crea una base de datos llamada `postgres` (o ajusta el nombre en el .env)
- Ejecuta el script SQL ubicado en `database/events.sql`

### 4. Ejecutar el Proyecto
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints Disponibles

### Eventos
- `GET /api/event` - Listar eventos
- `GET /api/event/:id` - Obtener evento por ID
- `POST /api/event` - Crear evento (requiere autenticación)
- `PUT /api/event` - Actualizar evento (requiere autenticación)
- `DELETE /api/event/:id` - Eliminar evento (requiere autenticación)

### Usuarios
- `POST /api/user/register` - Registrar usuario
- `POST /api/user/login` - Iniciar sesión

### Ubicaciones de Eventos
- `GET /api/event-location` - Listar ubicaciones (requiere autenticación)
- `GET /api/event-location/:id` - Obtener ubicación por ID (requiere autenticación)
- `POST /api/event-location` - Crear ubicación (requiere autenticación)
- `PUT /api/event-location/:id` - Actualizar ubicación (requiere autenticación)
- `DELETE /api/event-location/:id` - Eliminar ubicación (requiere autenticación)

## Autenticación

Para endpoints que requieren autenticación, incluir el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login exitoso.
