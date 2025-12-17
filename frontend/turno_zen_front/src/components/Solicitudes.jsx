import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification.js';
import './Solicitudes.css';

const Solicitudes = ({ usuario, onActualizarUsuario }) => {
  const [buscarUsuario, setBuscarUsuario] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const { notification, showNotification } = useNotification();

  const buscarUsuarios = () => {
    if (!buscarUsuario.trim()) return;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const encontrados = usuarios.filter(u => 
      u.id !== usuario.id && 
      (u.nombre.toLowerCase().includes(buscarUsuario.toLowerCase()) ||
       u.email.toLowerCase().includes(buscarUsuario.toLowerCase()))
    );
    setUsuariosEncontrados(encontrados);
  };

  const enviarSolicitud = (usuarioDestino) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === usuarioDestino.id);
    
    if (usuarioIndex !== -1) {
      const solicitud = {
        id: Date.now(),
        de: usuario.id,
        deNombre: usuario.nombre,
        deEmail: usuario.email,
        deTipo: usuario.tipoUsuario,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      };
      
      usuarios[usuarioIndex].solicitudes = usuarios[usuarioIndex].solicitudes || [];
      usuarios[usuarioIndex].solicitudes.push(solicitud);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      showNotification('Solicitud enviada correctamente');
      setUsuariosEncontrados([]);
      setBuscarUsuario('');
    }
  };

  const responderSolicitud = (solicitudId, respuesta) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
    
    if (usuarioIndex !== -1) {
      const solicitudIndex = usuarios[usuarioIndex].solicitudes.findIndex(s => s.id === solicitudId);
      
      if (solicitudIndex !== -1) {
        const solicitud = usuarios[usuarioIndex].solicitudes[solicitudIndex];
        
        if (respuesta === 'aceptar') {
          usuarios[usuarioIndex].contactos = usuarios[usuarioIndex].contactos || [];
          usuarios[usuarioIndex].contactos.push({
            id: solicitud.de,
            nombre: solicitud.deNombre,
            email: solicitud.deEmail,
            tipo: solicitud.deTipo,
            fechaContacto: new Date().toISOString()
          });
          
          const remitenteIndex = usuarios.findIndex(u => u.id === solicitud.de);
          if (remitenteIndex !== -1) {
            usuarios[remitenteIndex].contactos = usuarios[remitenteIndex].contactos || [];
            usuarios[remitenteIndex].contactos.push({
              id: usuario.id,
              nombre: usuario.nombre,
              email: usuario.email,
              tipo: usuario.tipoUsuario,
              fechaContacto: new Date().toISOString()
            });
          }
        }
        
        usuarios[usuarioIndex].solicitudes.splice(solicitudIndex, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        onActualizarUsuario(usuarios[usuarioIndex]);
      }
    }
  };

  return (
    <div className="solicitudes-container">
      <div className="solicitudes-header">
        <h2>Gestión de Contactos</h2>
        <p>Busca usuarios, gestiona solicitudes y administra tus contactos</p>
      </div>

      <div className="buscar-section">
        <h3>Buscar Usuarios</h3>
        <div className="buscar-form">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={buscarUsuario}
            onChange={(e) => setBuscarUsuario(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && buscarUsuarios()}
          />
          <button onClick={buscarUsuarios} className="buscar-btn">
            <i className="fas fa-search"></i> Buscar
          </button>
        </div>
        
        {usuariosEncontrados.length > 0 && (
          <div className="usuarios-encontrados">
            <h4>Usuarios encontrados:</h4>
            {usuariosEncontrados.map(u => (
              <div key={u.id} className="usuario-card">
                <div className="usuario-info">
                  <div className="avatar">
                    {u.perfil?.avatar ? (
                      <img src={u.perfil.avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      u.nombre.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="info-text">
                    <h4>{u.nombre}</h4>
                    <p>{u.email}</p>
                    <span className={`tipo-badge ${u.tipoUsuario}`}>
                      {u.tipoUsuario}
                    </span>
                  </div>
                </div>
                <button 
                  className="solicitar-btn"
                  onClick={() => enviarSolicitud(u)}
                >
                  <i className="fas fa-user-plus"></i> Enviar Solicitud
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="solicitudes-section">
        <h3>Solicitudes Recibidas</h3>
        {usuario.solicitudes && usuario.solicitudes.length > 0 ? (
          <div className="solicitudes-lista">
            {usuario.solicitudes.map(solicitud => (
              <div key={solicitud.id} className="solicitud-card">
                <div className="solicitud-info">
                  <div className="avatar">
                    {(() => {
                      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
                      const remitente = usuarios.find(u => u.id === solicitud.de)
                      return remitente?.perfil?.avatar ? (
                        <img src={remitente.perfil.avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        solicitud.deNombre.charAt(0).toUpperCase()
                      )
                    })()} 
                  </div>
                  <div className="info-text">
                    <h4>{solicitud.deNombre}</h4>
                    <p>{solicitud.deEmail}</p>
                    <span className={`tipo-badge ${solicitud.deTipo}`}>
                      {solicitud.deTipo}
                    </span>
                    <p className="fecha">
                      {new Date(solicitud.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="solicitud-acciones">
                  <button 
                    className="aceptar-btn"
                    onClick={() => responderSolicitud(solicitud.id, 'aceptar')}
                  >
                    <i className="fas fa-check"></i> Aceptar
                  </button>
                  <button 
                    className="rechazar-btn"
                    onClick={() => responderSolicitud(solicitud.id, 'rechazar')}
                  >
                    <i className="fas fa-times"></i> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-solicitudes">
            <i className="fas fa-inbox"></i>
            <p>No tienes solicitudes pendientes</p>
          </div>
        )}
      </div>

      <div className="contactos-section">
        <h3>Mis Contactos</h3>
        {usuario.contactos && usuario.contactos.length > 0 ? (
          <div className="contactos-lista">
            {usuario.contactos.map(contacto => (
              <div key={contacto.id} className="contacto-card">
                <div className="avatar">
                  {(() => {
                    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
                    const usuarioContacto = usuarios.find(u => u.id === contacto.id)
                    return usuarioContacto?.perfil?.avatar ? (
                      <img src={usuarioContacto.perfil.avatar} alt="Perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      contacto.nombre.charAt(0).toUpperCase()
                    )
                  })()} 
                </div>
                <div className="contacto-info info-text">
                  <h4>{contacto.nombre}</h4>
                  <p>{contacto.email}</p>
                  <span className={`tipo-badge ${contacto.tipo}`}>
                    {contacto.tipo}
                  </span>
                </div>
                <button 
                  className="ver-perfil-btn"
                  onClick={() => {
                    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                    const perfilCompleto = usuarios.find(u => u.id === contacto.id);
                    setPerfilSeleccionado(perfilCompleto);
                  }}
                >
                  <i className="fas fa-user"></i> Ver Perfil
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-contactos">
            <i className="fas fa-address-book"></i>
            <p>No tienes contactos aún</p>
          </div>
        )}
      </div>
      
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
    </div>
  );
};

export default Solicitudes;