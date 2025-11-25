import { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../constants/roles';

const AuthContext = createContext({
  user: null,
  userRole: null,
  login: async () => {},
  logout: async () => {},
  loading: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (token && role) {
          setUser({ token });
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
 
      // For demo purposes
      const mockResponse = {
        token: 'mock-jwt-token',
        role: UserRole.ADMIN // Default to ADMIN for demo
      };
      
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('role', mockResponse.role);
      
      setUser({ token: mockResponse.token });
      setUserRole(mockResponse.role);
      
      return { success: true, role: mockResponse.role };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      setUser(null);
      setUserRole(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userRole,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
