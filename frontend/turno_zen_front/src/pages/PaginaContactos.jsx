import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Solicitudes from '../components/Solicitudes.jsx'

function PaginaContactos() {
  const { usuario, actualizarUsuario } = useAuth()

  return (
    <main>
      <Solicitudes usuario={usuario} onActualizarUsuario={actualizarUsuario} />
    </main>
  )
}

export default PaginaContactos