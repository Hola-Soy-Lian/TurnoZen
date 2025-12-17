import './SeccionTurnos.css'

function SeccionTurnos() {
  return (
    <section id="turnos" className="seccionTurnos">
      <div className="contenedorTurnos">
        <h2 className="tituloSeccion">Gestión de Turnos</h2>
        <p className="descripcionSeccion">Organiza y administra todos tus turnos de manera eficiente</p>
        
        <div className="tarjetasTurnos">
          <div className="tarjetaTurno">
            <div className="iconoTurno">📅</div>
            <h3>Programar Turno</h3>
            <p>Crea nuevos turnos con fecha, hora y detalles específicos</p>
            <button className="botonTarjeta">Programar</button>
          </div>
          
          <div className="tarjetaTurno">
            <div className="iconoTurno">📋</div>
            <h3>Ver Turnos</h3>
            <p>Consulta todos tus turnos programados y su estado actual</p>
            <button className="botonTarjeta">Ver Lista</button>
          </div>
          
          <div className="tarjetaTurno">
            <div className="iconoTurno">✏️</div>
            <h3>Modificar Turno</h3>
            <p>Edita o cancela turnos existentes según tus necesidades</p>
            <button className="botonTarjeta">Modificar</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SeccionTurnos