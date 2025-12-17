import './SeccionUsuario.css'

function SeccionUsuario() {
  return (
    <section id="usuarios" className="seccionUsuario">
      <div className="contenedorUsuario">
        <h2 className="tituloSeccion">Perfil de Usuario</h2>
        <p className="descripcionSeccion">Gestiona tu información personal y preferencias</p>
        
        <div className="contenidoUsuario">
          <div className="perfilUsuario">
            <div className="avatarUsuario">👤</div>
            <div className="infoUsuario">
              <h3>Juan Pérez</h3>
              <p className="emailUsuario">juan.perez@email.com</p>
              <p className="rolUsuario">Usuario Premium</p>
              <button className="botonEditarPerfil">Editar perfil</button>
            </div>
          </div>
          
          <div className="estadisticasUsuario">
            <h3>Tus estadísticas</h3>
            <div className="gridEstadisticas">
              <div className="estatUsuario">
                <span className="numeroEstat">47</span>
                <span className="textoEstat">Turnos totales</span>
              </div>
              <div className="estatUsuario">
                <span className="numeroEstat">12</span>
                <span className="textoEstat">Este mes</span>
              </div>
              <div className="estatUsuario">
                <span className="numeroEstat">95%</span>
                <span className="textoEstat">Asistencia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SeccionUsuario