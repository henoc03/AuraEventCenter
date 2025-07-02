require('dotenv').config();
require('./config/db');

const cron = require('node-cron');
const { updateBookingStatuses } = require('./controllers/bookingsController');

console.log('A punto de iniciar el servidor...');
console.log('Configuración de la base de datos cargada correctamente.');

const app = require('./app');
const PORT = process.env.PORT || 1522;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
})

cron.schedule('*/5 * * * *', () => {
  console.log(`[CRON] Ejecutando actualización de estados de reserva...`);
  updateBookingStatuses();
});