# myplanner-web

Aplicación web para la gestión y planificación personal, desarrollada con React, Vite y TypeScript.

## Tabla de Contenidos

- [myplanner-web](#myplanner-web)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Descripción](#descripción)
  - [🚀 Primeros pasos](#-primeros-pasos)
    - [Prerrequisitos](#prerrequisitos)
    - [Instalación y ejecución](#instalación-y-ejecución)
  - [Stack tecnológico](#stack-tecnológico)
  - [👨🏼‍💻 Plugins recomendados para VS Code](#-plugins-recomendados-para-vs-code)
  - [Estructura de carpetas](#estructura-de-carpetas)
  - [📚 Guías y convenciones](#-guías-y-convenciones)

---

## Descripción

**myplanner-web** es una aplicación web moderna para organizar tareas, eventos y actividades diarias. Utiliza tecnologías actuales como React, Vite, TypeScript y Tailwind CSS para ofrecer una experiencia rápida y eficiente.

---

## 🚀 Primeros pasos

### Prerrequisitos

- NodeJS 16+
- NPM

### Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Ejecuta la app en modo desarrollo:

   ```bash
   npm run dev
   ```

3. Construye la app para producción:

   ```bash
   npm run build
   ```

4. Sirve la build de producción localmente:

   ```bash
   npm run preview
   ```

5. Ejecuta los tests:
   ```bash
   npm run test
   ```

> En cada commit se ejecuta el lint.  
> En cada push se ejecutan los tests automáticamente.

---

## Stack tecnológico

- **ViteJS** + **ReactJS** + **TypeScript**
- **Tailwind CSS** v3 para estilos
- **Jest** + **React Testing Library** para testing
- **React Query** y **Axios** para requests HTTP
- **React Router 6** para rutas
- **Husky** & **Lint Staged** para hooks de git (lint y test automáticos)
- **ESLint** (airbnb, react, hooks, typescript, a11y, jest, testing-library) + **Prettier**
- **Date-fns** para manejo de fechas

---

## 👨🏼‍💻 Plugins recomendados para VS Code

- ES7 React/Redux/GraphQL/React-Native snippets
- ESLint
- Prettier
- EditorConfig for VS Code
- DotENV
- Tailwind CSS IntelliSense

Opcionales:

- Auto Close Tag / Auto Rename Tag
- Path Intellisense
- TODO Highlight

---

## Estructura de carpetas

```text
src
├── App.css                // Estilos principales
├── App.tsx                // Componente principal
├── index.css              // Tailwind y estilos globales
├── main.tsx               // Entry point
├── assets                 // Imágenes, SVG, etc.
├── components             // Componentes reutilizables y de layout
│   ├── ui                 // Componentes UI genéricos (botones, loaders, etc)
│   ├── layout             // Layouts, guards, navegación
│   └── ...
├── plugins                // Configuración de plugins (axios, react-query, etc)
├── services               // Servicios (api, contextos)
│   ├── api                // Abstracciones de API (base, authentication, etc)
│   └── context            // Contextos globales (auth, etc)
├── theme                  // Variables y estilos globales
├── test                   // Utilidades y mocks para tests
├── hooks                  // Custom hooks
├── models                 // Tipos y modelos de datos
├── constants              // Constantes globales
├── utils                  // Utilidades varias
├── routes                 // Definición de rutas
├── pages                  // Vistas (privadas y públicas)
│   ├── private
│   ├── public
│   └── ...
└── .vscode                // Configuración de workspace
```

Archivos de configuración relevantes:

```text
.
├── src/jest.setup.ts
├── .editorconfig
├── .env
├── .eslintrc.js
├── .prettierrc.js
├── tsconfig.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.ts
└── jest.config.js
```

---

## 📚 Guías y convenciones

- Usa **PascalCase** para componentes y carpetas de componentes.
- Los componentes deben ser multi-palabra (ej: `UserCard`, no `Card`).
- Los componentes de UI genéricos van en `components/ui`.
- Los layouts y guards van en `components/layout`.
- Usa barrel exports (`index.ts`) para importar componentes fácilmente.
- Los hooks custom van en `hooks/`.
- Los servicios de API y contextos globales van en `services/`.
- Las páginas se agrupan en `pages/private` y `pages/public`.
- Mantén los componentes presentacionales sin estado y la lógica en contenedores o hooks.
- Usa ESLint y Prettier para mantener el código consistente.
- Los tests van junto a los componentes o en la carpeta `test/`.

> Para más detalles, revisa los comentarios y ejemplos en el código fuente.
