// src/context/AuthContext.jsx
import { useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const decodeToken = (token) => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  };

  // Modified to accept role parameter
  const login = (token, roleFromApi = null) => {
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    // Use role from API if provided, otherwise from token
    const role = roleFromApi || decoded.Role; // Note: Your token uses "Role" with capital R
    
    if (!role) {
      throw new Error('No role specified');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role); // Store role separately for quick access
    queryClient.invalidateQueries();
    redirectBasedOnRole(role);
  };

  const redirectBasedOnRole = (role) => {
    const normalizedRole = role?.toUpperCase(); // Ensure consistent case
    
    switch (normalizedRole) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'DOCTOR':
      case 'CLINICIAN':
        navigate('/doctor');
        break;
      case 'RECEPTIONIST':
        navigate('/reception');
        break;
      case 'PROCUREMENT':
        navigate('/procurement');
        break;
      default:
        navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    queryClient.clear();
    navigate('/');
  };

  const getToken = () => localStorage.getItem('token');
  
  const getTokenClaims = () => {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
  };

  const getRole = () => {
    // First check localStorage, then token as fallback
    return localStorage.getItem('userRole') || getTokenClaims()?.Role || null;
  };

  const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    // Check token expiration if available
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      logout();
      return false;
    }
    
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        getToken,
        getRole,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
