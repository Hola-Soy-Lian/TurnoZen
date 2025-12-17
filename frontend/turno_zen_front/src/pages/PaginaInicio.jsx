import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import SeccionPrincipal from '../components/secciones/SeccionPrincipal'

function PaginaInicio() {
  const { usuario, actualizarUsuario } = useAuth()
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [cursosCompletos, setCursosCompletos] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)

  const cargarCursos = () => {
    const clasesCreadas = JSON.parse(localStorage.getItem('clases') || '[]')
    const clasesConvertidas = clasesCreadas
      .filter(clase => clase.precio && clase.precio > 0)
      .map(clase => ({
        id: clase.id,
        categoria: clase.nombre,
        profesor: clase.profesor,
        horarios: clase.horarios,
        descripcion: clase.descripcion,
        tipo: clase.tipo,
        predefinido: false,
        cupoMaximo: clase.cupoMaximo,
        precio: clase.precio,
        modalidad: clase.modalidad,
        ubicacion: clase.ubicacion,
        calificaciones: clase.calificaciones || [],
        promedioCalificacion: clase.promedioCalificacion || 0
      }))
    
    setCursosCompletos(clasesConvertidas)
  }

  useEffect(() => {
    cargarCursos()
    const handleClasesUpdate = () => cargarCursos()
    window.addEventListener('clasesUpdated', handleClasesUpdate)
    return () => window.removeEventListener('clasesUpdated', handleClasesUpdate)
  }, [])

  const handleReserva = (reservaData) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id)
    
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].reservas = usuarios[usuarioIndex].reservas || []
      usuarios[usuarioIndex].reservas.push({
        ...reservaData,
        id: Date.now(),
        estado: 'pendiente',
        fechaSolicitud: new Date().toISOString()
      })
      localStorage.setItem('usuarios', JSON.stringify(usuarios))
      actualizarUsuario(usuarios[usuarioIndex])
    }
  }

  return (
    <main>
      <SeccionPrincipal 
        usuario={usuario}
        cursosCompletos={cursosCompletos}
        filtroActivo={filtroActivo}
        setFiltroActivo={setFiltroActivo}
        onReserva={handleReserva}
      />
    </main>
  )
}

export default PaginaInicio