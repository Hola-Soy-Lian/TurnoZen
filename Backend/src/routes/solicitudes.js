const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/comprobantes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG) o PDF'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB límite
});

// Crear solicitud de inscripción
router.post('/', upload.single('comprobantePago'), (req, res) => {
  try {
    const {
      claseId,
      estudianteId,
      profesorId,
      horarioSeleccionado,
      email,
      telefono,
      fechaSolicitud,
      estado,
      nombreClase,
      nombreEstudiante
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Comprobante de pago requerido' });
    }

    const solicitud = {
      id: Date.now().toString(),
      claseId,
      estudianteId,
      profesorId,
      horarioSeleccionado,
      email,
      telefono,
      fechaSolicitud,
      estado,
      nombreClase,
      nombreEstudiante,
      comprobantePago: req.file.filename,
      fechaCreacion: new Date().toISOString()
    };

    // Guardar en archivo JSON (simulando base de datos)
    const solicitudesFile = path.join(__dirname, '../../database/solicitudes.json');
    let solicitudes = [];
    
    if (fs.existsSync(solicitudesFile)) {
      const data = fs.readFileSync(solicitudesFile, 'utf8');
      solicitudes = JSON.parse(data);
    }
    
    solicitudes.push(solicitud);
    fs.writeFileSync(solicitudesFile, JSON.stringify(solicitudes, null, 2));

    res.status(201).json({ 
      message: 'Solicitud enviada exitosamente',
      solicitud: solicitud
    });

  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener solicitudes por profesor
router.get('/profesor/:profesorId', (req, res) => {
  try {
    const { profesorId } = req.params;
    const solicitudesFile = path.join(__dirname, '../../database/solicitudes.json');
    
    if (!fs.existsSync(solicitudesFile)) {
      return res.json([]);
    }
    
    const data = fs.readFileSync(solicitudesFile, 'utf8');
    const solicitudes = JSON.parse(data);
    
    const solicitudesProfesor = solicitudes.filter(s => s.profesorId === profesorId);
    
    res.json(solicitudesProfesor);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;