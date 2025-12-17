import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useNotification } from '../hooks/useNotification.js'
import './PaginaMuroClase.css'

function PaginaMuroClase() {
  const { usuario } = useAuth()
  const [claseSeleccionada, setClaseSeleccionada] = useState(null)
  const [solicitudes, setSolicitudes] = useState([])
  const [turnosConfirmados, setTurnosConfirmados] = useState([])
  const [posts, setPosts] = useState([])
  const [nuevoPost, setNuevoPost] = useState('')
  const [imagenPost, setImagenPost] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [editConfig, setEditConfig] = useState({ nombre: '', banner: '', fondo: '', permisos: 'todos' })
  const [showMembers, setShowMembers] = useState(false)
  const [searchMembers, setSearchMembers] = useState('')
  const [showPostMenu, setShowPostMenu] = useState(null)
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { notification, showNotification } = useNotification()

  useEffect(() => {
    const claseId = window.location.pathname.split('/').pop()
    if (claseId) {
      const clases = JSON.parse(localStorage.getItem('clases') || '[]')
      const clase = clases.find(c => c.id === parseInt(claseId))
      if (clase) {
        setClaseSeleccionada(clase)
        cargarDatosClase(clase)
        cargarPosts(clase.id)
      }
    }
  }, [])

  const cargarDatosClase = (clase) => {
    const todasSolicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]')
    const solicitudesClase = todasSolicitudes.filter(s => 
      s.claseId === clase.id && s.estado === 'pendiente'
    )
    const turnosClase = todasSolicitudes.filter(s => 
      s.claseId === clase.id && s.estado === 'confirmado'
    )
    
    setSolicitudes(solicitudesClase)
    setTurnosConfirmados(turnosClase)
  }

  const cargarPosts = (claseId) => {
    const postsGuardados = JSON.parse(localStorage.getItem(`posts_${claseId}`) || '[]')
    setPosts(postsGuardados)
  }

  const manejarSolicitud = (solicitudId, accion) => {
    const todasSolicitudes = JSON.parse(localStorage.getItem('solicitudesClases') || '[]')
    const solicitudIndex = todasSolicitudes.findIndex(s => s.id === solicitudId)
    
    if (solicitudIndex !== -1) {
      if (accion === 'aceptar') {
        todasSolicitudes[solicitudIndex].estado = 'confirmado'
        todasSolicitudes[solicitudIndex].fechaConfirmacion = new Date().toISOString()
        showNotification('Solicitud aceptada')
      } else {
        todasSolicitudes[solicitudIndex].estado = 'rechazado'
        showNotification('Solicitud rechazada')
      }
      
      localStorage.setItem('solicitudesClases', JSON.stringify(todasSolicitudes))
      cargarDatosClase(claseSeleccionada)
    }
  }

  const publicarPost = () => {
    if (!nuevoPost.trim() && !imagenPost) {
      showNotification('Escribe algo o agrega una imagen')
      return
    }
    
    const post = {
      id: Date.now(),
      autor: usuario.nombre,
      autorId: usuario.id,
      contenido: nuevoPost,
      imagen: imagenPost,
      fecha: new Date().toISOString(),
      tipo: 'profesor'
    }
    
    const nuevosPost = [post, ...posts]
    setPosts(nuevosPost)
    localStorage.setItem(`posts_${claseSeleccionada.id}`, JSON.stringify(nuevosPost))
    setNuevoPost('')
    setImagenPost(null)
    showNotification('Publicación creada')
  }

  const eliminarPost = (postId) => {
    const nuevosPost = posts.filter(p => p.id !== postId)
    setPosts(nuevosPost)
    localStorage.setItem(`posts_${claseSeleccionada.id}`, JSON.stringify(nuevosPost))
    showNotification('Publicación eliminada')
    setConfirmDelete(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagenPost(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setImagenPost(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const guardarConfig = () => {
    const clases = JSON.parse(localStorage.getItem('clases') || '[]')
    const claseIndex = clases.findIndex(c => c.id === claseSeleccionada.id)
    if (claseIndex !== -1) {
      clases[claseIndex].nombre = editConfig.nombre || claseSeleccionada.nombre
      clases[claseIndex].banner = editConfig.banner
      clases[claseIndex].fondo = editConfig.fondo
      clases[claseIndex].permisos = editConfig.permisos
      localStorage.setItem('clases', JSON.stringify(clases))
      setClaseSeleccionada({...claseSeleccionada, ...editConfig})
      setShowConfig(false)
      showNotification('Configuración guardada')
    }
  }

  const obtenerMiembros = () => {
    if (!claseSeleccionada) return []
    const miembros = [...solicitudes, ...turnosConfirmados]
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const miembrosUsuarios = miembros.map(m => usuarios.find(u => u.id === m.alumnoId)).filter(Boolean)
    const profesor = usuarios.find(u => u.id === claseSeleccionada.profesorId)
    return profesor ? [profesor, ...miembrosUsuarios] : miembrosUsuarios
  }

  const miembrosFiltrados = obtenerMiembros().filter(m => 
    m.nombre.toLowerCase().includes(searchMembers.toLowerCase())
  )

  if (!claseSeleccionada) {
    return (
      <div className="muro-container">
        <div className="no-clase">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Clase no encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        className="muro-banner" 
        style={claseSeleccionada.banner ? {
          backgroundImage: `linear-gradient(rgba(5, 66, 77, 0.7), rgba(54, 168, 202, 0.7)), url(${claseSeleccionada.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <h1>{claseSeleccionada.nombre}</h1>
        <div className="banner-actions">
          <button className="members-btn" onClick={() => setShowMembers(true)}>
            <i className="fas fa-users"></i>
          </button>
          {usuario.id === claseSeleccionada.profesorId && (
            <button className="config-btn" onClick={() => {
              setEditConfig({
                nombre: claseSeleccionada.nombre, 
                banner: claseSeleccionada.banner || '',
                fondo: claseSeleccionada.fondo || '',
                permisos: claseSeleccionada.permisos || 'todos'
              })
              setShowConfig(true)
            }}>
              <i className="fas fa-cog"></i>
            </button>
          )}
        </div>
      </div>
      
      <div className="muro-layout">
        <div className="sidebar">
          <div className="solicitudes-section">
            <h3>Solicitudes Pendientes ({solicitudes.length})</h3>
            {solicitudes.map(solicitud => (
              <div key={solicitud.id} className="solicitud-item">
                <div className="solicitud-info">
                  <strong>{solicitud.nombreEstudiante}</strong>
                  <span>{solicitud.horarioSeleccionado}</span>
                </div>
                <div className="solicitud-acciones">
                  <button 
                    className="aceptar-btn"
                    onClick={() => manejarSolicitud(solicitud.id, 'aceptar')}
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button 
                    className="rechazar-btn"
                    onClick={() => manejarSolicitud(solicitud.id, 'rechazar')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="miembros-section">
            <h3>Últimos Miembros ({turnosConfirmados.length})</h3>
            {turnosConfirmados.slice(-5).map(turno => (
              <div key={turno.id} className="miembro-item">
                <div className="miembro-avatar">
                  {(() => {
                    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
                    const usuario = usuarios.find(u => u.id === turno.estudianteId)
                    const avatar = usuario?.perfil?.avatar
                    return avatar ? (
                      <img src={avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      turno.nombreEstudiante.charAt(0).toUpperCase()
                    )
                  })()} 
                </div>
                <div className="miembro-info">
                  <strong>{turno.nombreEstudiante}</strong>
                  <span className="bienvenido">Bienvenido</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          className="main-content"
          style={claseSeleccionada.fondo ? {
            backgroundImage: `url(${claseSeleccionada.fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          } : {}}
        >
          <div 
            className="nuevo-post"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <textarea
              value={nuevoPost}
              onChange={(e) => setNuevoPost(e.target.value)}
              placeholder="Escribe un anuncio para la clase..."
              rows="3"
            />
            <div className="post-actions">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{display: 'none'}}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-btn">
                <i className="fas fa-image"></i> Imagen
              </label>
              <button 
                onClick={publicarPost} 
                className="publicar-btn"
                disabled={!nuevoPost.trim() && !imagenPost}
              >
                <i className="fas fa-paper-plane"></i> Publicar
              </button>
            </div>
            {imagenPost && (
              <div className="preview-image">
                <img src={imagenPost} alt="Preview" />
                <button onClick={() => setImagenPost(null)} className="remove-image">×</button>
              </div>
            )}
          </div>
          
          <div className="posts-lista">
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">
                      {(() => {
                        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
                        const autor = usuarios.find(u => u.id === post.autorId)
                        const avatar = autor?.perfil?.avatar
                        return avatar ? (
                          <img src={avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          post.autor.charAt(0).toUpperCase()
                        )
                      })()} 
                    </div>
                    <strong>{post.autor}</strong>
                  </div>
                  <div className="post-actions-header">
                    <span className="post-fecha">
                      {new Date(post.fecha).toLocaleDateString()}
                    </span>
                    <div className="post-menu">
                      <button 
                        className="menu-btn" 
                        onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      {showPostMenu === post.id && (
                        <div className="menu-dropdown">
                          <button onClick={() => {
                            setConfirmDelete(post.id)
                            setShowPostMenu(null)
                          }}>
                            <i className="fas fa-trash"></i> Eliminar
                          </button>
                          <button onClick={() => {
                            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
                            const autor = usuarios.find(u => u.id === post.autorId)
                            if (autor) {
                              setPerfilSeleccionado(autor)
                              setShowPostMenu(null)
                            }
                          }}>
                            <i className="fas fa-user"></i> Ver Perfil
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p>{post.contenido}</p>
                {post.imagen && <img src={post.imagen} alt="Post" className="post-image" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showMembers && (
        <div className="members-modal" onClick={() => setShowMembers(false)}>
          <div className="members-content" onClick={(e) => e.stopPropagation()}>
            <div className="members-header">
              <h3>Miembros del Muro</h3>
              <button className="close-btn" onClick={() => setShowMembers(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar miembros..."
                value={searchMembers}
                onChange={(e) => setSearchMembers(e.target.value)}
              />
            </div>
            <div className="members-list">
              {miembrosFiltrados.map(miembro => (
                <div key={miembro.id} className="member-item">
                  <div className="member-avatar">
                    {miembro.perfil?.avatar ? (
                      <img src={miembro.perfil.avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      miembro.nombre.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="member-info">
                    <strong>{miembro.nombre}</strong>
                    <span>{miembro.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {showConfig && (
        <div className="config-modal" onClick={() => setShowConfig(false)}>
          <div className="config-content" onClick={(e) => e.stopPropagation()}>
            <h3>Configurar Muro</h3>
            <div className="form-group">
              <label>Nombre del Muro</label>
              <input
                type="text"
                value={editConfig.nombre}
                onChange={(e) => setEditConfig({...editConfig, nombre: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>URL del Banner</label>
              <input
                type="url"
                value={editConfig.banner}
                onChange={(e) => setEditConfig({...editConfig, banner: e.target.value})}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="form-group">
              <label>Imagen de Fondo</label>
              <input
                type="url"
                value={editConfig.fondo}
                onChange={(e) => setEditConfig({...editConfig, fondo: e.target.value})}
                placeholder="https://ejemplo.com/fondo.jpg"
              />
            </div>
            <div className="form-group">
              <label>Quién puede publicar</label>
              <select
                value={editConfig.permisos}
                onChange={(e) => setEditConfig({...editConfig, permisos: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="solo-profesor">Solo Profesor</option>
              </select>
            </div>
            <div className="config-actions">
              <button onClick={guardarConfig} className="save-btn">Guardar</button>
              <button onClick={() => setShowConfig(false)} className="cancel-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
      {confirmDelete && (
        <div className="confirm-modal" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-content" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminar Publicación</h3>
            <p>¿Estás seguro de que quieres eliminar esta publicación?</p>
            <div className="confirm-actions">
              <button className="confirm-delete" onClick={() => eliminarPost(confirmDelete)}>
                Eliminar
              </button>
              <button className="cancel-delete" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      {perfilSeleccionado && (
        <div className="modal-overlay" onClick={() => setPerfilSeleccionado(null)}>
          <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-layout">
              <div 
                className="perfil-izquierda"
                style={{
                  backgroundImage: perfilSeleccionado.perfil?.imagenFondo ? `url(${perfilSeleccionado.perfil.imagenFondo})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="avatar-grande">
                  {perfilSeleccionado.perfil?.avatar ? (
                    <img src={perfilSeleccionado.perfil.avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                  ) : (
                    perfilSeleccionado.nombre.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="perfil-info">
                  <h3>{perfilSeleccionado.nombre}</h3>
                  <p>{perfilSeleccionado.email}</p>
                  <span className={`tipo-badge ${perfilSeleccionado.tipoUsuario}`}>
                    {perfilSeleccionado.tipoUsuario}
                  </span>
                </div>
                <div className="perfil-detalles">
                  {perfilSeleccionado.telefono && (
                    <div className="detalle-item">
                      <i className="fas fa-phone"></i>
                      <span>{perfilSeleccionado.telefono}</span>
                    </div>
                  )}
                  {perfilSeleccionado.perfil?.bio && (
                    <div className="detalle-item">
                      <i className="fas fa-info-circle"></i>
                      <span>{perfilSeleccionado.perfil.bio}</span>
                    </div>
                  )}
                  <div className="detalle-item">
                    <i className="fas fa-calendar"></i>
                    <span>Registrado: {new Date(perfilSeleccionado.perfil?.fechaRegistro || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div 
                className="perfil-derecha"
                style={{
                  backgroundImage: perfilSeleccionado.perfil?.imagenFondoDerecha ? `url(${perfilSeleccionado.perfil.imagenFondoDerecha})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <h4>Clases</h4>
                <div className="clases-lista">
                  {(() => {
                    if (perfilSeleccionado.tipoUsuario === 'profesor') {
                      const clases = JSON.parse(localStorage.getItem('clases') || '[]')
                      const clasesProfesor = clases.filter(c => c.profesorId === perfilSeleccionado.id)
                      return clasesProfesor.length > 0 ? (
                        clasesProfesor.map(clase => (
                          <div key={clase.id} className="clase-item">
                            <i className="fas fa-chalkboard-teacher"></i>
                            <span>{clase.nombre}</span>
                          </div>
                        ))
                      ) : <p>No tiene clases creadas</p>
                    } else {
                      const reservas = perfilSeleccionado.reservas || []
                      const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmado')
                      return reservasConfirmadas.length > 0 ? (
                        reservasConfirmadas.map(reserva => (
                          <div key={reserva.id} className="clase-item">
                            <i className="fas fa-graduation-cap"></i>
                            <span>{reserva.curso}</span>
                          </div>
                        ))
                      ) : <p>No está inscrito en clases</p>
                    }
                  })()} 
                </div>
              </div>
            </div>
            <button className="cerrar-modal" onClick={() => setPerfilSeleccionado(null)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PaginaMuroClase