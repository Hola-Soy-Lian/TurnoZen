import React, { useState } from 'react'
import './SeccionPrincipal.css'

function SeccionPrincipal({ usuario, cursosCompletos = [], filtroActivo, setFiltroActivo, onReserva }) {
  const [modalReserva, setModalReserva] = useState({
    visible: false,
    curso: null,
    horarioSeleccionado: '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    comprobantePago: null
  })
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [expandedSchedules, setExpandedSchedules] = useState({})
  const [modalContent, setModalContent] = useState({ visible: false, type: '', content: '', title: '' })
  const [notification, setNotification] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false)
  const [filtros, setFiltros] = useState({
    precioMax: 1000000,
    precioInput: '',
    modalidad: '',
    calificacionMin: 0
  })
  const [favoritos, setFavoritos] = useState(() => {
    const favs = localStorage.getItem(`favoritos_${usuario?.id}`)
    return favs ? JSON.parse(favs) : []
  })

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 4000)
  }

  const handleReservar = (curso) => {
    setModalReserva({
      visible: true,
      curso,
      horarioSeleccionado: '',
      email: usuario?.email || '',
      telefono: usuario?.telefono || ''
    })
  }

  const confirmarReserva = () => {
    if (!modalReserva.horarioSeleccionado) {
      showNotification('Por favor selecciona un horario')
      return
    }

    if (!modalReserva.email || !modalReserva.telefono || !modalReserva.comprobantePago) {
      showNotification('Por favor completa todos los campos y sube el comprobante')
      return
    }

    const clases = JSON.parse(localStorage.getItem('clases') || '[]')
    const claseCompleta = clases.find(c => c.id === modalReserva.curso.id)
    
    const solicitudData = {
      id: Date.now().toString(),
      claseId: modalReserva.curso.id,
      estudianteId: usuario?.id,
      profesorId: claseCompleta?.profesorId || modalReserva.curso.profesorId,
      horarioSeleccionado: modalReserva.horarioSeleccionado,
      email: modalReserva.email,
      telefono: modalReserva.telefono,
      nombreClase: modalReserva.curso.categoria,
      nombreEstudiante: usuario?.nombre || usuario?.email,
      comprobantePago: modalReserva.comprobantePago.name,
      fechaSolicitud: new Date().toISOString(),
      estado: 'pendiente'
    }
    
    console.log('Solicitud creada:', solicitudData)

    // Guardar en localStorage
    const solicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]')
    solicitudes.push(solicitudData)
    localStorage.setItem('solicitudesClases', JSON.stringify(solicitudes))

    // Notificar al profesor (simulado)
    const notificacionesProfesor = JSON.parse(localStorage.getItem(`notificaciones_${solicitudData.profesorId}`) || '[]')
    notificacionesProfesor.push({
      id: Date.now().toString(),
      tipo: 'solicitud_clase',
      mensaje: `Nueva solicitud de ${solicitudData.nombreEstudiante} para ${solicitudData.nombreClase}`,
      solicitudId: solicitudData.id,
      fecha: new Date().toISOString(),
      leida: false
    })
    localStorage.setItem(`notificaciones_${solicitudData.profesorId}`, JSON.stringify(notificacionesProfesor))

    setModalReserva({ visible: false, curso: null, horarioSeleccionado: '', email: '', telefono: '', comprobantePago: null })
    showNotification('¡Solicitud enviada! El profesor revisará tu solicitud.')
    if (onReserva) onReserva(solicitudData)
  }
  
  const esFavorito = (claseId) => {
    return favoritos.includes(claseId)
  }
  
  const toggleFavorito = (claseId) => {
    let nuevosFavoritos
    if (esFavorito(claseId)) {
      nuevosFavoritos = favoritos.filter(id => id !== claseId)
      showNotification('Eliminado de favoritos')
    } else {
      nuevosFavoritos = [...favoritos, claseId]
      showNotification('Agregado a favoritos')
    }
    setFavoritos(nuevosFavoritos)
    localStorage.setItem(`favoritos_${usuario?.id}`, JSON.stringify(nuevosFavoritos))
  }

  return (
    <section id="inicio" className="seccionPrincipal">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>TurnoZen</h1>
            <h2>Tu Centro de Bienestar Integral</h2>
            <p>
              Descubre el equilibrio perfecto entre cuerpo y mente. Ofrecemos yoga, pilates, 
              meditación y más disciplinas para tu bienestar. Encuentra tu paz interior 
              y fortalece tu cuerpo en un ambiente profesional y relajado.
            </p>
          </div>
          <div className="hero-image">
            <img src="/images/img1.webp" alt="Centro de bienestar" />
          </div>
        </div>
      </div>

      <section className="courses-section">
        <div className="courses-header">
          <h2>Clases Disponibles</h2>
          
          <div className="search-and-filters">
            <div className="search-section">
              <button 
                className="advanced-search-btn"
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              >
                <i className="fas fa-sliders-h"></i> Filtros
              </button>
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="      Buscar clases, instructores..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            {mostrarFiltrosAvanzados && (
              <div className="advanced-filters">
                <div className="filter-group">
                  <label>Precio máximo:</label>
                  <div className="price-input-container">
                    <input
                      type="number"
                      placeholder="Ingresa precio"
                      value={filtros.precioInput}
                      onChange={(e) => {
                        const value = e.target.value
                        setFiltros({...filtros, precioInput: value, precioMax: value || 1000000})
                      }}
                      className="price-input"
                    />
                    <span className="price-display">${filtros.precioInput || 'Sin límite'}</span>
                  </div>
                </div>
                <div className="filter-group">
                  <label>Modalidad:</label>
                  <select
                    value={filtros.modalidad}
                    onChange={(e) => setFiltros({...filtros, modalidad: e.target.value})}
                  >
                    <option value="">Todas</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrida">Híbrida</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Calificación mínima:</label>
                  <select
                    value={filtros.calificacionMin}
                    onChange={(e) => setFiltros({...filtros, calificacionMin: e.target.value})}
                  >
                    <option value="0">Cualquiera</option>
                    <option value="3">3+ estrellas</option>
                    <option value="4">4+ estrellas</option>
                    <option value="5">5 estrellas</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="filters">
              <button 
                className={`filter-btn ${filtroActivo === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('todos')}
              >
                Todas
              </button>
              <button 
                className={`filter-btn ${filtroActivo === 'pilates' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('pilates')}
              >
                Pilates
              </button>
              <button 
                className={`filter-btn ${filtroActivo === 'yoga' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('yoga')}
              >
                Yoga
              </button>
              <button 
                className={`filter-btn ${filtroActivo === 'meditacion' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('meditacion')}
              >
                Meditación
              </button>
              <button 
                className={`filter-btn ${filtroActivo === 'stretching' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('stretching')}
              >
                Stretching
              </button>
            </div>
          </div>
        </div>
        
        {cursosCompletos.length > 0 && (
          <div className="courses-grid">
            {cursosCompletos
              .filter(curso => {
                // Filtro por tipo
                if (filtroActivo !== 'todos' && curso.tipo !== filtroActivo) return false
                
                // Filtro por búsqueda
                if (busqueda && !curso.categoria.toLowerCase().includes(busqueda.toLowerCase()) && 
                    !curso.profesor.toLowerCase().includes(busqueda.toLowerCase())) return false
                
                // Filtro por precio
                if (curso.precio > filtros.precioMax) return false
                
                // Filtro por modalidad
                if (filtros.modalidad && curso.modalidad !== filtros.modalidad) return false
                
                // Filtro por calificación
                if (curso.promedioCalificacion < filtros.calificacionMin) return false
                
                return true
              })
              .map(curso => (
              <div key={curso.id} className="course-card" data-tipo={curso.tipo}>
              <div className="course-header">
                <h3>{curso.categoria}</h3>
                <div className="course-badges">
                  {!curso.predefinido && (
                    <span className="nueva-clase-badge">¡Nueva!</span>
                  )}
                  {usuario?.tipoUsuario !== 'profesor' && (
                    <button 
                      className={`favorite-btn ${esFavorito(curso.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorito(curso.id)}
                    >
                      <i className={`fas fa-heart ${esFavorito(curso.id) ? 'filled' : ''}`}></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="instructor">
                <strong>Instructor: 
                  <button 
                    className="instructor-link"
                    onClick={() => {
                      const clases = JSON.parse(localStorage.getItem('clases') || '[]');
                      const clase = clases.find(c => c.id === curso.id);
                      if (clase && clase.profesorId) {
                        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                        const profesor = usuarios.find(u => u.id === clase.profesorId);
                        if (profesor) {
                          setModalContent({
                            visible: true,
                            type: 'perfil-completo',
                            content: profesor,
                            title: `Perfil de ${profesor.nombre}`
                          });
                        }
                      }
                    }}
                  >
                    {curso.profesor}
                  </button>
                </strong>
              </div>
              <div className="description-container">
                <p className={`description ${expandedDescriptions[curso.id] ? 'expanded' : 'collapsed'}`}>
                  {curso.descripcion}
                </p>
                {curso.descripcion.length > 120 && (
                  <button 
                    className="toggle-description"
                    onClick={() => setModalContent({
                      visible: true,
                      type: 'description',
                      content: curso.descripcion,
                      title: `Descripción - ${curso.categoria}`
                    })}
                  >
                    Ver más
                  </button>
                )}
              </div>
              {curso.cupoMaximo && (
                <div className="cupo-info">
                  <span><i className="fas fa-users"></i> Cupo máximo: {curso.cupoMaximo} personas</span>
                </div>
              )}
              <div className="course-details">
                <div className="price-info">
                  <span className="price">${curso.precio}</span>
                  <span className="price-label">por mes</span>
                </div>
                <div className="modality-info">
                  <i className={`fas ${curso.modalidad === 'virtual' ? 'fa-video' : curso.modalidad === 'hibrida' ? 'fa-globe' : 'fa-map-marker-alt'}`}></i>
                  <span>{curso.modalidad}</span>
                </div>
                {curso.ubicacion && (
                  <div className="location-info">
                    <i className="fas fa-location-dot"></i>
                    <span>{curso.ubicacion}</span>
                  </div>
                )}
              </div>
              <div className="schedule">
                <div className="schedule-header">
                  <button 
                    className="schedule-toggle"
                    onClick={() => setModalContent({
                      visible: true,
                      type: 'schedule',
                      content: curso.horarios,
                      title: `Horarios - ${curso.categoria}`
                    })}
                  >
                    <i className="fas fa-clock"></i>
                    Ver Horarios
                  </button>
                </div>
              </div>
              {curso.calificaciones && curso.calificaciones.length > 0 && (
                <div className="rating-info">
                  <div className="stars">
                    {[1,2,3,4,5].map(star => (
                      <i key={star} className={`fas fa-star ${star <= curso.promedioCalificacion ? 'filled' : ''}`}></i>
                    ))}
                  </div>
                  <span>({curso.calificaciones.length} reseñas)</span>
                </div>
              )}
              <button 
                className="reserve-btn"
                onClick={() => handleReservar(curso)}
              >
                Reservar Turno
              </button>
            </div>
              ))
            }
          </div>
        )}
        
        {cursosCompletos.length === 0 && (
          <div className="no-classes">
            <i className="fas fa-chalkboard-teacher"></i>
            <p>No hay clases disponibles aún</p>
            <p>Los profesores pueden crear clases desde "Gestión"</p>
          </div>
        )}
      </section>

      {modalReserva.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reservar: {modalReserva.curso?.categoria}</h3>
            <p><strong>Instructor:</strong> {modalReserva.curso?.profesor}</p>
            
            <div className="form-group">
              <label>Selecciona un horario:</label>
              <select 
                value={modalReserva.horarioSeleccionado}
                onChange={(e) => setModalReserva({...modalReserva, horarioSeleccionado: e.target.value})}
              >
                <option value="">Selecciona un horario</option>
                {modalReserva.curso?.horarios.map((horario, index) => (
                  <option key={index} value={horario}>{horario}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email"
                value={modalReserva.email}
                onChange={(e) => setModalReserva({...modalReserva, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Teléfono:</label>
              <input 
                type="tel"
                value={modalReserva.telefono}
                onChange={(e) => setModalReserva({...modalReserva, telefono: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Comprobante de Pago:</label>
              <input 
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setModalReserva({...modalReserva, comprobantePago: e.target.files[0]})}
                className="file-input"
              />
              {modalReserva.comprobantePago && (
                <span className="file-selected">
                  <i className="fas fa-check"></i> {modalReserva.comprobantePago.name}
                </span>
              )}
            </div>
            
            <div className="reservation-summary">
              <div className="summary-item">
                <span>Precio:</span>
                <span className="price-highlight">${modalReserva.curso?.precio}</span>
              </div>
              <div className="summary-item">
                <span>Modalidad:</span>
                <span>{modalReserva.curso?.modalidad}</span>
              </div>
              {modalReserva.curso?.ubicacion && (
                <div className="summary-item">
                  <span>Ubicación:</span>
                  <span>{modalReserva.curso?.ubicacion}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={confirmarReserva} className="confirm-btn">Confirmar Reserva</button>
              <button 
                onClick={() => setModalReserva({visible: false, curso: null, horarioSeleccionado: '', email: '', telefono: '', comprobantePago: null})}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalContent.visible && (
        <div className="content-modal-overlay" onClick={() => setModalContent({ visible: false, type: '', content: '', title: '' })}>
          {modalContent.type === 'perfil-completo' ? (
            <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="cerrar-modal"
                onClick={() => setModalContent({ visible: false, type: '', content: '', title: '' })}
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="perfil-layout">
                {modalContent.content.perfil?.perfilPublico !== false ? (
                  <>
                    <div 
                      className="perfil-izquierda"
                      style={modalContent.content.perfil?.imagenFondo ? {
                        backgroundImage: `url(${modalContent.content.perfil.imagenFondo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      <div className="avatar-grande">
                        {modalContent.content.perfil?.avatar ? (
                          <img src={modalContent.content.perfil.avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          modalContent.content.nombre.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="perfil-info">
                        <h3>{modalContent.content.nombre}</h3>
                        {modalContent.content.perfil?.mostrarEmail !== false && (
                          <p>{modalContent.content.email}</p>
                        )}
                        <span className={`tipo-badge ${modalContent.content.tipoUsuario}`}>
                          {modalContent.content.tipoUsuario}
                        </span>
                      </div>
                      <div className="perfil-detalles">
                        {modalContent.content.telefono && modalContent.content.perfil?.mostrarTelefono !== false && (
                          <div className="detalle-item">
                            <i className="fas fa-phone"></i>
                            <span>{modalContent.content.telefono}</span>
                          </div>
                        )}
                        {modalContent.content.perfil?.bio && (
                          <div className="detalle-item">
                            <i className="fas fa-info-circle"></i>
                            <span>{modalContent.content.perfil.bio}</span>
                          </div>
                        )}
                        <div className="detalle-item">
                          <i className="fas fa-calendar"></i>
                          <span>Registrado: {new Date(modalContent.content.perfil?.fechaRegistro || Date.now()).toLocaleDateString()}</span>
                        </div>

                      </div>
                    </div>
                    <div 
                      className="perfil-derecha"
                      style={modalContent.content.perfil?.imagenFondoDerecha ? {
                        backgroundImage: `url(${modalContent.content.perfil.imagenFondoDerecha})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      <h4>Clases</h4>
                      <div className="clases-lista">
                        {(() => {
                          const clases = JSON.parse(localStorage.getItem('clases') || '[]')
                          const clasesProfesor = clases.filter(c => c.profesorId === modalContent.content.id)
                          return clasesProfesor.length > 0 ? (
                            clasesProfesor.map(clase => (
                              <div key={clase.id} className="clase-item">
                                <i className="fas fa-chalkboard-teacher"></i>
                                <span>{clase.nombre}</span>
                              </div>
                            ))
                          ) : <p>No tiene clases creadas</p>
                        })()} 
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="perfil-izquierda perfil-privado-preview">
                    <div className="privado-content">
                      <i className="fas fa-lock"></i>
                      <h3>Perfil Privado</h3>
                      <p>Este usuario ha configurado su perfil como privado</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="content-modal" onClick={(e) => e.stopPropagation()}>
              <div className="content-modal-header">
                <h3>{modalContent.title}</h3>
                <button 
                  className="close-modal-btn"
                  onClick={() => setModalContent({ visible: false, type: '', content: '', title: '' })}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="content-modal-body">
                {modalContent.type === 'description' ? (
                  <p>{modalContent.content}</p>
                ) : (
                  <ul className="modal-schedule-list">
                    {modalContent.content.map((horario, index) => (
                      <li key={index}>{horario}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </section>
  )
}

export default SeccionPrincipal