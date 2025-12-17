import SeccionTurnos from '../components/secciones/SeccionTurnos.jsx'

import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import MisTurnos from '../components/MisTurnos.jsx'

function PaginaTurnos() {
  const { usuario, actualizarUsuario } = useAuth()

  const handleCancelarTurno = (reservaId) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id)
    
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].reservas = usuarios[usuarioIndex].reservas.filter(r => r.id !== reservaId)
      localStorage.setItem('usuarios', JSON.stringify(usuarios))
      actualizarUsuario(usuarios[usuarioIndex])
    }
  }

  return (
    <main>
      <MisTurnos usuario={usuario} onCancelar={handleCancelarTurno} />
    </main>
  )
}

export default PaginaTurnos