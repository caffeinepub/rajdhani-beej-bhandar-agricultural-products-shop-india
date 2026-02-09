import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ADMIN_TOKEN_KEY = 'admin-session-token';
const ADMIN_USERNAME = 'ABYSSSHAVEZ';
const ADMIN_PASSWORD = 'S2182007n4299781@';

interface AdminSessionState {
  token: string | null;
  isAuthenticated: boolean;
}

export function useAdminSession() {
  const [sessionState, setSessionState] = useState<AdminSessionState>(() => {
    const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    return {
      token: storedToken,
      isAuthenticated: !!storedToken,
    };
  });

  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      // Client-side credential validation
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        throw new Error('Invalid username or password');
      }
      
      // Generate a simple session token (in production, this would come from backend)
      const token = 'QOCb5ncoyBmax3denemyuw3phcymdpFE';
      return token;
    },
    onSuccess: (token) => {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      setSessionState({ token, isAuthenticated: true });
      queryClient.invalidateQueries({ queryKey: ['adminStatus'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Clear session
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      setSessionState({ token: null, isAuthenticated: false });
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const login = async (username: string, password: string) => {
    return loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  return {
    token: sessionState.token,
    isAuthenticated: sessionState.isAuthenticated,
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
}
