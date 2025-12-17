import React, { useState, useEffect } from 'react';
import './SolicitudesProfesor.css';

const SolicitudesProfesor = ({ profesorId, onSolicitudActualizada }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [imagenModal, setImagenModal] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
    const interval = setInterval(cargarSolicitudes, 2000);
    return () => clearInterval(interval);
  }, [profesorId]);

  const cargarSolicitudes = () => {
    const todasSolicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]');
    const solicitudesProfesor = todasSolicitudes.filter(s => 
      (s.profesorId == profesorId) && s.estado === 'pendiente'
    );
    setSolicitudes(solicitudesProfesor);
  };

  const manejarSolicitud = (solicitudId, accion) => {
    const todasSolicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]');
    const solicitudIndex = todasSolicitudes.findIndex(s => s.id === solicitudId);
    
    if (solicitudIndex !== -1) {
      const solicitud = todasSolicitudes[solicitudIndex];
      solicitud.estado = accion;
      solicitud.fechaRespuesta = new Date().toISOString();
      
      if (accion === 'confirmado') {
        solicitud.fechaConfirmacion = new Date().toISOString();
        
        // Actualizar reservas del estudiante
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const estudianteIndex = usuarios.findIndex(u => u.id === solicitud.estudianteId);
        
        if (estudianteIndex !== -1) {
          if (!usuarios[estudianteIndex].reservas) {
            usuarios[estudianteIndex].reservas = [];
          }
          
          const reservaExistente = usuarios[estudianteIndex].reservas.find(r => r.id === solicitudId);
          if (reservaExistente) {
            reservaExistente.estado = 'confirmado';
            reservaExistente.fechaConfirmacion = solicitud.fechaConfirmacion;
          } else {
            usuarios[estudianteIndex].reservas.push({
              id: solicitudId,
              curso: solicitud.nombreClase,
              profesor: solicitud.nombreProfesor,
              horarioSeleccionado: solicitud.horarioSeleccionado,
              email: solicitud.email,
              telefono: solicitud.telefono,
              estado: 'confirmado',
              fechaConfirmacion: solicitud.fechaConfirmacion,
              claseId: solicitud.claseId
            });
          }
          
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
      }
      
      localStorage.setItem('solicitudesClases', JSON.stringify(todasSolicitudes));
      cargarSolicitudes();
      onSolicitudActualizada(`Solicitud ${accion === 'confirmado' ? 'aceptada' : 'rechazada'}`);
    }
  };

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente');

  return (
    <div className="solicitudes-profesor">
      {solicitudesPendientes.length > 0 ? (
        <div className="solicitudes-grid">
          {solicitudesPendientes.map(solicitud => (
            <div key={solicitud.id} className="solicitud-card">
              <div className="solicitud-header">
                <h4>{solicitud.nombreEstudiante}</h4>
                <span className="fecha">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</span>
              </div>
              <div className="solicitud-info">
                <p><strong>Clase:</strong> {solicitud.nombreClase}</p>
                <p><strong>Horario:</strong> {solicitud.horarioSeleccionado}</p>
                <p><strong>Email:</strong> {solicitud.email}</p>
                <p><strong>Teléfono:</strong> {solicitud.telefono}</p>
                <p><strong>Comprobante:</strong> 
                  <button 
                    className="ver-comprobante-btn"
                    onClick={() => setImagenModal(solicitud.comprobantePago)}
                  >
                    <i className="fas fa-eye"></i> Ver Comprobante
                  </button>
                </p>
              </div>
              <div className="solicitud-acciones">
                <button 
                  className="aceptar-btn"
                  onClick={() => manejarSolicitud(solicitud.id, 'confirmado')}
                >
                  <i className="fas fa-check"></i> Aceptar
                </button>
                <button 
                  className="rechazar-btn"
                  onClick={() => manejarSolicitud(solicitud.id, 'rechazado')}
                >
                  <i className="fas fa-times"></i> Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-solicitudes">
          <i className="fas fa-inbox"></i>
          <p>No hay solicitudes pendientes</p>
        </div>
      )}
      
      {imagenModal && (
        <div className="imagen-modal" onClick={() => setImagenModal(null)}>
          <div className="imagen-content" onClick={(e) => e.stopPropagation()}>
            <div className="imagen-header">
              <h3>Comprobante de Pago</h3>
              <button className="cerrar-imagen" onClick={() => setImagenModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="imagen-body">
              <img src={imagenModal} alt="Comprobante" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesProfesor;