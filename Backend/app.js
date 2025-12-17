const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const TurnoZen = express();

// Middlewares
TurnoZen.use(cors());
TurnoZen.use(express.json());
TurnoZen.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
TurnoZen.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const solicitudesRoutes = require('./src/routes/solicitudes');
TurnoZen.use('/api/solicitudes', solicitudesRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
TurnoZen.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = TurnoZen;
