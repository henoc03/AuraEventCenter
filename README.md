# Proyecto: Centro de Eventos

# Estructura de Proyecto - BugBusters
```
bugbusters/
├── frontend/     # Aplicación cliente hecha en React + Vite
│   ├── public/   # Archivos públicos
│   ├── src/      # Código fuente principal
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── salas/                     # Imágenes específicas de salas
│   │   │       ├── background.png              # Imagen de fondo general
│   │   │       ├── logo-no-background.png      # Logo sin fondo
│   │   │       └── logo.png                    # Logo principal
│   │   ├── components/
│   │   │   ├── common/                         # Componentes reutilizables (nav, inputs, etc)
│   │   │   ├── icons/                          # Iconos utilizados en la aplicación
│   │   │   ├── sections/                       # Apartados reutilizables (por ejemplo, secciones de una página)
│   │   │   └── utils/                          # Componentes utilitarios (funciones, helpers, hooks, etc)
│   │   ├── pages/                              # Páginas individuales
│   │   │   ├── Home.jsx                        # Página principal (Home)
│   │   │   ├── NotFound.jsx                    # Página de error 404
│   │   │   └── SignIn.jsx                      # Página de inicio de sesión
│   │   ├── services/                           # Llamadas a APIs (reservas, salas, servicios, etc)
│   │   ├── App.jsx                             # Componente principal de React
│   │   ├── index.css                           # Estilos globales
│   │   └── main.jsx                            # Punto de entrada de la aplicación
│   ├── package.json                            # Dependencias del frontend
│   ├── vite.config.js                          # Configuración de Vite
│   ├── eslint.config.js                        # Configuración de ESLint
│   └── index.html                              # Archivo HTML principal
│
├── backend/     # Servidor backend hecho en Node.js + Express
│   ├── controllers/   # Lógica de negocio (funciones para reservas, salas, servicios, etc)
│   ├── middleware/    # Middlewares de Express (autenticación, validaciones, manejo de errores)
│   ├── models/        # Modelos para interactuar con Oracle DB (consultas, estructuras)
│   ├── routes/        # Definición de rutas API (por ejemplo /salas, /servicios, /reservas)
│   ├── node_modules/  # Módulos de Node.js
│   ├── server.js      # Archivo principal que levanta el servidor Express
│   ├── package.json   # Dependencias del backend
│   └── package-lock.json
│
├── .gitignore          # Archivos y carpetas que Git debe ignorar
├── README.md           # Documentación del proyecto
```
## 1. Introducción

Este proyecto tiene como objetivo el desarrollo de una aplicación web para gestionar la reserva de diferentes zonas dentro de un centro de eventos. Los usuarios podrán:

- Consultar la disponibilidad de las salas.
- Hacer cotizaciones personalizadas según el tipo de evento.
- Seleccionar opciones adicionales como el servicio de catering.
- Realizar las reservas de las zonas seleccionadas.

Los administradores del sitio tendrán acceso para gestionar:

- Las reservas.
- Los servicios adicionales.
- Consultar el historial de eventos.

## 2. Descripción General

El sistema será una aplicación web para un centro de eventos con múltiples salas y áreas que pueden ser alquiladas para diferentes tipos de eventos. Los usuarios podrán:

- Seleccionar la zona de su preferencia.
- Hacer una cotización en línea.
- Agregar servicios adicionales como catering.
- Realizar una reserva si lo desean.

El sistema también permitirá a los administradores gestionar:

- Las zonas.
- Los servicios adicionales.
- Las cotizaciones.
- Las reservas de los usuarios.

### Tecnologías Utilizadas

#### - **Frontend:**
- React
- Vite
- React Router

#### - **Backend:**
- Node.js
- Express.js
- OracleDB (paquete oracledb)

## 3. Cómo Ejecutar el Proyecto

### Requisitos

Para ejecutar este proyecto en tu máquina local, necesitarás tener instalado:

- **Node.js** (preferiblemente la versión LTS).
- **npm** (que se instala automáticamente con Node.js).

### Pasos para Ejecutar el Proyecto

1. **Clonar el repositorio** en tu máquina local:

   ```bash
   git clone https://git.ucr.ac.cr/JORGE.QUIROSANDERSON/bugbusters.git

2. **Acceder al directorio del proyecto:**

   ```bash
    cd centro-de-eventos

3. **Instalar las dependencias** del proyecto:
    ```bash
    npm install

#### Ejecutar el Frontend:

1. Ir al directorio **frontend/**:
    ```bash
    cd frontend
2.  **Instalar las dependencias** :
    ```bash
    npm install
3. **Ejecutar el proyecto** en modo de dev:
    ```bash
    npm run dev

Esto lanzará el frontend, y podrás acceder a la aplicación web abriendo tu navegador y dirigiéndote a http://localhost:5173.

#### Ejecutar el Backend:

1. Ir al directorio **backend/**:
    ```bash
    cd backend
2.  **Instalar las dependencias** :
    ```bash
    npm install
3. **Ejecutar el proyecto**:
    ```bash
    node server.js

Esto lanzará el backend, y podrás acceder a la aplicación web abriendo tu navegador y dirigiéndote a http://localhost:3000.

Si tienes dudas de cómo instalar Node.js, visita [este video tutorial](https://www.youtube.com/watch?v=29mihvA_zEA&ab_channel=CarlosMasterWeb).


### Colaboradores

- **Jorge Quirós** - C26161
- **Henoc Rojas** - C26764
- **Sharon Jiménez** - C13956
- **Bryan Rivera** - C26477