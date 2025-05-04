const oracledb = require('oracledb');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Detección del entorno
function isWSL() {
  try {
    return fs.readFileSync('/proc/version', 'utf-8').toLowerCase().includes('microsoft');
  } catch (err) {
    return false;
  }
}

function isWindows() {
  return process.platform === 'win32';
}

function isLinux() {
  return process.platform === 'linux';
}

// Si no estamos en WSL y hay ORACLE_LIB_DIR definido, usar modo thick 
// @note: En WSL, el instant client no se puede usar directamente, por lo que se usa el modo thin, pero la db no está sirviendo con thin
if (!isWSL() && process.env.ORACLE_LIB_DIR) {
  const libDirPath = path.resolve(__dirname, '../../', process.env.ORACLE_LIB_DIR);
  console.log('🔧 Iniciando Oracle Instant Client desde:', libDirPath);
  oracledb.initOracleClient({ libDir: libDirPath });
} else {
  console.log('🟡 Usando modo THIN de Oracle (sin Instant Client)');
}

// Configuración del TNS_ADMIN como ruta absoluta
const walletPath = path.resolve(__dirname, '../../', process.env.TNS_ADMIN);
process.env.TNS_ADMIN = walletPath;

// Verificar si el wallet existe
if (!fs.existsSync(walletPath)) {
  console.error(`❌ Wallet no encontrado en: ${walletPath}`);
  process.exit(1);
}

// Mostrar info de entorno
console.log('🟡 Ruta efectiva de TNS_ADMIN:', process.env.TNS_ADMIN);
console.log('🟡 Contenido de la carpeta TNS_ADMIN:', fs.readdirSync(process.env.TNS_ADMIN));

// Configuración base de conexión
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = { oracledb, getConnection };