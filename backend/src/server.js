require('dotenv').config();
require('./config/db');

console.log('A punto de iniciar el servidor...');
console.log('Configuración de la base de datos cargada correctamente.');

const app = require('./app');
const PORT = process.env.PORT || 1522;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
})
