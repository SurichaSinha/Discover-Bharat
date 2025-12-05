import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    console.log('AuthContext: Initial user from localStorage:', parsedUser);
    return parsedUser;
  });
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('AuthContext: Checking authentication status...');
      try {
        // Check if user is authenticated by calling /api/auth/me
        const response = await api.get('/api/auth/me');
        console.log('AuthContext: /api/auth/me response:', response.data);
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('AuthContext: User authenticated and restored');
        } else {
          // Clear invalid localStorage data
          localStorage.removeItem('user');
          setUser(null);
          console.log('AuthContext: No valid user data');
        }
      } catch (error) {
        console.log('AuthContext: Authentication check failed:', error);
        // User is not authenticated, clear localStorage
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Only check auth status if we don't have a user in localStorage
    if (!user) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (response.data.msg === 'logged in') {
        console.log('AuthContext: Login successful, user data:', response.data.user);
        // Use user data from login response
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('AuthContext: User set and saved to localStorage');
        } else {
          // Fallback: fetch user data from /me endpoint
          try {
            const userResponse = await api.get('/api/auth/me');
            if (userResponse.data) {
              setUser(userResponse.data);
              localStorage.setItem('user', JSON.stringify(userResponse.data));
            } else {
              // Last fallback: use basic data
              const basicUser = {
                email: email,
                name: email.split('@')[0],
                role: 'user'
              };
              setUser(basicUser);
              localStorage.setItem('user', JSON.stringify(basicUser));
            }
          } catch (meError) {
            console.log('Could not fetch user details, using basic data');
            const basicUser = {
              email: email,
              name: email.split('@')[0],
              role: 'user'
            };
            setUser(basicUser);
            localStorage.setItem('user', JSON.stringify(basicUser));
          }
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.msg || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Login failed. Please check your connection and try again.';
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      localStorage.removeItem('user');
      return {
        success: false,
        error: error.response?.data?.msg || 'Logout failed'
      };
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
};
