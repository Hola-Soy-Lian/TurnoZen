import React, { useState } from 'react';
import './MisTurnos.css';

const MisTurnos = ({ usuario, onCancelar }) => {
  const reservas = usuario.reservas || [];
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [modalCalificacion, setModalCalificacion] = useState({ visible: false, reserva: null, calificacion: 0, comentario: '' });
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState(() => {
    const favs = localStorage.getItem(`favoritos_${usuario?.id}`);
    return favs ? JSON.parse(favs) : [];
  });

  const obtenerMensajesClase = (reservaId) => {
    const mensajes = JSON.parse(localStorage.getItem(`muro_${reservaId}`) || '[]');
    return mensajes;
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim() || !turnoSeleccionado) return;

    const mensaje = {
      id: Date.now(),
      autor: usuario.nombre,
      autorId: usuario.id,
      tipoAutor: usuario.tipoUsuario,
      mensaje: nuevoMensaje,
      fecha: new Date().toISOString()
    };

    const mensajesActuales = obtenerMensajesClase(turnoSeleccionado.id);
    const nuevosMensajes = [...mensajesActuales, mensaje];
    localStorage.setItem(`muro_${turnoSeleccionado.id}`, JSON.stringify(nuevosMensajes));
    
    setNuevoMensaje('');
  };

  return (
    <div className="mis-turnos-container">
      <div className="turnos-header">
        <div>
          <h2>Mis Turnos</h2>
          <p>Hola {usuario.nombre}, aquí están tus reservas:</p>
        </div>
        <button 
          className="favoritos-btn"
          onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
        >
          <i className="fas fa-heart"></i> {mostrarFavoritos ? 'Ver Turnos' : 'Ver Favoritos'}
        </button>
      </div>

      {mostrarFavoritos ? (
        (() => {
          const clases = JSON.parse(localStorage.getItem('clases') || '[]');
          const clasesFavoritas = clases.filter(c => favoritos.includes(c.id));
          
          return clasesFavoritas.length === 0 ? (
            <div className="no-turnos">
              <i className="fas fa-heart-broken"></i>
              <p>No tienes clases favoritas aún.</p>
              <p>¡Marca tus clases favoritas desde la página principal!</p>
            </div>
          ) : (
            <div className="turnos-grid">
              {clasesFavoritas.map(clase => (
                <div key={clase.id} className="turno-card favorito">
                  <div className="turno-header">
                    <h3>{clase.nombre}</h3>
                    <button 
                      className="remove-fav-btn"
                      onClick={() => {
                        const nuevosFavoritos = favoritos.filter(id => id !== clase.id);
                        setFavoritos(nuevosFavoritos);
                        localStorage.setItem(`favoritos_${usuario?.id}`, JSON.stringify(nuevosFavoritos));
                      }}
                    >
                      <i className="fas fa-heart-broken"></i>
                    </button>
                  </div>
                  <div className="turno-details">
                    <div className="detail">
                      <span className="icon"><i className="fas fa-chalkboard-teacher"></i></span>
                      <span>Instructor: {clase.profesor}</span>
                    </div>
                    <div className="detail">
                      <span className="icon"><i className="fas fa-dollar-sign"></i></span>
                      <span>Precio: ${clase.precio}</span>
                    </div>
                    <div className="detail">
                      <span className="icon"><i className="fas fa-map-marker-alt"></i></span>
                      <span>{clase.modalidad}</span>
                    </div>
                  </div>
                  <p className="clase-descripcion">{clase.descripcion}</p>
                  <button 
                    className="ver-clase-btn"
                    onClick={() => window.location.href = '/'}
                  >
                    <i className="fas fa-eye"></i> Ver en Principal
                  </button>
                </div>
              ))}
            </div>
          );
        })()
      ) : reservas.length === 0 ? (
        <div className="no-turnos">
          <p>No tienes turnos reservados aún.</p>
          <p>¡Reserva tu primera clase!</p>
        </div>
      ) : (
        <div className="turnos-grid">
          {reservas.map(reserva => (
            <div key={reserva.id} className="turno-card">
              <div className="turno-header">
                <h3>{reserva.curso}</h3>
                <span className={`estado-badge ${reserva.estado || 'pendiente'}`}>
                  {reserva.estado === 'confirmado' ? 'Confirmado' : 
                   reserva.estado === 'rechazado' ? 'Rechazado' : 'Pendiente'}
                </span>
              </div>
              
              <div className="turno-details">
                <div className="detail">
                  <span className="icon"><i className="fas fa-chalkboard-teacher"></i></span>
                  <span>Instructor: {reserva.profesor}</span>
                </div>
                
                <div className="detail">
                  <span className="icon"><i className="fas fa-calendar-alt"></i></span>
                  <span>{reserva.horarioSeleccionado}</span>
                </div>
                
                <div className="detail">
                  <span className="icon"><i className="fas fa-envelope"></i></span>
                  <span>{reserva.email}</span>
                </div>
                
                {reserva.telefono && (
                  <div className="detail">
                    <span className="icon"><i className="fas fa-phone"></i></span>
                    <span>{reserva.telefono}</span>
                  </div>
                )}
              </div>
              
              <div className="turno-actions">
                {reserva.estado === 'confirmado' && (
                  <>
                    <button 
                      className="ver-muro-btn"
                      onClick={() => {
                        const solicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]');
                        const solicitud = solicitudes.find(s => s.id === reserva.id);
                        if (solicitud && solicitud.claseId) {
                          window.location.href = `/muro-clase/${solicitud.claseId}`;
                        }
                      }}
                    >
                      <i className="fas fa-comments"></i> Ver Muro de Clase
                    </button>
                    {!reserva.calificado && (
                      <button 
                        className="calificar-btn"
                        onClick={() => setModalCalificacion({ visible: true, reserva, calificacion: 0, comentario: '' })}
                      >
                        <i className="fas fa-star"></i> Calificar Clase
                      </button>
                    )}
                  </>
                )}
                {reserva.estado !== 'rechazado' && (
                  <button 
                    className="cancelar-btn"
                    onClick={() => onCancelar(reserva.id)}
                  >
                    <i className="fas fa-times"></i> {reserva.estado === 'pendiente' ? 'Cancelar Solicitud' : 'Cancelar Turno'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {turnoSeleccionado && (
        <div className="muro-modal">
          <div className="muro-content">
            <div className="muro-header">
              <h3>Muro de Clase: {turnoSeleccionado.curso}</h3>
              <button 
                className="cerrar-muro-btn"
                onClick={() => setTurnoSeleccionado(null)}
              >
                ×
              </button>
            </div>
            
            <div className="mensajes-container">
              {obtenerMensajesClase(turnoSeleccionado.id).map(mensaje => (
                <div key={mensaje.id} className={`mensaje ${mensaje.tipoAutor}`}>
                  <div className="mensaje-header">
                    <span className="autor">{mensaje.autor}</span>
                    <span className={`tipo-badge ${mensaje.tipoAutor}`}>
                      {mensaje.tipoAutor}
                    </span>
                    <span className="fecha">
                      {new Date(mensaje.fecha).toLocaleString()}
                    </span>
                  </div>
                  <div className="mensaje-texto">
                    {mensaje.mensaje}
                  </div>
                </div>
              ))}
              
              {obtenerMensajesClase(turnoSeleccionado.id).length === 0 && (
                <p className="no-mensajes">No hay mensajes en esta clase aún</p>
              )}
            </div>
            
            <div className="enviar-mensaje">
              <textarea
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
                rows="3"
              />
              <button onClick={enviarMensaje}>Enviar</button>
            </div>
          </div>
        </div>
      )}
      
      {modalCalificacion.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Calificar Clase: {modalCalificacion.reserva?.curso}</h3>
            <div className="rating-section">
              <label>Tu calificación:</label>
              <div className="stars-input">
                {[1,2,3,4,5].map(star => (
                  <i 
                    key={star}
                    className={`fas fa-star ${star <= modalCalificacion.calificacion ? 'selected' : ''}`}
                    onClick={() => setModalCalificacion({...modalCalificacion, calificacion: star})}
                  ></i>
                ))}
              </div>
            </div>
            <div className="comment-section">
              <label>Comentario (opcional):</label>
              <textarea
                value={modalCalificacion.comentario}
                onChange={(e) => setModalCalificacion({...modalCalificacion, comentario: e.target.value})}
                placeholder="Comparte tu experiencia..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                if (modalCalificacion.calificacion > 0) {
                  // Guardar calificación
                  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
                  const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id)
                  if (usuarioIndex !== -1) {
                    const reservaIndex = usuarios[usuarioIndex].reservas.findIndex(r => r.id === modalCalificacion.reserva.id)
                    if (reservaIndex !== -1) {
                      usuarios[usuarioIndex].reservas[reservaIndex].calificado = true
                      usuarios[usuarioIndex].reservas[reservaIndex].calificacion = modalCalificacion.calificacion
                      usuarios[usuarioIndex].reservas[reservaIndex].comentario = modalCalificacion.comentario
                      localStorage.setItem('usuarios', JSON.stringify(usuarios))
                      
                      // Actualizar calificación de la clase
                      const clases = JSON.parse(localStorage.getItem('clases') || '[]')
                      const claseIndex = clases.findIndex(c => c.nombre === modalCalificacion.reserva.curso)
                      if (claseIndex !== -1) {
                        clases[claseIndex].calificaciones = clases[claseIndex].calificaciones || []
                        clases[claseIndex].calificaciones.push({
                          alumnoId: usuario.id,
                          alumnoNombre: usuario.nombre,
                          calificacion: modalCalificacion.calificacion,
                          comentario: modalCalificacion.comentario,
                          fecha: new Date().toISOString()
                        })
                        
                        // Calcular promedio
                        const promedio = clases[claseIndex].calificaciones.reduce((sum, cal) => sum + cal.calificacion, 0) / clases[claseIndex].calificaciones.length
                        clases[claseIndex].promedioCalificacion = Math.round(promedio * 10) / 10
                        
                        localStorage.setItem('clases', JSON.stringify(clases))
                      }
                      
                      setModalCalificacion({ visible: false, reserva: null, calificacion: 0, comentario: '' })
                      alert('¡Gracias por tu calificación!')
                    }
                  }
                }
              }} className="confirm-btn">Enviar Calificación</button>
              <button onClick={() => setModalCalificacion({ visible: false, reserva: null, calificacion: 0, comentario: '' })} className="cancel-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisTurnos;