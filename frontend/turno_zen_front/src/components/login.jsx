import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import './login.css'

function Login() {
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    telefono: '',
    tipoUsuario: 'alumno'
  })
  const [notification, setNotification] = useState('')

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 4000)
  }

  const handleRecovery = (e) => {
    e.preventDefault()
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuario = usuarios.find(u => u.email === recoveryEmail)
    
    if (usuario) {
      showNotification(`Tu contraseña es: ${usuario.password}`)
      setShowRecovery(false)
      setRecoveryEmail('')
    } else {
      showNotification('Email no encontrado')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isLogin) {
      // Login
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const usuario = usuarios.find(u => u.email === formData.email && u.password === formData.password)
      
      if (usuario) {
        showNotification('¡Bienvenido de vuelta!')
        setTimeout(() => login(usuario), 1000)
      } else {
        showNotification('Email o contraseña incorrectos')
      }
    } else {
      // Registro
      if (!formData.nombre.trim() || !formData.email.trim() || !formData.password.trim()) {
        showNotification('Por favor completa todos los campos obligatorios')
        return
      }
      
      if (formData.password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres')
        return
      }
      
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const usuarioExiste = usuarios.find(u => u.email === formData.email)
      
      if (usuarioExiste) {
        showNotification('El email ya está registrado')
        return
      }
      
      const nuevoUsuario = {
        id: Date.now(),
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        telefono: formData.telefono,
        tipoUsuario: formData.tipoUsuario,
        perfil: {
          avatar: '',
          bio: '',
          fechaRegistro: new Date().toISOString(),
          notificaciones: true
        },
        reservas: [],
        solicitudes: [],
        contactos: []
      }
      
      usuarios.push(nuevoUsuario)
      localStorage.setItem('usuarios', JSON.stringify(usuarios))
      showNotification('¡Cuenta creada exitosamente!')
      setTimeout(() => login(nuevoUsuario), 1000)
    }
  }

  return (
    <main>
      <img src="../../public/images/img1.webp" className="img1" alt="Background" />

      <div className="tituloAplicacionLogin">
        <svg className="svg" width="773" height="722" viewBox="0 0 773 722" xmlns="http://www.w3.org/2000/svg">
          <path d="M383.28 17.7475C233.28 -33.8525 152.78 39.2475 131.28 82.2475C105.613 134.414 40.6918 225.564 25.7801 249.248C8.78002 276.248 -25.7198 414.748 32.2801 461.248C73.3735 494.193 122.78 564.248 156.78 601.248C179.578 626.057 234.113 693.914 272.78 714.748C317.324 738.748 485.48 692.948 514.28 647.748C550.28 591.248 647.78 611.748 709.78 550.248C771.78 488.748 776.78 295.748 771.28 205.748C766.88 133.748 677.822 89.5798 632.78 82.2475C611.28 78.7476 533.28 69.3475 383.28 17.7475Z" fill="#a5f5f8cb"/>
        </svg>
      </div>

      <div className="login">
        <div className="logo-text">
          <h2>TurnoZen</h2>
        </div>

        <div className="auth-toggle">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="inputLogin">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="listLogin"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="listLogin"
              />
              <select
                value={formData.tipoUsuario}
                onChange={(e) => setFormData({...formData, tipoUsuario: e.target.value})}
                className="listLogin"
                required
              >
                <option value="alumno">Usuario</option>
                <option value="profesor">Profesor</option>
              </select>
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="listLogin"
            required
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="listLogin"
            required
          />
          
          <button type="submit" className="listLogin submit-btn">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
          
          {isLogin && (
            <button 
              type="button" 
              className="recovery-link"
              onClick={() => setShowRecovery(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </form>

        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>
      
      {showRecovery && (
        <div className="modal-overlay" onClick={() => setShowRecovery(false)}>
          <div className="recovery-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Recuperar Contraseña</h3>
            <form onSubmit={handleRecovery}>
              <input
                type="email"
                placeholder="Ingresa tu email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="listLogin"
                required
              />
              <div className="modal-actions">
                <button type="submit" className="listLogin submit-btn">Recuperar</button>
                <button 
                  type="button" 
                  className="listLogin cancel-btn"
                  onClick={() => setShowRecovery(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Login