# Sistema de Gestión de Trámites — Frontend

Aplicación web del sistema de gestión de trámites. Está desarrollada con
Next.js, React y TypeScript, y se conecta a la API del backend para la
autenticación y la gestión de trámites.

## Contenido

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y configuración](#instalación-y-configuración)
- [Ejecución](#ejecución)
- [Conexión con el backend](#conexión-con-el-backend)
- [Idiomas](#idiomas)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Panel para consultar y gestionar los trámites del usuario.
- Creación, actualización de estado y eliminación de trámites.
- Selección de idioma entre español y chino.
- Interfaz adaptable a distintos tamaños de pantalla.
- Sesión de autenticación gestionada con Zustand.

## Tecnologías

- **Next.js 16** con App Router
- **React 19** y **TypeScript**
- **Tailwind CSS 4** para los estilos
- **next-intl** para la internacionalización
- **Zustand** para el estado de la sesión
- **Axios** para las peticiones a la API
- **Lucide React** para los iconos

## Requisitos

- Node.js compatible con Next.js 16.
- npm.
- El backend del sistema en ejecución para poder registrarse, iniciar sesión y
  utilizar las funciones que dependen de la API.

## Instalación y configuración

Desde esta carpeta (`tramites-frontend`), instala las dependencias:

```bash
npm install
```

No se requiere un archivo `.env` para la configuración actual del frontend.
Consulta [Conexión con el backend](#conexión-con-el-backend) si necesitas
utilizar una instancia de API distinta de la local.

## Ejecución

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador. La página
raíz dirige al panel de trámites.

Para compilar y ejecutar la aplicación en modo de producción:

```bash
npm run build
npm run start
```

## Conexión con el backend

Las peticiones HTTP se configuran en `src/lib/api.ts`. Actualmente, la URL base
está definida como:

```text
http://localhost:3000
```

Por tanto, el backend debe estar disponible en esa dirección para que funcionen
el registro, el inicio de sesión y la gestión de trámites. Si utilizas otro host
o puerto, actualiza la URL base en `src/lib/api.ts` antes de iniciar o compilar
la aplicación. El frontend añade el token de acceso a las peticiones protegidas.

**Nota para desarrollo local:** tanto Next.js como el backend utilizan el puerto
`3000` de forma predeterminada, por lo que no pueden iniciarse a la vez en ese
mismo puerto. Una opción es ejecutar el backend en el puerto `3001` (`PORT=3001`)
y cambiar la URL base de la API a `http://localhost:3001`. Otra es mantener el
backend en `3000` y ejecutar Next.js en otro puerto:

```bash
npm run dev -- --port 3001
```

## Idiomas

La interfaz admite español (`es`) y chino (`zh`). Los textos se mantienen en
`messages/es.json` y `messages/zh.json`; la configuración de idiomas y
navegación está en `src/i18n/`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run build` | Genera la compilación de producción. |
| `npm run start` | Sirve la compilación de producción; ejecuta primero `npm run build`. |
| `npm run lint` | Analiza el código con ESLint. |

## Sesión y seguridad

El estado de la sesión se conserva en el almacenamiento local del navegador
mediante Zustand. Al cerrar sesión se elimina el token guardado. No compartas
cuentas ni tokens de acceso y utiliza HTTPS al publicar la aplicación.

## Estructura del proyecto

```text
src/
├── app/
│   ├── [locale]/       # Páginas de inicio, acceso, registro y panel
│   ├── globals.css     # Estilos globales
│   └── layout.tsx      # Diseño raíz de Next.js
├── components/         # Selector de idioma y componentes reutilizables
├── i18n/               # Configuración de idiomas y navegación
├── lib/                # Cliente HTTP y funciones auxiliares
└── store/              # Estado de autenticación con Zustand
messages/               # Traducciones al español y al chino
public/                 # Recursos estáticos
proxy.ts                # Middleware de navegación por idioma
```
