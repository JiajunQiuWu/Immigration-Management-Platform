# 🏛️ ResiFlow - Plataforma de Gestión de Trámites y Residencia

> **ResiFlow** es una solución full-stack bilingüe (Español / 中文) diseñada para simplificar, organizar y realizar el seguimiento de trámites de extranjería, residencia y empadronamiento en España. Incorpora un tablero Kanban interactivo y enlaces dinámicos a las sedes electrónicas oficiales según la comunidad autónoma o municipio seleccionado.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelo de Datos e Integración de Regiones](#-modelo-de-datos-e-integración-de-regiones)
- [Requisitos Previos e Instalación](#-requisitos-previos-e-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Uso y Flujo de Trabajo](#-uso-y-flujo-de-trabajo)
- [Licencia](#-licencia)

---

## 🚀 Características Principales

- 🗺️ **Sedes Oficiales por Región:** Asignación y filtro de trámites con redirección directa a la sede electrónica o sistema de cita previa oficial según la región (Cataluña, Madrid, Comunidad Valenciana, etc.).
- 📋 **Tablero Kanban Interactivo (3 Columnas):** Gestión visual del flujo de trabajo dividido en:
  - **Por hacer (`pending`)**: Trámites recién creados o pendientes de documentación.
  - **En proceso (`in_review`)**: Trámites presentados o en revisión administrativa.
  - **Completado (`completed` / `approved`)**: Trámites resueltos con éxito.
- 🌐 **Soporte Bilingüe Nativo (ES / 中文):** Detección automática del idioma del navegador, persistencia de preferencia mediante cookies y URLs limpias sin prefijos visibles (`localePrefix: 'never'`) alimentadas por `next-intl`.
- 🔐 **Autenticación y Seguridad:** Aislamiento estricto de datos por usuario (`userId`) protegido mediante Json Web Tokens (JWT).
- 📱 **Diseño Responsive & UI Moderna:** Interfaz estilizada con Tailwind CSS optimizada para dispositivos móviles y escritorio.

---

## 📂 Estructura del Proyecto


├── tramites-backend/               # API REST construida con NestJS
│   ├── prisma/
│   │   └── schema.prisma           # Modelos de BD (User, Procedure)
│   ├── src/
│   │   ├── auth/                   # Autenticación, JWT Guard y Estrategias
│   │   ├── procedures/             # Módulo CRUD de Trámites y DTOs
│   │   └── prisma/                 # Servicio global de conexión Prisma
│   ├── .env.example
│   └── package.json
│
└── tramites-frontend/              # Cliente web en Next.js (App Router)
    ├── messages/                   # Archivos de traducción i18n
    │   ├── es.json                 # Mensajes en Español
    │   └── zh.json                 # Mensajes en Chino Mandarín
    ├── src/
    │   ├── app/                    # App Router e i18n Layouts
    │   ├── components/             # Tablero Kanban, Modal y LanguageSwitcher
    │   ├── i18n/                   # Configuración y utilidades de rutas
    │   └── lib/                    # Instancia y configuración de Axios
    ├── middleware.ts               # Detección automática de idioma
    ├── .env.local.example
    └── package.json

---

## 🛠️ Stack Tecnológico

### **Backend (API REST)**
- **Framework:** NestJS
- **ORM:** Prisma 7
- **Base de Datos:** PostgreSQL (Supabase)
- **Autenticación:** Passport.js + JWT (`bcrypt` para hash de contraseñas)
- **Validación:** `class-validator` & `class-transformer`

### **Frontend (Cliente Web)**
- **Framework:** Next.js (App Router)
- **Internacionalización:** `next-intl`
- **Estilos:** Tailwind CSS
- **Cliente HTTP:** Axios (con interceptores para manejo global de tokens y errores)
- **Gestión de Estado:** React Hooks & Zustand

---

Requisitos
Node.js: v18.x o superior

npm / pnpm / yarn

Base de datos PostgreSQL (local o instancia remota en Supabase)

---

cd tramites-backend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear archivo .env)
cp .env.example .env

# Ejecutar migraciones de Prisma
npx prisma migrate dev --name init_resiflow

# Iniciar servidor en modo desarrollo (Puerto 3000)
npm run start:dev

cd ../tramites-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear .env.local)
cp .env.local.example .env.local

# Iniciar cliente web en modo desarrollo (Puerto 3001)
npm run dev
