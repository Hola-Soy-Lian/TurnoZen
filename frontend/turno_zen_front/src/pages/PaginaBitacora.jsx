import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Bitacora from '../components/Bitacora.jsx'

function PaginaBitacora() {
  const { usuario } = useAuth()

  return (
    <main>
      <Bitacora usuario={usuario} />
    </main>
  )
}

export default PaginaBitacora