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
bugbusters
├─ backend
│  ├─ .env
│  ├─ coverage
│  │  └─ coverage-final.json
│  ├─ jest.config.js
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
│     │  ├─ menusController.js
│     │  ├─ productController.js
│     │  ├─ servicesController.js
│     │  ├─ usersController.js
│     │  └─ zonesController.js
│     ├─ middleware
│     │  └─ verifyToken.js
│     ├─ routes
│     │  ├─ dashboard.js
│     │  ├─ emails.js
│     │  ├─ menus.js
│     │  ├─ products.js
│     │  ├─ services.js
│     │  ├─ users.js
│     │  └─ zones.js
│     ├─ server.js
│     ├─ tests
│     │  ├─ dashboard.test.js
│     │  ├─ menus.test.js
│     │  ├─ products.test.js
│     │  ├─ services.test.js
│     │  ├─ users.test.js
│     │  └─ zones.test.js
│     ├─ uploads
│     │  ├─ menus
│     │  │  ├─ image-1749429590099-268829840.jpg
│     │  │  ├─ image-1749446718431-998827570.jpg
│     │  │  ├─ image-1749481942896-172370423.jpg
│     │  │  ├─ image-1749483157554-966508574.jpg
│     │  │  ├─ image-1749483492780-545893145.jpg
│     │  │  ├─ image-1749483657173-584348752.jpg
│     │  │  ├─ image-1749485338342-266632760.jpg
│     │  │  ├─ image-1749485460059-794883239.jpg
│     │  │  ├─ image-1749493890802-54438146.webp
│     │  │  ├─ image-1749496143935-963979825.jpg
│     │  │  ├─ image-1749496235695-437953553.jpg
│     │  │  ├─ image-1749496313650-648634687.jpg
│     │  │  ├─ image-1749496613863-897223139.jpg
│     │  │  ├─ image-1749535218182-607859360.jpg
│     │  │  ├─ image-1749535368160-360980325.jpg
│     │  │  ├─ image-1749536382878-39282317.jpg
│     │  │  ├─ image-1749536464285-256821980.jpg
│     │  │  ├─ image-1749536856221-588005288.jpg
│     │  │  ├─ image-1749537350710-478136024.jpg
│     │  │  ├─ image-1749540153639-470387728.jpg
│     │  │  └─ image-1749540188199-205737139.jpg
│     │  ├─ services
│     │  │  ├─ image-1749533166307-48918123.png
│     │  │  ├─ image-1749585765307-471042938.jpg
│     │  │  ├─ image-1749585840832-371380791.jpg
│     │  │  ├─ image-1749585868962-289939455.jpg
│     │  │  └─ image-1749586708335-467051671.jpg
│     │  ├─ users
│     │  │  ├─ image-1749413515062-260634191.jpg
│     │  │  ├─ image-1749413888931-364616977.jpg
│     │  │  ├─ image-1749416127229-653372612.jpg
│     │  │  ├─ image-1749416414275-218613482.jpg
│     │  │  ├─ image-1749417779433-108195608.jpg
│     │  │  ├─ image-1749421383189-324803112.jpg
│     │  │  ├─ image-1749421400406-457755797.jpg
│     │  │  ├─ image-1749421469676-737585504.jpg
│     │  │  ├─ image-1749421823552-300640209.jpg
│     │  │  ├─ image-1749422138985-648154128.jpg
│     │  │  ├─ image-1749485922993-203812777.jpg
│     │  │  ├─ image-1749485970791-67153004.jpg
│     │  │  ├─ image-1749486103151-478767654.jpg
│     │  │  ├─ image-1749507712481-203961289.jpg
│     │  │  ├─ image-1749524405911-724514402.png
│     │  │  ├─ image-1749617412069-136642342.jpg
│     │  │  ├─ image-1749622200976-874959997.jpg
│     │  │  └─ image-1749622792168-4521716.jpg
│     │  └─ zones
│     │     ├─ image-1749253791729-8319761.png
│     │     ├─ image-1749349676887-817205543.jpg
│     │     ├─ image-1749349686423-17437651.jpg
│     │     ├─ image-1749349717370-400097334.jpg
│     │     ├─ image-1749349799871-763036207.jpg
│     │     ├─ image-1749351847482-469326013.png
│     │     ├─ image-1749351918085-881466373.png
│     │     ├─ image-1749351967728-933135710.png
│     │     ├─ image-1749530504617-755426799.png
│     │     ├─ image-1749530517983-88761023.png
│     │     ├─ image-1749530557582-712520883.png
│     │     ├─ image-1749531438131-683196670.png
│     │     ├─ image-1749571282137-622468229.png
│     │     ├─ image-1749571463322-104412043.png
│     │     ├─ image-1749571472128-190335239.png
│     │     ├─ image-1749571920314-139084940.png
│     │     ├─ image-1749571982907-251611272.jpeg
│     │     ├─ image-1749572017531-439287433.jpeg
│     │     ├─ image-1749572058348-874648564.jpeg
│     │     ├─ image-1749572122731-947511120.png
│     │     ├─ image-1749572226617-914986465.png
│     │     ├─ image-1749572318463-57441245.jpeg
│     │     ├─ image-1749572373283-695215503.png
│     │     ├─ image-1749572854475-889449640.png
│     │     ├─ image-1749573109920-916800585.png
│     │     ├─ image-1749573451917-57304386.png
│     │     ├─ image-1749573473244-956636794.png
│     │     ├─ image-1749573542025-732509286.jpg
│     │     └─ image-1749573562644-628704540.jpg
│     └─ utils
│        ├─ dbMock.js
│        ├─ encryption.js
│        └─ upload.js
├─ CONTRIBUTING.md
├─ coverage
│  ├─ clover.xml
│  ├─ coverage-final.json
│  ├─ lcov-report
│  │  ├─ base.css
│  │  ├─ block-navigation.js
│  │  ├─ favicon.png
│  │  ├─ index.html
│  │  ├─ prettify.css
│  │  ├─ prettify.js
│  │  ├─ sort-arrow-sprite.png
│  │  └─ sorter.js
│  └─ lcov.info
├─ eslint.config.mjs
├─ frontend
│  ├─ babel.config.js
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jest.config.js
│  ├─ jest.setup.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ default-image.jpg
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ images
│  │  │     ├─ background.png
│  │  │     ├─ clienthero.png
│  │  │     ├─ default-profile-photo.png
│  │  │     ├─ default_no_image.jpg
│  │  │     ├─ logo-no-background.png
│  │  │     ├─ logo.png
│  │  │     ├─ menus_hero.jpg
│  │  │     ├─ rooms_hero.jpg
│  │  │     ├─ salas
│  │  │     │  ├─ default_zone.jpg
│  │  │     │  ├─ sala1.png
│  │  │     │  ├─ Sala2.png
│  │  │     │  └─ sala3.png
│  │  │     └─ services-hero.jpg
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  ├─ AddEditMenuModal.jsx
│  │  │  │  ├─ AddEditRoomModal.jsx
│  │  │  │  ├─ AlertMessage.jsx
│  │  │  │  ├─ Auth.jsx
│  │  │  │  ├─ CompactMenu.jsx
│  │  │  │  ├─ CompactRoom.jsx
│  │  │  │  ├─ DropDownMenu.jsx
│  │  │  │  ├─ ExpandedMenu.jsx
│  │  │  │  ├─ ExpandedRoom.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ LoadingPage.jsx
│  │  │  │  ├─ Main.jsx
│  │  │  │  ├─ MenuAdminCard.jsx
│  │  │  │  ├─ Nav.jsx
│  │  │  │  ├─ Navigation.jsx
│  │  │  │  ├─ Page.jsx
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  ├─ ProductCard.jsx
│  │  │  │  ├─ ProductModal.jsx
│  │  │  │  ├─ RoomCard.jsx
│  │  │  │  ├─ ServiceCard.jsx
│  │  │  │  ├─ ServiceModal.jsx
│  │  │  │  ├─ SideBar.jsx
│  │  │  │  ├─ SideNav.jsx
│  │  │  │  ├─ UserCard.jsx
│  │  │  │  ├─ UserModal.jsx
│  │  │  │  └─ __tests__
│  │  │  │     ├─ AddEditMenuModal.test.js
│  │  │  │     ├─ AddEditRoomModal.test.js
│  │  │  │     ├─ Auth.test.js
│  │  │  │     ├─ CompactMenu.test.js
│  │  │  │     ├─ CompactRoom.test.js
│  │  │  │     ├─ ExpandedMenu.test.js
│  │  │  │     ├─ ExpandedRoom.test.js
│  │  │  │     ├─ Footer.test.js
│  │  │  │     ├─ Navigation.test.js
│  │  │  │     ├─ ProductModal.test.js
│  │  │  │     ├─ ServiceModal.test.js
│  │  │  │     └─ UserModal.test.js
│  │  │  ├─ context
│  │  │  │  └─ PrivateRoute.jsx
│  │  │  ├─ icons
│  │  │  │  ├─ Logo.jsx
│  │  │  │  └─ ProfilePhoto.jsx
│  │  │  ├─ sections
│  │  │  │  ├─ About.jsx
│  │  │  │  ├─ ClientDefaultHero.jsx
│  │  │  │  ├─ HomeHero.jsx
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
│  │  │  ├─ MenusAdmin.jsx
│  │  │  ├─ MenusClient.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ Products.jsx
│  │  │  ├─ Profile.jsx
│  │  │  ├─ RecoverEmail.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ RoomsAdmin.jsx
│  │  │  ├─ RoomsClient.jsx
│  │  │  ├─ ServicesAdmin.jsx
│  │  │  ├─ ServicesClient.jsx
│  │  │  ├─ SignIn.jsx
│  │  │  ├─ VerifyAccountCode.jsx
│  │  │  ├─ VerifyCode.jsx
│  │  │  └─ __tests__
│  │  │     ├─ AccountSettings.test.js
│  │  │     ├─ AdminDashBoard.test.js
│  │  │     ├─ Administrator.test.js
│  │  │     ├─ MenusAdmin.test.js
│  │  │     ├─ RoomsAdmin.test.js
│  │  │     ├─ RoomsClient.test.js
│  │  │     ├─ ServicesAdmin.test.js
│  │  │     └─ ServicesClient.test.js
│  │  ├─ setupTests.js
│  │  ├─ style
│  │  │  ├─ account-settings.css
│  │  │  ├─ add-edit-menu-modal.css
│  │  │  ├─ addEditRoomModal.css
│  │  │  ├─ admin-dashboard.css
│  │  │  ├─ admin-products.css
│  │  │  ├─ admin-users.css
│  │  │  ├─ auth.css
│  │  │  ├─ client-default-hero.css
│  │  │  ├─ compact-room.css
│  │  │  ├─ drop-down-menu.css
│  │  │  ├─ expanded-room.css
│  │  │  ├─ header.css
│  │  │  ├─ layout.css
│  │  │  ├─ loading-page.css
│  │  │  ├─ menu-admin-card.css
│  │  │  ├─ menu-cards.css
│  │  │  ├─ menus-admin.css
│  │  │  ├─ menus-client.css
│  │  │  ├─ nav.css
│  │  │  ├─ navigation.css
│  │  │  ├─ pagination.css
│  │  │  ├─ product-modal.css
│  │  │  ├─ profile.css
│  │  │  ├─ room-card.css
│  │  │  ├─ rooms-admin.css
│  │  │  ├─ rooms-client.css
│  │  │  ├─ service-card.css
│  │  │  ├─ services-admin.css
│  │  │  ├─ services-client.css
│  │  │  ├─ side-nav.css
│  │  │  ├─ sideBar.css
│  │  │  └─ user-modal.css
│  │  └─ __mocks__
│  │     └─ fileMock.js
│  └─ vite.config.js
├─ jest.config.js
├─ package-lock.json
├─ package.json
└─ README.md

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
