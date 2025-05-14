const oracledb = require('oracledb');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

function isWindows() {
  return process.platform === 'win32';
}

function isLinux() {
  return process.platform === 'linux';
}

function isMacOS() {
  return process.platform === 'darwin';
}

walletPath = 0;

// Detección de sistema operativo, actualmente solo funciona, se hace set de 
if (isWindows() && process.env.ORACLE_LIB_DIR) {
  const libDirPath = path.resolve(__dirname, '../../', process.env.ORACLE_LIB_DIR);
  console.log('🔧 Iniciando Oracle Instant Client desde:', libDirPath);
  oracledb.initOracleClient({ libDir: libDirPath });
  // Configuracion de wallet
  walletPath = path.resolve(__dirname, '../../', process.env.TNS_ADMIN);
  process.env.TNS_ADMIN = walletPath;
} else {
  if (isMacOS() && process.env.ORACLE_CLI_MACOS) {
    const libDirPath = path.resolve(__dirname, '../../', process.env.ORACLE_CLI_MACOS);
    console.log('🔧 Iniciando Oracle Instant Client desde:', libDirPath);
    oracledb.initOracleClient({ libDir: libDirPath });
    // Configuracion de wallet
    walletPath = path.resolve(__dirname, '../../', process.env.TNS_ADMIN_MACOS);
    console.log('🔧 WALLET EN:', walletPath);
    process.env.TNS_ADMIN = walletPath;

  } else {
    console.log('❌ Sistema operativo no soportado');
    process.exit(1);
  }

}

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