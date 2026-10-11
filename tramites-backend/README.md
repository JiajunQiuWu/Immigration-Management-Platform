# Sistema de Gestión de Trámites — Backend

API REST del sistema de gestión de trámites. Está construida con NestJS y
TypeScript, utiliza PostgreSQL para almacenar la información y Prisma como ORM.

## Contenido

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Configuración e instalación](#configuración-e-instalación)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
- [Pruebas y calidad](#pruebas-y-calidad)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Consideraciones de seguridad](#consideraciones-de-seguridad)

## Funcionalidades

- Registro e inicio de sesión con contraseñas cifradas mediante bcrypt.
- Emisión y validación de tokens de acceso JWT.
- Gestión de trámites asociados al usuario autenticado.
- Validación y transformación de los datos recibidos por la API.
- Persistencia de usuarios, perfiles y trámites en PostgreSQL.
- Instrumentación opcional con NestJS Observe.

## Tecnologías

- **NestJS 12** y **TypeScript**
- **PostgreSQL**
- **Prisma ORM** con el adaptador `pg`
- **Passport** y **JWT** para la autenticación
- **bcrypt** para el hash de contraseñas
- **Vitest** para las pruebas

## Requisitos

- Node.js y npm.
- Una instancia de PostgreSQL accesible desde el backend.

## Configuración e instalación

Desde esta carpeta (`tramites-backend`), instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del backend y define, como mínimo, las
variables `DATABASE_URL` y `JWT_SECRET` (consulta la sección siguiente).

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Cadena de conexión a PostgreSQL que utiliza Prisma. |
| `JWT_SECRET` | Sí | Clave privada utilizada para firmar y verificar los JWT. |
| `PORT` | No | Puerto HTTP de la API. Por defecto, `3000`. |
| `OBSERVE_APP_KEY` | No | Clave de NestJS Observe. Si no se configura, la instrumentación no se activa. |
| `OBSERVE_APP_SECRET` | No | Secreto de NestJS Observe; se configura junto con la clave anterior. |

Ejemplo de `.env` para desarrollo:

```dotenv
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/tramites?schema=public"
JWT_SECRET="sustituye-este-valor-por-una-clave-segura"
PORT=3000
```

Adapta la cadena de conexión a tu instalación de PostgreSQL. No compartas ni
subas el archivo `.env` al repositorio.

## Base de datos

El esquema de Prisma está en `prisma/schema.prisma` y las migraciones en
`prisma/migrations/`. Con PostgreSQL en ejecución y `DATABASE_URL` configurada,
aplica las migraciones existentes:

> **Importante:** actualmente `region` y `officialUrl` se utilizan en el módulo
> de trámites y aparecen en el cliente Prisma generado, pero no están definidos
> en `prisma/schema.prisma` ni en la migración SQL existente. Sincroniza el
> esquema y las migraciones antes de generar de nuevo el cliente o preparar una
> base de datos desde cero; de lo contrario, las operaciones que usan esos
> campos pueden fallar.

```bash
npx prisma migrate deploy
```

Para un entorno local de desarrollo también puedes utilizar:

```bash
npx prisma migrate dev
```

Para generar el cliente de Prisma después de modificar el esquema:

```bash
npx prisma generate
```

El proyecto incluye datos de demostración. Para cargarlos en una base local:

```bash
npm run db:seed
```

El seed crea un administrador, un usuario y trámites de ejemplo. Las
credenciales de demostración son:

| Cuenta | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@tramites.local` | `AdminDemo2026!` |
| Usuario | `usuario@tramites.local` | `UsuarioDemo2026!` |

**Utiliza el seed solo en desarrollo o pruebas.** Restablece las contraseñas de
demostración al ejecutar el seed y no son apropiadas para un entorno real.

## Ejecución

Modo desarrollo:

```bash
npm run start:dev
```

Otros modos disponibles:

```bash
# Inicio normal
npm run start

# Compilar para producción
npm run build

# Iniciar la versión compilada
npm run start:prod
```

La API escucha en el puerto `3000` de forma predeterminada, o en el valor
definido en `PORT`.

## Endpoints

Las rutas de trámites requieren un token JWT en la cabecera
`Authorization: Bearer <token>`.

| Método | Ruta | Autenticación | Descripción |
| --- | --- | --- | --- |
| `GET` | `/` | No | Ruta básica que devuelve un mensaje de bienvenida. |
| `POST` | `/auth/register` | No | Registra una cuenta. La contraseña debe tener al menos 12 caracteres. |
| `POST` | `/auth/login` | No | Inicia sesión y devuelve un token de acceso. |
| `GET` | `/user/procedures` | Sí | Lista los trámites del usuario autenticado. |
| `POST` | `/user/procedures` | Sí | Crea un trámite para el usuario autenticado. |
| `PATCH` | `/user/procedures/:id` | Sí | Actualiza un trámite propio. |
| `DELETE` | `/user/procedures/:id` | Sí | Elimina un trámite propio. |

Ejemplo de registro:

```json
{
  "email": "persona@example.com",
  "password": "una-contrasena-segura",
  "preferredLanguage": "es"
}
```

Ejemplo de inicio de sesión:

```json
{
  "email": "persona@example.com",
  "password": "una-contrasena-segura"
}
```

La respuesta de inicio de sesión incluye `accessToken`. Envíalo en la cabecera
`Authorization` para acceder a las rutas protegidas.

## Pruebas y calidad

```bash
# Pruebas unitarias
npm run test

# Pruebas end-to-end
npm run test:e2e

# Cobertura de pruebas
npm run test:cov

# Análisis estático
npm run lint
```

## Estructura del proyecto

```text
src/
├── auth/             # Registro, inicio de sesión y estrategia JWT
├── prisma/           # Servicio y módulo de acceso a datos
├── user-procedures/  # Endpoints y lógica de gestión de trámites
├── generated/prisma/ # Cliente generado por Prisma
├── app.module.ts     # Módulo raíz y módulos de la aplicación
└── main.ts           # Inicio de la aplicación y configuración global
prisma/
├── migrations/       # Migraciones de base de datos
├── schema.prisma     # Modelos y enums de Prisma
└── seed.ts           # Datos de demostración
test/                 # Pruebas end-to-end
```

## Consideraciones de seguridad

- Usa un valor fuerte, privado y diferente para `JWT_SECRET` en cada entorno.
- Mantén las credenciales de la base de datos y de Observe fuera del repositorio.
- No uses las cuentas de demostración ni sus contraseñas en producción.
- Antes de desplegar, revisa la configuración de CORS y limita los orígenes a los
  dominios que necesite el cliente.
  
