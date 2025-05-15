# Descripción del servidor, funcionalidades y backend

Esta sección del proyecto contiene la implementación de un servidor desarrollado en **Node.js**, encargado de proveer servicios y establecer conexión con la base de datos.

## Base de datos

La base de datos fue construida utilizando **Oracle Cloud Infrastructure**. Para más detalles sobre su estructura y configuración, se puede consultar la sección correspondiente en [`data_base`](../backend/data_base).

## Servidor

El servidor fue implementado con **Node.js** y el framework **Express**. Su función principal es recibir, procesar y responder solicitudes HTTP, tanto desde el frontend como desde clientes externos.

El archivo principal es `server.js`, encargado de lanzar la aplicación. La lógica central de Express, incluyendo enrutamiento y middlewares, se encuentra en `app.js`.

### Estructura del servidor

- `app.js`: Define la aplicación Express, carga middlewares, rutas y configura el manejo de errores.
- `server.js`: Inicializa el servidor y lo pone a escuchar en el puerto 1522.
- `controllers/`: Contiene la lógica que interactúa con la base de datos y responde al frontend.
- `routes/`: Define las rutas de la API y las conecta con sus respectivos controladores.
- `config/db.js`: Gestiona la conexión con la base de datos Oracle, actualmente compatible con Windows y MacOS.
- `.env`: Define las variables de entorno necesarias para el funcionamiento del proyecto.

### Ejecución del servidor

Para iniciar el servidor de manera local, ejecutar los siguientes comandos:

```bash
npm install
node src/server.js
```

## Compatibilidad y prerequisitos

Para poder ejecutar de forma correcta el backend es necesario que, en caso de encontrarse en `Windows` el interesado debe tener en su disco local `C:` una carpeta llamada `oracle` la cual debe tener la siguiente estructura: 

```bash
oracle/
├── instantclient_23_7/
└── wallet/
```
En caso de encontrarse en MacOS arm64

```bash
...
├── instantclient_23_3/
└── Wallet_BugBusters/
```
Y se debe modificar las [variables de entorno](.env) 
`ORACLE_CLI_MACOS` y `TNS_ADMIN_MACOS` por las rutas actuales en MacOS de donde están ubicados estos archivos

Actualmente solo es soportado Windows y MacOS