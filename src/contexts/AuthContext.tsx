import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "fiscal" | "licenciamento" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem("sigama_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock de validação
    if (!email || !password) {
      return { success: false, error: "Email e senha são obrigatórios" };
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter no mínimo 6 caracteres" };
    }

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock: criar usuário baseado no email
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      role: email.includes("admin") ? "admin" : "user",
    };

    setUser(mockUser);
    localStorage.setItem("sigama_user", JSON.stringify(mockUser));

    return { success: true };
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock de validação
    if (!email || !password || !name) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter no mínimo 6 caracteres" };
    }

    if (!email.includes("@")) {
      return { success: false, error: "Email inválido" };
    }

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock: criar novo usuário
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: "user",
    };

    setUser(mockUser);
    localStorage.setItem("sigama_user", JSON.stringify(mockUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sigama_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
