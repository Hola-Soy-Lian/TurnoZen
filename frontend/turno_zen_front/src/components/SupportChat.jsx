import React, { useState, useRef, useEffect } from 'react'
import './SupportChat.css'

const SupportChat = ({ usuario }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy el asistente de TurnoZen. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = generateBotResponse(newMessage)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('reserva') || message.includes('turno')) {
      return 'Para hacer una reserva, ve a la página principal, selecciona la clase que te interesa y haz clic en "Reservar Turno". El profesor revisará tu solicitud.'
    }
    
    if (message.includes('cancelar')) {
      return 'Puedes cancelar tu reserva desde "Mis Turnos". Ten en cuenta que las políticas de cancelación pueden variar según el profesor.'
    }
    
    if (message.includes('pago') || message.includes('precio')) {
      return 'Los precios se muestran en cada clase. El pago se coordina directamente con el profesor una vez confirmada la reserva.'
    }
    
    if (message.includes('perfil') || message.includes('foto')) {
      return 'Puedes editar tu perfil desde la sección "Perfil". Allí puedes cambiar tu foto, información personal y configurar imágenes de fondo.'
    }
    
    if (message.includes('calendario')) {
      return 'En el calendario puedes ver tus clases confirmadas. Los profesores ven sus clases creadas y los alumnos sus reservas confirmadas.'
    }
    
    if (message.includes('calificar') || message.includes('reseña')) {
      return 'Después de tomar una clase, puedes calificarla desde "Mis Turnos" haciendo clic en "Calificar Clase".'
    }
    
    if (message.includes('contacto') || message.includes('profesor')) {
      return 'Puedes contactar profesores a través del sistema de solicitudes en "Contactos" o comunicarte en el muro de la clase.'
    }
    
    if (message.includes('problema') || message.includes('error')) {
      return 'Si tienes problemas técnicos, intenta refrescar la página. Si persiste, contacta al administrador del sistema.'
    }
    
    return 'Gracias por tu consulta. ¿Puedes ser más específico sobre lo que necesitas? Puedo ayudarte con reservas, cancelaciones, perfil, calendario, calificaciones y más.'
  }

  const quickActions = [
    { text: '¿Cómo reservar una clase?', action: () => setNewMessage('¿Cómo reservar una clase?') },
    { text: '¿Cómo cancelar un turno?', action: () => setNewMessage('¿Cómo cancelar un turno?') },
    { text: '¿Cómo cambiar mi perfil?', action: () => setNewMessage('¿Cómo cambiar mi perfil?') },
    { text: 'Tengo un problema técnico', action: () => setNewMessage('Tengo un problema técnico') }
  ]

  if (!usuario) return null

  return (
    <>
      <div className={`support-chat ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-title">
            <i className="fas fa-headset"></i>
            <span>Soporte TurnoZen</span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="toggle-chat">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment'}`}></i>
          </button>
        </div>
        
        {isOpen && (
          <div className="chat-body">
            <div className="messages-container">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="timestamp">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message bot typing">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {messages.length === 1 && (
              <div className="quick-actions">
                <p>Preguntas frecuentes:</p>
                {quickActions.map((action, index) => (
                  <button key={index} onClick={action.action} className="quick-action-btn">
                    {action.text}
                  </button>
                ))}
              </div>
            )}
            
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu consulta..."
              />
              <button onClick={sendMessage} disabled={!newMessage.trim()}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isOpen && (
        <button className="chat-fab" onClick={() => setIsOpen(true)}>
          <i className="fas fa-question-circle"></i>
        </button>
      )}
    </>
  )
}

export default SupportChat