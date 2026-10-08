// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Tipos de rol que maneja la aplicación
export type Rol = 'admin' | 'cliente';

// 2. Usuario autenticado: correo + rol (lo entrega la API en /api/login)
export interface Usuario {
  email: string;
  rol: Rol;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_KEY = 'multicatalogo_usuario';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved) as Partial<Usuario>;
      if (typeof parsed.email === 'string' && (parsed.rol === 'admin' || parsed.rol === 'cliente')) {
        return { email: parsed.email, rol: parsed.rol };
      }
    } catch {
      // Una sesión local inválida requiere iniciar sesión de nuevo.
    }
    return null;
  });

  const login = (usuario: Usuario) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    setUser(usuario);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: user !== null, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
