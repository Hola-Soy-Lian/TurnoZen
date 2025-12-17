import SeccionUsuario from '../components/secciones/SeccionUsuario.jsx'

import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Perfil from '../components/Perfil.jsx'

function PaginaUsuario() {
  const { usuario, actualizarUsuario } = useAuth()

  return (
    <main>
      <Perfil usuario={usuario} onActualizar={actualizarUsuario} />
    </main>
  )
}

export default PaginaUsuario