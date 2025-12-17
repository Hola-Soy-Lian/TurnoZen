import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="contenedorFooter">
        <div className="seccionesFooter">
          <div className="seccionFooter">
            <h3>TurnoZen</h3>
            <p>Simplificando la gestión de turnos para profesionales y pacientes.</p>
          </div>
          
          <div className="seccionFooter">
            <h4>Enlaces rápidos</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/turnos">Turnos</Link></li>
              <li><Link to="/actividades">Actividades</Link></li>
              <li><Link to="/usuario">Usuario</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pieFooter">
          <p>&copy; 2025 TurnoZen. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer