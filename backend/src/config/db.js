/**
 * @abstract Controlador encargado de proporcionar los datos asociados al
 * dashboard del usuario administrador.
 * @copyright BugBusters team 2025, Universidad de Costa Rica.
 */

// Importar librerías
const oracledb = require('oracledb'); // Driver Oracle para Node.js
require('dotenv').config(); // Carga variables de entorno desde archivo .env
const path = require('path'); // Utilidades para manejo de rutas de archivos
const fs = require('fs'); // Módulo para interacción con sistema de archivos

/**
 * Funciones auxiliares para detectar sistema operativo
 */ 
function isWindows() {
  return process.platform === 'win32';
}
function isLinux() {
  return process.platform === 'linux';
}
function isMacOS() {
  return process.platform === 'darwin';
}

// Variable para almacenar la ruta del wallet
let walletPath = 0;

// Configuración del Oracle Instant Client y Wallet según el sistema operativo
if (isWindows() && process.env.ORACLE_LIB_DIR) {
  // En Windows, se usa la variable ORACLE_LIB_DIR
  const libDirPath = path.resolve(__dirname, '../../',
    process.env.ORACLE_LIB_DIR);
  console.log('🔧 Iniciando Oracle Instant Client desde:', libDirPath);

  // Inicializa el cliente Oracle con la ruta especificada
  oracledb.initOracleClient({ libDir: libDirPath });

  // Configura la ruta del wallet, que contiene archivos TNS_ADMIN
  walletPath = path.resolve(__dirname, '../../', process.env.TNS_ADMIN);
  process.env.TNS_ADMIN = walletPath;

} else if (isMacOS() && process.env.ORACLE_CLI_MACOS) {
  // En MacOS se usa ORACLE_CLI_MACOS y TNS_ADMIN_MACOS
  const libDirPath = path.resolve(__dirname, '../../',
    process.env.ORACLE_CLI_MACOS);
  console.log('🔧 Iniciando Oracle Instant Client desde:', libDirPath);

  // Inicializa el cliente Oracle en macOS
  oracledb.initOracleClient({ libDir: libDirPath });

  // Configura la ruta del wallet para macOS
  walletPath = path.resolve(__dirname, '../../', process.env.TNS_ADMIN_MACOS);
  console.log('🔧 WALLET EN:', walletPath);
  process.env.TNS_ADMIN = walletPath;

} else {
  // Si el sistema operativo no es Windows ni MacOS, entonces no es soportado
  console.log('❌ Sistema operativo no soportado');
  process.exit(1);  // Termina la ejecución del programa con error
}

// Verificar que la carpeta del wallet realmente exista antes de continuar
if (!fs.existsSync(walletPath)) {
  console.error(`❌ Wallet no encontrado en: ${walletPath}`);
  process.exit(1);
}

// Muestra información relevante de TNS_ADMIN
console.log('🟡 Ruta efectiva de TNS_ADMIN:', process.env.TNS_ADMIN);
console.log('🟡 Contenido de la carpeta TNS_ADMIN:',
  fs.readdirSync(process.env.TNS_ADMIN));


// Configuración base para la conexión a la base de datos Oracle
// Se obtienen los datos de usuario, contraseña y string de conexión desde .env
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};
/**
 * Función asíncrona que obtiene una conexión a Oracle usando 
 * la configuración anterior
 * @returns conexión a la base de datos
 */
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// Exportar el driver oracledb y la función getConnection
module.exports = { oracledb, getConnection };
