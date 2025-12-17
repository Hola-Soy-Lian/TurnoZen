import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const usuarioCompleto = {
      ...userData,
      perfil: {
        avatar: userData.perfil?.avatar || '',
        bio: userData.perfil?.bio || '',
        fechaRegistro: userData.perfil?.fechaRegistro || new Date().toISOString(),
        notificaciones: userData.perfil?.notificaciones !== undefined ? userData.perfil.notificaciones : true
      },
      reservas: userData.reservas || [],
      solicitudes: userData.solicitudes || [],
      contactos: userData.contactos || []
    };
    
    setUsuario(usuarioCompleto);
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioCompleto));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioActual');
  };

  const actualizarUsuario = (usuarioActualizado) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === usuarioActualizado.id);
    
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex] = usuarioActualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
    }
  };

  const value = {
    usuario,
    login,
    logout,
    actualizarUsuario,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};