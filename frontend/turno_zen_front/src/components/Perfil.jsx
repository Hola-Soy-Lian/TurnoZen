import React, { useState } from 'react';
import './Perfil.css';

const Perfil = ({ usuario, onActualizar }) => {
  const [editando, setEditando] = useState(false);
  const [perfilData, setPerfilData] = useState({
    nombre: usuario?.nombre || '',
    telefono: usuario?.telefono || '',
    bio: usuario?.perfil?.bio || '',
    imagenFondo: usuario?.perfil?.imagenFondo || '',
    imagenFondoDerecha: usuario?.perfil?.imagenFondoDerecha || '',
    notificaciones: usuario?.perfil?.notificaciones !== undefined ? usuario.perfil.notificaciones : true,
    perfilPublico: usuario?.perfil?.perfilPublico !== undefined ? usuario.perfil.perfilPublico : true,
    mostrarEmail: usuario?.perfil?.mostrarEmail !== undefined ? usuario.perfil.mostrarEmail : true,
    mostrarTelefono: usuario?.perfil?.mostrarTelefono !== undefined ? usuario.perfil.mostrarTelefono : true,
    permitirContacto: usuario?.perfil?.permitirContacto !== undefined ? usuario.perfil.permitirContacto : true
  });
  
  React.useEffect(() => {
    setPerfilData({
      nombre: usuario?.nombre || '',
      telefono: usuario?.telefono || '',
      bio: usuario?.perfil?.bio || '',
      imagenFondo: usuario?.perfil?.imagenFondo || '',
      imagenFondoDerecha: usuario?.perfil?.imagenFondoDerecha || '',
      notificaciones: usuario?.perfil?.notificaciones !== undefined ? usuario.perfil.notificaciones : true,
      perfilPublico: usuario?.perfil?.perfilPublico !== undefined ? usuario.perfil.perfilPublico : true,
      mostrarEmail: usuario?.perfil?.mostrarEmail !== undefined ? usuario.perfil.mostrarEmail : true,
      mostrarTelefono: usuario?.perfil?.mostrarTelefono !== undefined ? usuario.perfil.mostrarTelefono : true,
      permitirContacto: usuario?.perfil?.permitirContacto !== undefined ? usuario.perfil.permitirContacto : true
    });
  }, [usuario]);
  const [notification, setNotification] = useState('');
  const [mostrarModalFoto, setMostrarModalFoto] = useState(false);
  const [urlImagen, setUrlImagen] = useState('');
  const [fotoUsuario, setFotoUsuario] = useState(usuario?.perfil?.avatar || '');
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  if (!usuario) {
    return (
      <div className="perfil-container">
        <div className="error-message">
          <p>Error: No se pudo cargar el perfil del usuario</p>
        </div>
      </div>
    );
  }

  const handleGuardar = () => {
    if (!perfilData.nombre.trim()) {
      showNotification('El nombre es obligatorio');
      return;
    }

    const usuarioActualizado = {
      ...usuario,
      nombre: perfilData.nombre,
      telefono: perfilData.telefono,
      perfil: {
        avatar: usuario?.perfil?.avatar || '',
        fechaRegistro: usuario?.perfil?.fechaRegistro || new Date().toISOString(),
        bio: perfilData.bio,
        imagenFondo: perfilData.imagenFondo,
        imagenFondoDerecha: perfilData.imagenFondoDerecha,
        notificaciones: perfilData.notificaciones,
        perfilPublico: perfilData.perfilPublico,
        mostrarEmail: perfilData.mostrarEmail,
        mostrarTelefono: perfilData.mostrarTelefono,
        permitirContacto: perfilData.permitirContacto
      }
    };
    
    if (typeof onActualizar === 'function') {
      onActualizar(usuarioActualizado);
      
      // Actualizar localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex] = usuarioActualizado;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
      
      setEditando(false);
      showNotification('Perfil actualizado exitosamente');
    } else {
      showNotification('Error: No se pudo guardar el perfil');
    }
  };

  const getTipoUsuarioColor = (tipo) => {
    switch(tipo) {
      case 'profesor': return '#e74c3c';
      case 'alumno': return '#3498db';
      default: return '#3498db';
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="avatar-section">
          <div className="avatar-container">
            <div className="avatar">
              {fotoUsuario ? (
                <img src={fotoUsuario} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
              ) : (
                usuario.nombre.charAt(0).toUpperCase()
              )}
            </div>
            <button 
              className="change-photo-btn"
              onClick={() => setMostrarModalFoto(true)}
            >
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <div className="usuario-info">
            <h2>{usuario.nombre}</h2>
            <span 
              className="tipo-badge" 
              style={{ backgroundColor: getTipoUsuarioColor(usuario.tipoUsuario) }}
            >
              {usuario.tipoUsuario === 'alumno' ? 'Usuario' : 'Profesor'}
            </span>
          </div>
        </div>
        
        <div className="perfil-buttons">
          <button 
            className="preview-btn"
            onClick={() => {
              const perfilConConfiguracion = {
                ...usuario,
                perfil: {
                  ...usuario.perfil,
                  perfilPublico: perfilData.perfilPublico,
                  mostrarEmail: perfilData.mostrarEmail,
                  mostrarTelefono: perfilData.mostrarTelefono,
                  permitirContacto: perfilData.permitirContacto,
                  bio: perfilData.bio
                },
                nombre: perfilData.nombre,
                telefono: perfilData.telefono
              };
              setPerfilSeleccionado(perfilConConfiguracion);
            }}
          >
            Vista Previa
          </button>
          <button 
            className="edit-btn"
            onClick={() => setEditando(!editando)}
          >
            {editando ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>
      </div>

      <div className="perfil-content">
        {editando ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={perfilData.nombre}
                onChange={(e) => setPerfilData({...perfilData, nombre: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={perfilData.telefono}
                onChange={(e) => setPerfilData({...perfilData, telefono: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Biografía</label>
              <textarea
                value={perfilData.bio}
                onChange={(e) => setPerfilData({...perfilData, bio: e.target.value})}
                placeholder="Cuéntanos sobre ti..."
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label>Imagen de fondo izquierda</label>
              <input
                type="url"
                value={perfilData.imagenFondo || ''}
                onChange={(e) => setPerfilData({...perfilData, imagenFondo: e.target.value})}
                placeholder="URL de imagen de fondo izquierda"
              />
            </div>
            
            <div className="form-group">
              <label>Imagen de fondo derecha</label>
              <input
                type="url"
                value={perfilData.imagenFondoDerecha || ''}
                onChange={(e) => setPerfilData({...perfilData, imagenFondoDerecha: e.target.value})}
                placeholder="URL de imagen de fondo derecha"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={perfilData.notificaciones}
                  onChange={(e) => setPerfilData({...perfilData, notificaciones: e.target.checked})}
                />
                Recibir notificaciones
              </label>
            </div>
            
            <div className="privacy-section">
              <h4>Configuración de Privacidad</h4>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={perfilData.perfilPublico !== false}
                    onChange={(e) => setPerfilData({...perfilData, perfilPublico: e.target.checked})}
                  />
                  Perfil público (otros usuarios pueden ver tu perfil)
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={perfilData.mostrarEmail !== false}
                    onChange={(e) => setPerfilData({...perfilData, mostrarEmail: e.target.checked})}
                  />
                  Mostrar email en perfil público
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={perfilData.mostrarTelefono !== false}
                    onChange={(e) => setPerfilData({...perfilData, mostrarTelefono: e.target.checked})}
                  />
                  Mostrar teléfono en perfil público
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={perfilData.permitirContacto !== false}
                    onChange={(e) => setPerfilData({...perfilData, permitirContacto: e.target.checked})}
                  />
                  Permitir que otros usuarios me contacten
                </label>
              </div>
            </div>
            
            <button className="save-btn" onClick={handleGuardar}>
              Guardar Cambios
            </button>
          </div>
        ) : (
          <div className="perfil-info">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{usuario.email}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Teléfono:</span>
              <span className="value">{usuario.telefono || 'No especificado'}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Tipo de usuario:</span>
              <span className="value">
                {usuario.tipoUsuario ? usuario.tipoUsuario.charAt(0).toUpperCase() + usuario.tipoUsuario.slice(1) : 'No especificado'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="label">Fecha de registro:</span>
              <span className="value">
                {new Date(usuario.perfil?.fechaRegistro || Date.now()).toLocaleDateString()}
              </span>
            </div>
            
            <div className="info-item">
              <span className="label">Biografía:</span>
              <span className="value">
                {usuario.perfil?.bio || 'Sin biografía'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="label">Notificaciones:</span>
              <span className="value">
                {usuario.perfil?.notificaciones ? 'Activadas' : 'Desactivadas'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      {mostrarModalFoto && (
        <div className="modal-overlay" onClick={() => setMostrarModalFoto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar Foto de Perfil</h3>
            <div className="foto-opciones">
              <button 
                className="opcion-btn"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const nuevaFoto = event.target.result;
                        setFotoUsuario(nuevaFoto);
                        const usuarioActualizado = {
                          ...usuario,
                          perfil: {
                            ...usuario.perfil,
                            avatar: nuevaFoto
                          }
                        };
                        onActualizar(usuarioActualizado);
                        showNotification('Foto subida desde dispositivo');
                        setMostrarModalFoto(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <i className="fas fa-upload"></i>
                Subir desde dispositivo
              </button>
              
              <div className="url-section">
                <input
                  type="url"
                  placeholder="Pegar URL de imagen"
                  value={urlImagen}
                  onChange={(e) => setUrlImagen(e.target.value)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
                    if (url) {
                      setUrlImagen(url);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                />
                <button 
                  className="opcion-btn"
                  onClick={() => {
                    if (urlImagen.trim()) {
                      setFotoUsuario(urlImagen);
                      const usuarioActualizado = {
                        ...usuario,
                        perfil: {
                          ...usuario.perfil,
                          avatar: urlImagen
                        }
                      };
                      onActualizar(usuarioActualizado);
                      showNotification('Foto actualizada desde URL');
                      setMostrarModalFoto(false);
                      setUrlImagen('');
                    }
                  }}
                >
                  <i className="fas fa-link"></i>
                  Usar URL
                </button>
              </div>
            </div>
            <button className="cerrar-modal" onClick={() => setMostrarModalFoto(false)}>×</button>
          </div>
        </div>
      )}
      
      {perfilSeleccionado && (
        <div className="modal-overlay" onClick={() => setPerfilSeleccionado(null)}>
          <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-layout">
              {perfilSeleccionado.perfil?.perfilPublico !== false ? (
                <div 
                  className="perfil-izquierda"
                  style={perfilSeleccionado.perfil?.imagenFondo ? {
                    backgroundImage: `url(${perfilSeleccionado.perfil.imagenFondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
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
                    {perfilSeleccionado.perfil?.mostrarEmail !== false && (
                      <p>{perfilSeleccionado.email}</p>
                    )}
                    <span className={`tipo-badge ${perfilSeleccionado.tipoUsuario}`}>
                      {perfilSeleccionado.tipoUsuario}
                    </span>
                  </div>
                  <div className="perfil-detalles">
                    {perfilSeleccionado.telefono && perfilSeleccionado.perfil?.mostrarTelefono !== false && (
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
                    {perfilSeleccionado.perfil?.permitirContacto !== false && perfilSeleccionado.id !== usuario?.id && (() => {
                      // Verificar en localStorage de contactos
                      const contactosLS = JSON.parse(localStorage.getItem(`contactos_${usuario?.id}`) || '[]');
                      // Verificar en usuario.contactos
                      const contactosUsuario = usuario?.contactos || [];
                      const yaEsContacto = contactosLS.some(c => c.id === perfilSeleccionado.id) || 
                                          contactosUsuario.some(c => c.id === perfilSeleccionado.id);
                      return yaEsContacto ? (
                        <div className="detalle-item">
                          <span className="contacto-label">
                            <i className="fas fa-check"></i> Contacto
                          </span>
                        </div>
                      ) : (
                        <div className="detalle-item">
                          <button 
                            className="contact-preview-btn"
                            onClick={() => {
                              const nuevosContactos = [...contactosLS, {
                                id: perfilSeleccionado.id,
                                nombre: perfilSeleccionado.nombre,
                                email: perfilSeleccionado.email,
                                telefono: perfilSeleccionado.telefono,
                                tipoUsuario: perfilSeleccionado.tipoUsuario,
                                fechaAgregado: new Date().toISOString()
                              }];
                              localStorage.setItem(`contactos_${usuario?.id}`, JSON.stringify(nuevosContactos));
                              setPerfilSeleccionado({...perfilSeleccionado});
                            }}
                          >
                            <i className="fas fa-user-plus"></i> Agregar Contacto
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="perfil-izquierda perfil-privado-preview">
                  <div className="privado-content">
                    <i className="fas fa-lock"></i>
                    <h3>Perfil Privado</h3>
                    <p>Este usuario ha configurado su perfil como privado</p>
                  </div>
                </div>
              )}
              <div 
                className="perfil-derecha"
                style={perfilSeleccionado.perfil?.imagenFondoDerecha ? {
                  backgroundImage: `url(${perfilSeleccionado.perfil.imagenFondoDerecha})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}
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
    </div>
  );
};

export default Perfil;