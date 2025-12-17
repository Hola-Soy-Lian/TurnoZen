import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'

import './EncabezadoPrincipal.css'

function EncabezadoPrincipal() {
  const { usuario, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem(`notificaciones_${usuario?.id}`) || '[]')
  })
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotifications = JSON.parse(localStorage.getItem(`notificaciones_${usuario?.id}`) || '[]')
      setNotifications(newNotifications)
    }, 2000)
    return () => clearInterval(interval)
  }, [usuario?.id])

  return (
    <header className="encabezadoPrincipal">
        <div className="contenedorEncabezado">
            <Link to="/" className="tituloAplicacion">
                <img src="/images/turnozen_logo.png" className="logo" alt="TurnoZen" />
            </Link>

            <div className="nav-right">
                <nav className="navegacionPrincipal">
                    <ul className="listaNavegacion">
                        <li><Link to="/" className="enlaceNavegacion">Principal</Link></li>
                        {usuario?.tipoUsuario !== 'profesor' && (
                          <li><Link to="/turnos" className="enlaceNavegacion">Mis Turnos</Link></li>
                        )}
                        {usuario?.tipoUsuario === 'profesor' && (
                          <li className="dropdown-container">
                            <Link 
                              to="#" 
                              className="enlaceNavegacion"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowDropdown(!showDropdown);
                              }}
                            >
                              Mis Clases
                            </Link>
                          </li>
                        )}
                        <li><Link to="/contactos" className="enlaceNavegacion">Contactos</Link></li>
                        <li><Link to="/calendario" className="enlaceNavegacion">Calendario</Link></li>
                        <li><Link to="/usuario" className="enlaceNavegacion">Perfil</Link></li>
                    </ul>
                </nav>
                <div className="user-section">
                    <div className="notifications-container">
                        <button 
                            className="notifications-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <i className="fas fa-bell"></i>
                            {notifications.filter(n => !n.leida).length > 0 && (
                                <span className="notification-badge">
                                    {notifications.filter(n => !n.leida).length}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="notifications-dropdown">
                                <div className="notifications-header">
                                    <h4>Notificaciones</h4>
                                </div>
                                <div className="notifications-list">
                                    {notifications.length > 0 ? (
                                        notifications.slice(0, 5).map(notif => (
                                            <div 
                                                key={notif.id} 
                                                className={`notification-item ${!notif.leida ? 'unread' : ''}`}
                                                onClick={() => {
                                                    // Marcar como leída
                                                    const updatedNotifications = notifications.map(n => 
                                                        n.id === notif.id ? {...n, leida: true} : n
                                                    );
                                                    localStorage.setItem(`notificaciones_${usuario?.id}`, JSON.stringify(updatedNotifications));
                                                    setNotifications(updatedNotifications);
                                                    
                                                    // Redirigir según el tipo
                                                    if (notif.tipo === 'solicitud_clase') {
                                                        window.location.href = '/actividades';
                                                    }
                                                    setShowNotifications(false);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <p>{notif.mensaje}</p>
                                                <span className="notification-date">
                                                    {new Date(notif.fecha).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-notifications">
                                            <p>No hay notificaciones</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="user-info-container">
                        <span className="usuario-info">Hola, {usuario?.nombre}</span>
                        <button 
                            className="user-menu-btn"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                        {showUserMenu && (
                            <div className="user-dropdown">
                                <button onClick={toggleTheme} className="dropdown-option">
                                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                                    {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                                </button>
                                <button onClick={logout} className="dropdown-option logout">
                                    <i className="fas fa-sign-out-alt"></i>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showDropdown && (
              <div className="dropdown-menu-header">
                <Link to="/actividades" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  Gestión
                </Link>
                <Link to="/bitacora" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  Bitácora
                </Link>
                <Link to="/calendario" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  Calendario
                </Link>
              </div>
            )}
        </div>
    </header>
  )
}

export default EncabezadoPrincipal