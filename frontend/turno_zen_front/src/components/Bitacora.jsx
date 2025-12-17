import React, { useState, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification.js';
import './Bitacora.css';

const Bitacora = ({ usuario }) => {
  const [entradas, setEntradas] = useState([]);
  const [nuevaEntrada, setNuevaEntrada] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
    clase: '',
    alumnos: '',
    observaciones: '',
    ejercicios: '',
    asistencia: ''
  });
  const [filtroFecha, setFiltroFecha] = useState('');
  const [clases, setClases] = useState([]);
  const { notification, showNotification } = useNotification();

  const handleAlumnosChange = (e) => {
    const alumnos = e.target.value;
    setNuevaEntrada({
      ...nuevaEntrada, 
      alumnos,
      asistencia: alumnos ? '100' : ''
    });
  };

  const contarAlumnosInscritos = (nombreClase) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let totalInscritos = 0;
    
    usuarios.forEach(usuario => {
      if (usuario.reservas) {
        const reservasConfirmadas = usuario.reservas.filter(reserva => 
          reserva.curso === nombreClase && reserva.estado === 'confirmado'
        );
        totalInscritos += reservasConfirmadas.length;
      }
    });
    
    return totalInscritos;
  };

  const handleClaseChange = (e) => {
    const claseSeleccionada = e.target.value;
    const alumnosInscritos = contarAlumnosInscritos(claseSeleccionada);
    
    setNuevaEntrada({
      ...nuevaEntrada,
      clase: claseSeleccionada,
      alumnos: alumnosInscritos.toString(),
      asistencia: alumnosInscritos > 0 ? '100' : ''
    });
  };

  useEffect(() => {
    const bitacoraGuardada = localStorage.getItem(`bitacora_${usuario.id}`);
    if (bitacoraGuardada) {
      setEntradas(JSON.parse(bitacoraGuardada));
    }

    const cursosDisponibles = [
      { id: 1, categoria: "Pilates Principiantes", profesor: "Fede" },
      { id: 2, categoria: "Yoga Hatha", profesor: "Ana" },
      { id: 3, categoria: "Yoga Vinyasa", profesor: "Carlos" },
      { id: 4, categoria: "Pilates Terapéutico", profesor: "María" },
      { id: 5, categoria: "Meditación Mindfulness", profesor: "Laura" },
      { id: 6, categoria: "Stretching & Flexibilidad", profesor: "Diego" },
      { id: 7, categoria: "Yoga Restaurativo", profesor: "Sofia" },
      { id: 8, categoria: "Pilates con Máquinas", profesor: "Roberto" }
    ];

    const clasesDelProfesor = cursosDisponibles.filter(curso => 
      curso.profesor.toLowerCase() === usuario.nombre.toLowerCase()
    );

    const clasesCreadas = JSON.parse(localStorage.getItem('clases') || '[]');
    const clasesDelProfesorCreadas = clasesCreadas
      .filter(clase => clase.profesor === usuario.nombre && clase.activa)
      .map(clase => ({
        id: clase.id,
        categoria: clase.nombre,
        profesor: clase.profesor
      }));

    setClases([...clasesDelProfesor, ...clasesDelProfesorCreadas]);
  }, [usuario.id, usuario.nombre]);

  const guardarEntrada = () => {
    if (!nuevaEntrada.clase || !nuevaEntrada.observaciones) {
      showNotification('Por favor completa los campos obligatorios (Clase y Observaciones)');
      return;
    }

    const entrada = {
      id: Date.now(),
      ...nuevaEntrada,
      profesor: usuario.nombre,
      fechaCreacion: new Date().toISOString()
    };

    const nuevasEntradas = [entrada, ...entradas];
    setEntradas(nuevasEntradas);
    localStorage.setItem(`bitacora_${usuario.id}`, JSON.stringify(nuevasEntradas));

    showNotification('Entrada guardada exitosamente en la bitácora');

    setNuevaEntrada({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
      clase: '',
      alumnos: '',
      observaciones: '',
      ejercicios: '',
      asistencia: ''
    });
  };

  const eliminarEntrada = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
      const nuevasEntradas = entradas.filter(entrada => entrada.id !== id);
      setEntradas(nuevasEntradas);
      localStorage.setItem(`bitacora_${usuario.id}`, JSON.stringify(nuevasEntradas));
      showNotification('Entrada eliminada exitosamente');
    }
  };

  const entradasFiltradas = entradas.filter(entrada => {
    if (!filtroFecha) return true;
    return entrada.fecha === filtroFecha;
  });

  const obtenerEstadisticas = () => {
    const totalClases = entradas.length;
    const clasesUltimaSemana = entradas.filter(entrada => {
      const fechaEntrada = new Date(entrada.fecha);
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
      return fechaEntrada >= haceUnaSemana;
    }).length;

    const promedioAlumnos = entradas.length > 0 
      ? Math.round(entradas.reduce((sum, entrada) => sum + (parseInt(entrada.alumnos) || 0), 0) / entradas.length)
      : 0;

    return { totalClases, clasesUltimaSemana, promedioAlumnos };
  };

  const stats = obtenerEstadisticas();

  return (
    <div className="bitacora-container">
      <div className="bitacora-header">
        <h2>Bitácora del Profesor</h2>
        <div className="estadisticas">
          <div className="stat-card">
            <h3>{stats.totalClases}</h3>
            <p>Total Clases</p>
          </div>
          <div className="stat-card">
            <h3>{stats.clasesUltimaSemana}</h3>
            <p>Esta Semana</p>
          </div>
          <div className="stat-card">
            <h3>{stats.promedioAlumnos}</h3>
            <p>Promedio Alumnos</p>
          </div>
        </div>
      </div>

      <div className="nueva-entrada-section">
        <h3>Nueva Entrada</h3>
        <div className="entrada-form">
          <div className="form-row">
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={nuevaEntrada.fecha}
                onChange={(e) => setNuevaEntrada({...nuevaEntrada, fecha: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                value={nuevaEntrada.hora}
                onChange={(e) => setNuevaEntrada({...nuevaEntrada, hora: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Clase *</label>
              <select
                value={nuevaEntrada.clase}
                onChange={handleClaseChange}
                required
              >
                <option value="">Seleccionar clase</option>
                {clases.map(clase => (
                  <option key={clase.id} value={clase.categoria}>
                    {clase.categoria} ({contarAlumnosInscritos(clase.categoria)} inscritos)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Número de Alumnos</label>
              <input
                type="number"
                min="0"
                value={nuevaEntrada.alumnos}
                onChange={handleAlumnosChange}
                placeholder="Ingresa el número de alumnos"
              />
            </div>
            <div className="form-group">
              <label>Asistencia (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={nuevaEntrada.asistencia}
                onChange={(e) => setNuevaEntrada({...nuevaEntrada, asistencia: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ejercicios Realizados</label>
            <textarea
              value={nuevaEntrada.ejercicios}
              onChange={(e) => setNuevaEntrada({...nuevaEntrada, ejercicios: e.target.value})}
              placeholder="Describe los ejercicios y actividades realizadas..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Observaciones *</label>
            <textarea
              value={nuevaEntrada.observaciones}
              onChange={(e) => setNuevaEntrada({...nuevaEntrada, observaciones: e.target.value})}
              placeholder="Observaciones generales, progreso de alumnos, incidencias..."
              rows="4"
              required
            />
          </div>

          <button className="guardar-btn" onClick={guardarEntrada}>
            <i className="fas fa-save"></i> Guardar Entrada
          </button>
        </div>
      </div>

      <div className="entradas-section">
        <div className="entradas-header">
          <h3>Historial de Clases</h3>
          <div className="filtros">
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              placeholder="Filtrar por fecha"
            />
            <button onClick={() => setFiltroFecha('')}>
              <i className="fas fa-times"></i> Limpiar
            </button>
          </div>
        </div>

        {entradasFiltradas.length > 0 ? (
          <div className="entradas-lista">
            {entradasFiltradas.map(entrada => (
              <div key={entrada.id} className="entrada-card">
                <div className="entrada-header">
                  <div className="entrada-info">
                    <h4>{entrada.clase}</h4>
                    <p>{entrada.fecha} - {entrada.hora}</p>
                  </div>
                  <button 
                    className="eliminar-btn"
                    onClick={() => eliminarEntrada(entrada.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                <div className="entrada-detalles">
                  {entrada.alumnos && (
                    <div className="detalle-item">
                      <span className="label">Alumnos:</span>
                      <span>{entrada.alumnos}</span>
                    </div>
                  )}
                  
                  {entrada.asistencia && (
                    <div className="detalle-item">
                      <span className="label">Asistencia:</span>
                      <span>{entrada.asistencia}%</span>
                    </div>
                  )}

                  {entrada.ejercicios && (
                    <div className="detalle-item">
                      <span className="label">Ejercicios:</span>
                      <p>{entrada.ejercicios}</p>
                    </div>
                  )}

                  <div className="detalle-item">
                    <span className="label">Observaciones:</span>
                    <p>{entrada.observaciones}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-entradas">
            <i className="fas fa-book-open"></i>
            <p>
              {filtroFecha 
                ? 'No hay entradas para la fecha seleccionada' 
                : 'No hay entradas en la bitácora'
              }
            </p>
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

export default Bitacora;