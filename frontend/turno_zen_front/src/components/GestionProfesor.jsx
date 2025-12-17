import React, { useState, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification.js';
import SolicitudesProfesor from './SolicitudesProfesor.jsx';
import './GestionProfesor.css';

const GestionProfesor = ({ usuario }) => {
  const [clases, setClases] = useState([]);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [nuevaClase, setNuevaClase] = useState({
    nombre: '',
    descripcion: '',
    horarios: [{ dia: '', horaInicio: '', horaFin: '' }],
    cupoMaximo: 10,
    tipo: 'pilates',
    precio: '',
    ubicacion: '',
    modalidad: 'presencial'
  });

  const { notification, showNotification } = useNotification();

  useEffect(() => {
    cargarClases();
  }, [usuario.id]);

  const cargarClases = () => {
    const clasesGuardadas = JSON.parse(localStorage.getItem('clases') || '[]');
    const clasesDelProfesor = clasesGuardadas.filter(clase => clase.profesorId === usuario.id && clase.activa);
    setClases(clasesDelProfesor);
  };



  const agregarHorario = () => {
    setNuevaClase({
      ...nuevaClase,
      horarios: [...nuevaClase.horarios, { dia: '', horaInicio: '', horaFin: '' }]
    });
  };

  const actualizarHorario = (index, campo, valor) => {
    const nuevosHorarios = [...nuevaClase.horarios];
    nuevosHorarios[index][campo] = valor;
    setNuevaClase({
      ...nuevaClase,
      horarios: nuevosHorarios
    });
  };

  const eliminarHorario = (index) => {
    if (nuevaClase.horarios.length > 1) {
      const nuevosHorarios = nuevaClase.horarios.filter((_, i) => i !== index);
      setNuevaClase({
        ...nuevaClase,
        horarios: nuevosHorarios
      });
    }
  };

  const crearClase = () => {
    if (!nuevaClase.nombre.trim() || !nuevaClase.descripcion.trim() || !nuevaClase.precio) {
      showNotification('Por favor completa todos los campos obligatorios');
      return;
    }

    const horariosValidos = nuevaClase.horarios.filter(h => h.dia && h.horaInicio && h.horaFin);
    if (horariosValidos.length === 0) {
      showNotification('Agrega al menos un horario completo');
      return;
    }

    const horariosFormateados = horariosValidos.map(h => `${h.dia} ${h.horaInicio} - ${h.horaFin}`);

    const clase = {
      id: Date.now(),
      nombre: nuevaClase.nombre,
      descripcion: nuevaClase.descripcion,
      profesor: usuario.nombre,
      profesorId: usuario.id,
      horarios: horariosFormateados,
      cupoMaximo: parseInt(nuevaClase.cupoMaximo),
      tipo: nuevaClase.tipo,
      precio: parseFloat(nuevaClase.precio),
      ubicacion: nuevaClase.ubicacion,
      modalidad: nuevaClase.modalidad,
      fechaCreacion: new Date().toISOString(),
      activa: true,
      calificaciones: [],
      promedioCalificacion: 0
    };

    const clases = JSON.parse(localStorage.getItem('clases') || '[]');
    clases.push(clase);
    localStorage.setItem('clases', JSON.stringify(clases));
    window.dispatchEvent(new Event('clasesUpdated'));
    showNotification('¡Clase creada exitosamente!');
    cargarClases();

    setNuevaClase({
      nombre: '',
      descripcion: '',
      horarios: [{ dia: '', horaInicio: '', horaFin: '' }],
      cupoMaximo: 10,
      tipo: 'pilates',
      precio: '',
      ubicacion: '',
      modalidad: 'presencial'
    });
  };

  return (
    <div className="gestion-profesor-container">
      <div className="gestion-header">
        <h2>Gestión de Clases</h2>
        <p>Crea y administra tus clases</p>
      </div>

      <div className="crear-clase-section">
        <h3>Crear Nueva Clase</h3>
        <div className="crear-clase-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre de la Clase *</label>
              <input
                type="text"
                value={nuevaClase.nombre}
                onChange={(e) => setNuevaClase({...nuevaClase, nombre: e.target.value})}
                placeholder="Ej: Pilates Avanzado"
              />
            </div>
            
            <div className="form-group">
              <label>Tipo de Clase</label>
              <select
                value={nuevaClase.tipo}
                onChange={(e) => setNuevaClase({...nuevaClase, tipo: e.target.value})}
              >
                <option value="pilates">Pilates</option>
                <option value="yoga">Yoga</option>
                <option value="meditacion">Meditación</option>
                <option value="stretching">Stretching</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Cupo Máximo</label>
              <input
                type="number"
                min="1"
                max="50"
                value={nuevaClase.cupoMaximo}
                onChange={(e) => setNuevaClase({...nuevaClase, cupoMaximo: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Precio por Mes *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={nuevaClase.precio}
                onChange={(e) => setNuevaClase({...nuevaClase, precio: e.target.value})}
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label>Modalidad</label>
              <select
                value={nuevaClase.modalidad}
                onChange={(e) => setNuevaClase({...nuevaClase, modalidad: e.target.value})}
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrida">Híbrida</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                value={nuevaClase.ubicacion}
                onChange={(e) => setNuevaClase({...nuevaClase, ubicacion: e.target.value})}
                placeholder="Dirección o enlace virtual"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              value={nuevaClase.descripcion}
              onChange={(e) => setNuevaClase({...nuevaClase, descripcion: e.target.value})}
              placeholder="Describe la clase, nivel, beneficios..."
              rows="3"
            />
          </div>

          <div className="horarios-section">
            <label>Horarios Disponibles</label>
            {nuevaClase.horarios.map((horario, index) => (
              <div key={index} className="horario-input">
                <select
                  value={horario.dia}
                  onChange={(e) => actualizarHorario(index, 'dia', e.target.value)}
                >
                  <option value="">Seleccionar día</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
                <input
                  type="time"
                  value={horario.horaInicio}
                  onChange={(e) => actualizarHorario(index, 'horaInicio', e.target.value)}
                  placeholder="Hora inicio"
                />
                <input
                  type="time"
                  value={horario.horaFin}
                  onChange={(e) => actualizarHorario(index, 'horaFin', e.target.value)}
                  placeholder="Hora fin"
                />
                {nuevaClase.horarios.length > 1 && (
                  <button 
                    type="button"
                    className="eliminar-horario-btn"
                    onClick={() => eliminarHorario(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              className="agregar-horario-btn"
              onClick={agregarHorario}
            >
              + Agregar Horario
            </button>
          </div>

          <button className="crear-clase-btn" onClick={crearClase}>
            Crear Clase
          </button>
        </div>
      </div>
      <div className="solicitudes-section">
        <h3>Solicitudes de Inscripción</h3>
        <SolicitudesProfesor profesorId={usuario.id} onSolicitudActualizada={showNotification} />
      </div>

      <div className="separator"></div>
      
      <div className="turnos-confirmados-section">
        <h3>Turnos Confirmados</h3>
        {(() => {
          const solicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]');
          const turnosConfirmados = solicitudes.filter(s => s.profesorId === usuario.id && s.estado === 'confirmado');
          
          return turnosConfirmados.length > 0 ? (
            <div className="turnos-grid">
              {turnosConfirmados.map(turno => (
                <div key={turno.id} className="turno-card">
                  <div className="turno-header">
                    <h4>{turno.nombreClase}</h4>
                    <span className="estado-confirmado">✓ Confirmado</span>
                  </div>
                  <div className="turno-info">
                    <p><strong>Estudiante:</strong> {turno.nombreEstudiante}</p>
                    <p><strong>Horario:</strong> {turno.horarioSeleccionado}</p>
                    <p><strong>Email:</strong> {turno.email}</p>
                    <p><strong>Teléfono:</strong> {turno.telefono}</p>
                  </div>
                  <button 
                    className="ver-muro-btn"
                    onClick={() => window.location.href = `/muro-clase/${turno.claseId}`}
                  >
                    <i className="fas fa-comments"></i> Ver Muro de Clase
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-turnos">
              <i className="fas fa-calendar-check"></i>
              <p>No hay turnos confirmados aún</p>
            </div>
          );
        })()}
      </div>

      <div className="separator"></div>

      <div className="mis-clases-section">
        <div className="clases-header">
          <h3>Mis Clases ({clases.length})</h3>
          {clases.length > 2 && (
            <button 
              className="ver-mas-btn"
              onClick={() => setMostrarTodas(!mostrarTodas)}
            >
              {mostrarTodas ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
        {clases.length > 0 ? (
          <div className={`clases-grid ${mostrarTodas ? 'expanded' : ''}`}>
            {(mostrarTodas ? clases : clases.slice(0, 2)).map(clase => (
              <div key={clase.id} className="clase-card">
                <div className="clase-header">
                  <h4>{clase.nombre}</h4>
                  <span className={`tipo-badge ${clase.tipo}`}>{clase.tipo}</span>
                </div>
                <p className="clase-descripcion">{clase.descripcion}</p>
                <div className="clase-info">
                  <div className="info-item">
                    <i className="fas fa-users"></i>
                    <span>Cupo: {clase.cupoMaximo}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <span>{clase.horarios.length} horarios</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-dollar-sign"></i>
                    <span>${clase.precio}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{clase.modalidad}</span>
                  </div>
                </div>
                <button 
                  className="ver-muro-btn"
                  onClick={() => window.location.href = `/muro-clase/${clase.id}`}
                >
                  <i className="fas fa-comments"></i> Ver Muro
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-clases">
            <i className="fas fa-chalkboard-teacher"></i>
            <p>No has creado clases aún</p>
          </div>
        )}
      </div>
      

      
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default GestionProfesor;