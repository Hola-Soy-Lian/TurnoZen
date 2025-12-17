import './SeccionActividades.css'

function SeccionActividades() {
  return (
    <section id="actividades" className="seccionActividades">
      <div className="contenedorActividades">
        <h2 className="tituloSeccion">Actividades Recientes</h2>
        <p className="descripcionSeccion">Mantente al día con todas las actividades y notificaciones</p>
        
        <div className="listaActividades">
          <div className="itemActividad">
            <div className="iconoActividad">🆕</div>
            <div className="detalleActividad">
              <h4>Nuevo turno programado</h4>
              <p>Turno para consulta médica - 15 de Enero, 10:00 AM</p>
              <span className="tiempoActividad">Hace 2 horas</span>
            </div>
          </div>
          
          <div className="itemActividad">
            <div className="iconoActividad">✅</div>
            <div className="detalleActividad">
              <h4>Turno completado</h4>
              <p>Sesión de fisioterapia finalizada exitosamente</p>
              <span className="tiempoActividad">Hace 1 día</span>
            </div>
          </div>
          
          <div className="itemActividad">
            <div className="iconoActividad">⏰</div>
            <div className="detalleActividad">
              <h4>Recordatorio enviado</h4>
              <p>Recordatorio para turno de mañana a las 9:00 AM</p>
              <span className="tiempoActividad">Hace 2 días</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SeccionActividades