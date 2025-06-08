const express = require('express');
const cors = require('cors');

const path = require('path');
const usersRoutes = require('./routes/users');
const emailRoutes = require('./routes/emails');
const zonesRoutes = require('./routes/zones');
const dashboardRoutes = require('./routes/dashboard');
const servicesRoutes = require('./routes/services');
const verifyToken = require('./middleware/verifyToken');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', usersRoutes);
app.use('/email', emailRoutes);
app.use('/zones', zonesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/services', servicesRoutes);
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API REST Oracle con tabla USERS ✅');
});

module.exports = app;