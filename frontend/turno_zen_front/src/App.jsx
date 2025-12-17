import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import EncabezadoPrincipal from './components/EncabezadoPrincipal.jsx'
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaTurnos from './pages/PaginaTurnos.jsx'
import PaginaActividades from './pages/PaginaActividades.jsx'
import PaginaUsuario from './pages/PaginaUsuario.jsx'
import PaginaCalendario from './pages/PaginaCalendario.jsx'
import PaginaBitacora from './pages/PaginaBitacora.jsx'
import PaginaContactos from './pages/PaginaContactos.jsx'
import PaginaMuroClase from './pages/PaginaMuroClase.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/login.jsx'
import './App.css'

function AppContent() {
  const location = useLocation()
  const { usuario } = useAuth()
  const isLoginPage = location.pathname === '/login'

  React.useEffect(() => {
    if (isLoginPage || !usuario) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isLoginPage, usuario])

  if (!usuario) {
    return <Login />
  }

  return (
    <>
      {usuario && <EncabezadoPrincipal />}
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/turnos" element={<PaginaTurnos />} />
        <Route path="/actividades" element={<PaginaActividades />} />
        <Route path="/contactos" element={<PaginaContactos />} />
        <Route path="/bitacora" element={<PaginaBitacora />} />
        <Route path="/calendario" element={<PaginaCalendario />} />
        <Route path="/usuario" element={<PaginaUsuario />} />
        <Route path="/muro-clase/:claseId" element={<PaginaMuroClase />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {usuario && !isLoginPage && <Footer />}
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App