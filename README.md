# Proyecto: Centro de Eventos

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

---

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

---

## 3. Estructura del Proyecto

```
bugbusters/
├── backend/                      # Backend en Node.js + Express
│   ├── .env                     # Variables de entorno (conexiones, secretos)
│   ├── package-lock.json        # Archivo de dependencias bloqueadas
│   ├── package.json             # Configuración del backend y dependencias
│   ├── readme.md                # Documentación del backend
│   └── src/                     # Código fuente principal del backend
│       ├── app.js               # Punto de entrada del backend (monta middlewares y rutas)
│       ├── config/
│       │   └── db.js            # Configuración de conexión a OracleDB
│       ├── controllers/         # Lógica para cada entidad
│       │   ├── dashboardController.js
│       │   ├── emailController.js
│       │   ├── usersController.js
│       │   └── zonesController.js
│       ├── middleware/
│       │   └── verifyToken.js   # Middleware para autenticación con JWT
│       ├── routes/              # Definición de rutas Express
│       │   ├── dashboard.js
│       │   ├── emails.js
│       │   ├── users.js
│       │   └── zones.js
│       ├── server.js            # Arranque del servidor (escucha en el puerto)
│       └── utils/
│           └── encryption.js    # Funciones utilitarias para cifrado
│
├── CONTRIBUTING.md              # Guía de contribución para desarrolladores
│
├── frontend/                    # Aplicación cliente hecha en React + Vite
│   ├── eslint.config.js         # Configuración de linting
│   ├── index.html               # Archivo HTML principal
│   ├── package-lock.json        # Dependencias bloqueadas del frontend
│   ├── package.json             # Configuración y scripts del frontend
│   ├── public/
│   │   └── default-image.jpg    # Imagen por defecto (avatar)
│   ├── src/                     # Código fuente del frontend
│   │   ├── App.jsx              # Componente raíz de React
│   │   ├── assets/
│   │   │   └── images/          # Imágenes utilizadas
│   │   │       ├── salas/       # Imágenes específicas de salas
│   │   │       ├── background.png
│   │   │       ├── default-profile-photo.png
│   │   │       ├── logo-no-background.png
│   │   │       └── logo.png
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── common/          # Elementos comunes como Header, Footer, etc.
│   │   │   ├── context/         # Componentes relacionados al enrutamiento privado
│   │   │   ├── icons/           # Iconos personalizados en React
│   │   │   ├── sections/        # Secciones completas como Hero o About
│   │   │   └── utils/           # Utilidades como navegación o carrusel
│   │   ├── context/             # Contexto global (ej. autenticación)
│   │   │   └── AuthContext.jsx
│   │   ├── index.css            # Estilos globales del sitio
│   │   ├── main.jsx             # Entrada del proyecto React
│   │   ├── pages/               # Vistas completas del sitio
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── AdminDashBoard.jsx
│   │   │   ├── Administrator.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── RecoverEmail.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── RoomsAdmin.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── VerifyAccountCode.jsx
│   │   │   └── VerifyCode.jsx
│   │   └── style/               # Archivos CSS puros para cada componente/página
│   │       ├── *.css            # Estilos específicos
│   └── vite.config.js           # Configuración de Vite (servidor de desarrollo)
│
├── package-lock.json            # Archivo raíz de dependencias del proyecto
├── package.json                 # Configuración del monorepo o proyecto raíz
└── README.md                    # Documentación general del proyecto
```
---
## 4. Flujo de Trabajo en Git

### Ramas principales

- **`main`**: Rama protegida. Siempre contiene código listo para producción.
  - No se puede hacer `push` directo.
  - Solo se actualiza mediante **Merge Requests** (MRs) aprobados.
  
- **`dev`**: Rama de desarrollo.
  - Todos trabajamos aquí.
  - Los cambios se integran haciendo `push` o `merge` a esta rama.

### ¿Cómo trabajamos?

1. **Siempre trabajar en `dev`**:
   ```bash
   git checkout dev
   git pull origin dev
2. **Antes de hacer cambios, crear una nueva rama**:
   ```bash
   git checkout -b feature/nombre-del-feature
3. **Subir cambios**:
   ```bash
    git add .
    git commit -m "Descripción breve del cambio"
    git push origin feature/nombre-del-feature
4. **Crear Merge Request desde `feature/` hacia `dev`.**
5. **Pasar de dev a main solo con autorización de Maintainers mediante Merge Request aprobado.

---
## 5. Tecnologías Utilizadas

#### - **Frontend:**
- React
- Vite
- React Router

#### - **Backend:**
- Node.js
- Express.js
- OracleDB (paquete oracledb)
---

## 6. Cómo Ejecutar el Proyecto

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
    node src/server.js
Esto lanzará el backend, y podrás acceder a la aplicación web abriendo tu navegador y dirigiéndote a http://localhost:3000.

---

## 7. Tutoriales de ayuda
Si tienes dudas de cómo instalar Node.js, visita [este video tutorial](https://www.youtube.com/watch?v=29mihvA_zEA&ab_channel=CarlosMasterWeb).

---

## 8. Colaboradores

- **Jorge Quirós** - C26161
- **Henoc Rojas** - C26764
- **Sharon Jiménez** - C13956
- **Bryan Rivera** - C26477
