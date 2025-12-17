import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import GestionProfesor from '../components/GestionProfesor.jsx'
import SeccionActividades from '../components/secciones/SeccionActividades.jsx'

function PaginaActividades() {
  const { usuario } = useAuth()

  if (usuario?.tipoUsuario === 'profesor') {
    return (
      <main>
        <GestionProfesor usuario={usuario} />
      </main>
    )
  }

  return (
    <main>
      <SeccionActividades />
    </main>
  )
}

export default PaginaActividades