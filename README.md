# Contador de Campo

Este proyecto es una aplicación web diseñada para el conteo y gestión de ganado en campo. Funciona como una **Single Page Application (SPA)**, optimizada para un uso rápido y eficiente.

## 🏗 Estructura y Arquitectura del Proyecto

El proyecto utiliza **Next.js 16** con **TypeScript** y sigue una arquitectura moderna centrada en el cliente.

### 1. Frontend (Interfaz y Lógica de Usuario)
Todo el código principal se encuentra dentro de la carpeta `src/`.
*   **Páginas (App Router)**: En `src/app/`.
    *   `page.tsx`: Punto de entrada que gestiona la vista condicional (Login vs Dashboard).
    *   `layout.tsx`: Define la estructura base y envuelve la app en los Providers necesarios.
*   **Componentes**: En `src/components/`.
    *   `Dashboard.tsx`: El corazón de la aplicación, contiene la lógica de conteo e interacción.
    *   `Login.tsx`: Pantalla de acceso.
    *   `ui/`: Elementos reutilizables como botones y tarjetas (Cards).
*   **Estilos**: Se utiliza **Tailwind CSS v4** para el diseño, con estilos globales en `src/app/globals.css`.

### 2. Backend y Persistencia de Datos
Actualmente, el proyecto funciona **sin un backend tradicional** (Serverless/Node/Python) ni base de datos externa.
*   **Lógica de Datos**: Se gestiona enteramente en el cliente a través de **React Context** (`src/context/AppContext.tsx`).
*   **Persistencia**: Los datos (conteo de animales, autenticación) se guardan en el **Local Storage** del navegador. Esto permite que la información persista entre recargas de página en el dispositivo del usuario.

### 📂 Mapa de Carpetas Clave

```text
contador_campo/
├── public/              # Archivos estáticos (iconos, imágenes)
├── src/
│   ├── app/             # Rutas y configuración de Next.js
│   │   ├── globals.css  # Estilos globales
│   │   └── page.tsx     # Lógica de visualización principal
│   ├── components/      # Bloques de la interfaz
│   │   ├── Dashboard.tsx 
│   │   └── Login.tsx    
│   └── context/
│       └── AppContext.tsx # "Cerebro" de la app (Estado y lógica)
└── package.json         # Dependencias (Next, React, Tailwind, Framer Motion)
```

---

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
