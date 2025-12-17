import React, { useState, useEffect } from 'react';
import './Calendario.css';

const Calendario = ({ usuario }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      cargarReservasDelMes();
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [reservasDelMes, setReservasDelMes] = useState([]);

  useEffect(() => {
    cargarReservasDelMes();
  }, [fechaActual, usuario]);

  const cargarReservasDelMes = () => {
    let eventos = [];
    
    if (usuario.tipoUsuario === 'profesor') {
      // Para profesores: mostrar clases creadas y solicitudes confirmadas
      const clases = JSON.parse(localStorage.getItem('clases') || '[]');
      const clasesDelProfesor = clases.filter(c => c.profesorId === usuario.id && c.activa);
      
      clasesDelProfesor.forEach(clase => {
        clase.horarios.forEach(horario => {
          eventos.push({
            curso: clase.nombre,
            horarioSeleccionado: horario,
            tipo: 'clase-creada',
            claseId: clase.id
          });
        });
      });
      
      // Agregar solicitudes confirmadas del profesor
      const solicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]');
      const solicitudesConfirmadas = solicitudes.filter(s => 
        s.profesorId == usuario.id && s.estado === 'confirmado'
      );
      
      solicitudesConfirmadas.forEach(sol => {
        eventos.push({
          curso: sol.nombreClase,
          horarioSeleccionado: sol.horarioSeleccionado,
          tipo: 'turno-confirmado',
          estudiante: sol.nombreEstudiante,
          fechaConfirmacion: sol.fechaConfirmacion,
          claseId: sol.claseId
        });
      });
    } else {
      // Para alumnos: mostrar solicitudes confirmadas
      const solicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]');
      const solicitudesConfirmadas = solicitudes.filter(s => 
        s.estudianteId === usuario.id && s.estado === 'confirmado'
      );
      
      solicitudesConfirmadas.forEach(sol => {
        eventos.push({
          curso: sol.nombreClase,
          horarioSeleccionado: sol.horarioSeleccionado,
          tipo: 'turno-confirmado',
          fechaConfirmacion: sol.fechaConfirmacion,
          claseId: sol.claseId
        });
      });
    }
    
    setReservasDelMes(eventos);
  };

  const obtenerDiasDelMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasDelMes = [];

    // Días del mes anterior para completar la primera semana
    const primerDiaSemana = primerDia.getDay();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const dia = new Date(año, mes, -i);
      diasDelMes.push({ fecha: dia, esDelMesActual: false });
    }

    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(año, mes, dia);
      diasDelMes.push({ fecha, esDelMesActual: true });
    }

    // Días del mes siguiente para completar la última semana
    const diasRestantes = 42 - diasDelMes.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(año, mes + 1, dia);
      diasDelMes.push({ fecha, esDelMesActual: false });
    }

    return diasDelMes;
  };

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + direccion);
    setFechaActual(nuevaFecha);
  };

  const tieneReserva = (fecha) => {
    return reservasDelMes.some(evento => {
      if (evento.tipo === 'clase-creada') {
        const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        return evento.horarioSeleccionado.toLowerCase().includes(diaSemana.toLowerCase());
      } else if (evento.tipo === 'turno-confirmado') {
        const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        return evento.horarioSeleccionado.toLowerCase().includes(diaSemana.toLowerCase());
      }
      return false;
    });
  };

  const obtenerReservasDelDia = (fecha) => {
    const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    return reservasDelMes.filter(evento => {
      if (evento.tipo === 'clase-creada' || evento.tipo === 'turno-confirmado') {
        return evento.horarioSeleccionado.toLowerCase().includes(diaSemana.toLowerCase());
      }
      return false;
    });
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <h2>Calendario de Clases</h2>
        <p>Visualiza tus clases confirmadas</p>
      </div>

      <div className="calendario-navegacion">
        <button onClick={() => cambiarMes(-1)} className="nav-btn">
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3>{meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}</h3>
        <button onClick={() => cambiarMes(1)} className="nav-btn">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="calendario-grid">
        <div className="dias-semana">
          {diasSemana.map(dia => (
            <div key={dia} className="dia-semana">{dia}</div>
          ))}
        </div>

        <div className="dias-mes">
          {obtenerDiasDelMes().map((diaObj, index) => {
            const reservasDelDia = obtenerReservasDelDia(diaObj.fecha);
            const tieneClases = tieneReserva(diaObj.fecha);
            
            return (
              <div 
                key={index} 
                className={`dia ${!diaObj.esDelMesActual ? 'otro-mes' : ''} ${tieneClases ? 'con-clases' : ''}`}
              >
                <span className="numero-dia">{diaObj.fecha.getDate()}</span>
                {reservasDelDia.length > 0 && (
                  <div className="clases-del-dia">
                    {reservasDelDia.map((evento, idx) => (
                      <div 
                        key={idx} 
                        className={`clase-item ${evento.tipo === 'turno-confirmado' ? 'confirmado' : ''}`}
                        onClick={() => {
                          if (evento.claseId) {
                            window.location.href = `/muro-clase/${evento.claseId}`;
                          }
                        }}
                        style={{ cursor: evento.claseId ? 'pointer' : 'default' }}
                      >
                        <div className="clase-nombre">{evento.curso}</div>
                        <div className="clase-horario">{evento.horarioSeleccionado.split(' - ')[1] || evento.horarioSeleccionado}</div>
                        {evento.estudiante && <div className="clase-estudiante">👤 {evento.estudiante}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="leyenda">
        <div className="leyenda-item">
          <div className="punto-leyenda"></div>
          <span>Clases creadas</span>
        </div>
        <div className="leyenda-item">
          <div className="punto-leyenda confirmado"></div>
          <span>Turnos confirmados</span>
        </div>
      </div>
    </div>
  );
};

export default Calendario;