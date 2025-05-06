const express = require('express');
const cors = require('cors');
const oracleDB = require('oracledb')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

const dbConfig = {
  user: 'username',
  password: 'password',
  connectString: 'database_connect_string'
}

// Rutas básicas
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando!');
});

// Obtener datos del usuario actual
app.get('api/current_user', async (req, res) => {
  try {
    const userId = req.user.id;
    let connection = await oracleDB.getConnection(dbConfig);

    const result = await connection.execute(
      'SELECT * FROM users WHERE user_id = :id', [userId]
    );

    if (result.rows.length === 0) return res.status(404).send('User not found');

    res.json(result.rows)
    await connection.close();
  } catch (err) {
    res.status(500).send('Oracle database error');
  }
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
