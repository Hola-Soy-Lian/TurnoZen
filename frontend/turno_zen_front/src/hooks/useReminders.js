import { useState, useEffect } from 'react'

export const useReminders = (usuario) => {
  const [recordatorios, setRecordatorios] = useState([])

  useEffect(() => {
    if (!usuario) return

    const verificarRecordatorios = () => {
      const ahora = new Date()
      const reservas = usuario.reservas || []
      const recordatoriosActivos = []

      reservas.forEach(reserva => {
        if (reserva.estado === 'confirmado') {
          // Parsear horario para obtener fecha y hora
          const horario = reserva.horarioSeleccionado
          const [dia, horas] = horario.split(' ')
          const [horaInicio] = horas.split(' - ')
          
          // Calcular próxima clase
          const proximaClase = calcularProximaClase(dia, horaInicio)
          
          if (proximaClase) {
            const tiempoRestante = proximaClase.getTime() - ahora.getTime()
            const horasRestantes = tiempoRestante / (1000 * 60 * 60)
            
            // Recordatorio 24 horas antes
            if (horasRestantes <= 24 && horasRestantes > 23) {
              recordatoriosActivos.push({
                id: `${reserva.id}_24h`,
                tipo: '24h',
                mensaje: `Recordatorio: Tienes clase de ${reserva.curso} mañana a las ${horaInicio}`,
                reserva
              })
            }
            
            // Recordatorio 1 hora antes
            if (horasRestantes <= 1 && horasRestantes > 0.5) {
              recordatoriosActivos.push({
                id: `${reserva.id}_1h`,
                tipo: '1h',
                mensaje: `¡Tu clase de ${reserva.curso} comienza en 1 hora!`,
                reserva
              })
            }
          }
        }
      })

      setRecordatorios(recordatoriosActivos)
    }

    // Verificar cada minuto
    const intervalo = setInterval(verificarRecordatorios, 60000)
    verificarRecordatorios() // Verificar inmediatamente

    return () => clearInterval(intervalo)
  }, [usuario])

  const calcularProximaClase = (dia, hora) => {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
    const diaIndex = dias.findIndex(d => d.toLowerCase() === dia.toLowerCase())
    
    if (diaIndex === -1) return null

    const ahora = new Date()
    const [horas, minutos] = hora.split(':').map(Number)
    
    // Calcular próximo día de la semana
    let diasHastaClase = diaIndex - ahora.getDay()
    if (diasHastaClase < 0 || (diasHastaClase === 0 && ahora.getHours() >= horas)) {
      diasHastaClase += 7
    }
    
    const proximaClase = new Date(ahora)
    proximaClase.setDate(ahora.getDate() + diasHastaClase)
    proximaClase.setHours(horas, minutos, 0, 0)
    
    return proximaClase
  }

  const marcarComoVisto = (recordatorioId) => {
    setRecordatorios(prev => prev.filter(r => r.id !== recordatorioId))
  }

  return { recordatorios, marcarComoVisto }
}