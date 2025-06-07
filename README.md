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

```
bugbusters
├─ backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ readme.md
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  └─ db.js
│     ├─ controllers
│     │  ├─ dashboardController.js
│     │  ├─ emailController.js
│     │  ├─ usersController.js
│     │  └─ zonesController.js
│     ├─ middleware
│     │  └─ verifyToken.js
│     ├─ routes
│     │  ├─ dashboard.js
│     │  ├─ emails.js
│     │  ├─ users.js
│     │  └─ zones.js
│     ├─ server.js
│     ├─ uploads
│     │  └─ zones
│     │     ├─ image-1748147689797-637536213.png
│     │     ├─ image-1748199845143-777019567.png
│     │     ├─ image-1748200692967-22978846.png
│     │     ├─ image-1748201095031-510044800.png
│     │     ├─ image-1748201098206-763570854.png
│     │     ├─ image-1748202582835-530893085.png
│     │     ├─ image-1748202585512-570716024.png
│     │     ├─ image-1748203231484-167884618.png
│     │     ├─ image-1748203234081-503732350.png
│     │     ├─ image-1748203369883-446159492.png
│     │     ├─ image-1748203372569-73148879.png
│     │     ├─ image-1748203485497-207320631.png
│     │     ├─ image-1748203488085-238789403.png
│     │     ├─ image-1748203605432-602024171.png
│     │     ├─ image-1748203607923-63556748.png
│     │     ├─ image-1748203883752-989025887.png
│     │     ├─ image-1748203886349-895878100.png
│     │     ├─ image-1748204517434-819120047.png
│     │     ├─ image-1748204520209-245587107.png
│     │     ├─ image-1748204729551-172797106.png
│     │     ├─ image-1748204732139-459002832.png
│     │     ├─ image-1748205441557-709678211.png
│     │     ├─ image-1748205444052-215596349.png
│     │     ├─ image-1748206022855-189211638.png
│     │     ├─ image-1748207016998-393672215.png
│     │     └─ image-1748207019526-375468146.png
│     └─ utils
│        └─ encryption.js
├─ CONTRIBUTING.md
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ default-image.jpg
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ images
│  │  │     ├─ background.png
│  │  │     ├─ default-profile-photo.png
│  │  │     ├─ logo-no-background.png
│  │  │     ├─ logo.png
│  │  │     └─ salas
│  │  │        ├─ default_zone.jpg
│  │  │        ├─ sala1.png
│  │  │        ├─ Sala2.png
│  │  │        └─ sala3.png
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  ├─ AddEditRoomModal.jsx
│  │  │  │  ├─ AlertMessage.jsx
│  │  │  │  ├─ Auth.jsx
│  │  │  │  ├─ CompactRoom.jsx
│  │  │  │  ├─ DropDownMenu.jsx
│  │  │  │  ├─ ExpandedRoom.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ LoadingPage.jsx
│  │  │  │  ├─ Main.jsx
│  │  │  │  ├─ Nav.jsx
│  │  │  │  ├─ Navigation.jsx
│  │  │  │  ├─ Page.jsx
│  │  │  │  ├─ RoomCard.jsx
│  │  │  │  ├─ SideBar.jsx
│  │  │  │  ├─ SideNav.jsx
│  │  │  │  ├─ UserCard.jsx
│  │  │  │  └─ UserModal.jsx
│  │  │  ├─ context
│  │  │  │  └─ PrivateRoute.jsx
│  │  │  ├─ icons
│  │  │  │  ├─ Logo.jsx
│  │  │  │  └─ ProfilePhoto.jsx
│  │  │  ├─ sections
│  │  │  │  ├─ About.jsx
│  │  │  │  ├─ Hero.jsx
│  │  │  │  ├─ OTPInput.jsx
│  │  │  │  └─ Users.jsx
│  │  │  └─ utils
│  │  │     ├─ admin-nav.jsx
│  │  │     ├─ CarouselFade.jsx
│  │  │     ├─ content.js
│  │  │     ├─ profile-nav.jsx
│  │  │     └─ root-nav.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ AccountSettings.jsx
│  │  │  ├─ AdminDashBoard.jsx
│  │  │  ├─ Administrator.jsx
│  │  │  ├─ ChangePassword.jsx
│  │  │  ├─ Clients.jsx
│  │  │  ├─ Home.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ Profile.jsx
│  │  │  ├─ RecoverEmail.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ RoomsAdmin.jsx
│  │  │  ├─ RoomsClient.jsx
│  │  │  ├─ SignIn.jsx
│  │  │  ├─ VerifyAccountCode.jsx
│  │  │  └─ VerifyCode.jsx
│  │  └─ style
│  │     ├─ account-settings.css
│  │     ├─ addEditRoomModal.css
│  │     ├─ admin-dashboard.css
│  │     ├─ admin-users.css
│  │     ├─ auth.css
│  │     ├─ compact-room.css
│  │     ├─ dropDownMenu.css
│  │     ├─ expanded-room.css
│  │     ├─ header.css
│  │     ├─ layout.css
│  │     ├─ loading-page.css
│  │     ├─ nav.css
│  │     ├─ profile.css
│  │     ├─ room-card.css
│  │     ├─ rooms-admin.css
│  │     ├─ rooms-client.css
│  │     ├─ side-nav.css
│  │     ├─ sideBar.css
│  │     └─ user-modal.css
│  └─ vite.config.js
├─ package-lock.json
├─ package.json
└─ README.md

```
```
bugbusters
├─ backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ readme.md
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  └─ db.js
│     ├─ controllers
│     │  ├─ dashboardController.js
│     │  ├─ emailController.js
│     │  ├─ usersController.js
│     │  └─ zonesController.js
│     ├─ middleware
│     │  └─ verifyToken.js
│     ├─ routes
│     │  ├─ dashboard.js
│     │  ├─ emails.js
│     │  ├─ users.js
│     │  └─ zones.js
│     ├─ server.js
│     ├─ tests
│     │  └─ zones-test.js
│     ├─ uploads
│     │  └─ zones
│     │     ├─ image-1749253791729-8319761.png
│     │     ├─ image-1749253794343-17603510.png
│     │     └─ image-1749253797165-431108285.png
│     └─ utils
│        ├─ dbMock.js
│        └─ encryption.js
├─ CONTRIBUTING.md
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ default-image.jpg
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ images
│  │  │     ├─ background.png
│  │  │     ├─ default-profile-photo.png
│  │  │     ├─ logo-no-background.png
│  │  │     ├─ logo.png
│  │  │     └─ salas
│  │  │        ├─ default_zone.jpg
│  │  │        ├─ sala1.png
│  │  │        ├─ Sala2.png
│  │  │        └─ sala3.png
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  ├─ AddEditRoomModal.jsx
│  │  │  │  ├─ AlertMessage.jsx
│  │  │  │  ├─ Auth.jsx
│  │  │  │  ├─ CompactRoom.jsx
│  │  │  │  ├─ DropDownMenu.jsx
│  │  │  │  ├─ ExpandedRoom.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ LoadingPage.jsx
│  │  │  │  ├─ Main.jsx
│  │  │  │  ├─ Nav.jsx
│  │  │  │  ├─ Navigation.jsx
│  │  │  │  ├─ Page.jsx
│  │  │  │  ├─ RoomCard.jsx
│  │  │  │  ├─ SideBar.jsx
│  │  │  │  ├─ SideNav.jsx
│  │  │  │  ├─ UserCard.jsx
│  │  │  │  └─ UserModal.jsx
│  │  │  ├─ context
│  │  │  │  └─ PrivateRoute.jsx
│  │  │  ├─ icons
│  │  │  │  ├─ Logo.jsx
│  │  │  │  └─ ProfilePhoto.jsx
│  │  │  ├─ sections
│  │  │  │  ├─ About.jsx
│  │  │  │  ├─ Hero.jsx
│  │  │  │  ├─ OTPInput.jsx
│  │  │  │  └─ Users.jsx
│  │  │  └─ utils
│  │  │     ├─ admin-nav.jsx
│  │  │     ├─ CarouselFade.jsx
│  │  │     ├─ content.js
│  │  │     ├─ page-image-paths.js
│  │  │     ├─ profile-nav.jsx
│  │  │     └─ root-nav.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ AccountSettings.jsx
│  │  │  ├─ AdminDashBoard.jsx
│  │  │  ├─ Administrator.jsx
│  │  │  ├─ ChangePassword.jsx
│  │  │  ├─ Clients.jsx
│  │  │  ├─ Home.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ Profile.jsx
│  │  │  ├─ RecoverEmail.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ RoomsAdmin.jsx
│  │  │  ├─ RoomsClient.jsx
│  │  │  ├─ SignIn.jsx
│  │  │  ├─ VerifyAccountCode.jsx
│  │  │  └─ VerifyCode.jsx
│  │  └─ style
│  │     ├─ account-settings.css
│  │     ├─ addEditRoomModal.css
│  │     ├─ admin-dashboard.css
│  │     ├─ admin-users.css
│  │     ├─ auth.css
│  │     ├─ compact-room.css
│  │     ├─ dropDownMenu.css
│  │     ├─ expanded-room.css
│  │     ├─ header.css
│  │     ├─ layout.css
│  │     ├─ loading-page.css
│  │     ├─ nav.css
│  │     ├─ profile.css
│  │     ├─ room-card.css
│  │     ├─ rooms-admin.css
│  │     ├─ rooms-client.css
│  │     ├─ side-nav.css
│  │     ├─ sideBar.css
│  │     └─ user-modal.css
│  └─ vite.config.js
├─ jest.config.js
├─ package-lock.json
├─ package.json
└─ README.md

```
```
bugbusters
├─ backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ readme.md
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  └─ db.js
│     ├─ controllers
│     │  ├─ dashboardController.js
│     │  ├─ emailController.js
│     │  ├─ usersController.js
│     │  └─ zonesController.js
│     ├─ middleware
│     │  └─ verifyToken.js
│     ├─ routes
│     │  ├─ dashboard.js
│     │  ├─ emails.js
│     │  ├─ users.js
│     │  └─ zones.js
│     ├─ server.js
│     ├─ tests
│     │  └─ zones-test.js
│     ├─ uploads
│     │  └─ zones
│     │     ├─ image-1749253791729-8319761.png
│     │     ├─ image-1749253794343-17603510.png
│     │     └─ image-1749253797165-431108285.png
│     └─ utils
│        ├─ dbMock.js
│        └─ encryption.js
├─ CONTRIBUTING.md
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ default-image.jpg
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ images
│  │  │     ├─ background.png
│  │  │     ├─ default-profile-photo.png
│  │  │     ├─ logo-no-background.png
│  │  │     ├─ logo.png
│  │  │     └─ salas
│  │  │        ├─ default_zone.jpg
│  │  │        ├─ sala1.png
│  │  │        ├─ Sala2.png
│  │  │        └─ sala3.png
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  ├─ AddEditRoomModal.jsx
│  │  │  │  ├─ AlertMessage.jsx
│  │  │  │  ├─ Auth.jsx
│  │  │  │  ├─ CompactRoom.jsx
│  │  │  │  ├─ DropDownMenu.jsx
│  │  │  │  ├─ ExpandedRoom.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ LoadingPage.jsx
│  │  │  │  ├─ Main.jsx
│  │  │  │  ├─ Nav.jsx
│  │  │  │  ├─ Navigation.jsx
│  │  │  │  ├─ Page.jsx
│  │  │  │  ├─ RoomCard.jsx
│  │  │  │  ├─ SideBar.jsx
│  │  │  │  ├─ SideNav.jsx
│  │  │  │  ├─ UserCard.jsx
│  │  │  │  └─ UserModal.jsx
│  │  │  ├─ context
│  │  │  │  └─ PrivateRoute.jsx
│  │  │  ├─ icons
│  │  │  │  ├─ Logo.jsx
│  │  │  │  └─ ProfilePhoto.jsx
│  │  │  ├─ sections
│  │  │  │  ├─ About.jsx
│  │  │  │  ├─ Hero.jsx
│  │  │  │  ├─ OTPInput.jsx
│  │  │  │  └─ Users.jsx
│  │  │  └─ utils
│  │  │     ├─ admin-nav.jsx
│  │  │     ├─ CarouselFade.jsx
│  │  │     ├─ content.js
│  │  │     ├─ page-image-paths.js
│  │  │     ├─ profile-nav.jsx
│  │  │     └─ root-nav.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ AccountSettings.jsx
│  │  │  ├─ AdminDashBoard.jsx
│  │  │  ├─ Administrator.jsx
│  │  │  ├─ ChangePassword.jsx
│  │  │  ├─ Clients.jsx
│  │  │  ├─ Home.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ Profile.jsx
│  │  │  ├─ RecoverEmail.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ RoomsAdmin.jsx
│  │  │  ├─ RoomsClient.jsx
│  │  │  ├─ SignIn.jsx
│  │  │  ├─ VerifyAccountCode.jsx
│  │  │  └─ VerifyCode.jsx
│  │  └─ style
│  │     ├─ account-settings.css
│  │     ├─ addEditRoomModal.css
│  │     ├─ admin-dashboard.css
│  │     ├─ admin-users.css
│  │     ├─ auth.css
│  │     ├─ compact-room.css
│  │     ├─ dropDownMenu.css
│  │     ├─ expanded-room.css
│  │     ├─ header.css
│  │     ├─ layout.css
│  │     ├─ loading-page.css
│  │     ├─ nav.css
│  │     ├─ profile.css
│  │     ├─ room-card.css
│  │     ├─ rooms-admin.css
│  │     ├─ rooms-client.css
│  │     ├─ side-nav.css
│  │     ├─ sideBar.css
│  │     └─ user-modal.css
│  └─ vite.config.js
├─ jest.config.js
├─ package-lock.json
├─ package.json
└─ README.md

```