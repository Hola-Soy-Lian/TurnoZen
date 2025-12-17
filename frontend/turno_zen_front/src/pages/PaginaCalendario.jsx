import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Calendario from '../components/Calendario.jsx'

function PaginaCalendario() {
  const { usuario } = useAuth()

  return (
    <main>
      <Calendario usuario={usuario} />
    </main>
  )
}

export default PaginaCalendario