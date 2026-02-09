import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';

const AGENT_SESSION_KEY = 'agent-session-authenticated';

interface AgentSessionState {
  isAuthenticated: boolean;
}

export function useAgentSession() {
  const [sessionState, setSessionState] = useState<AgentSessionState>(() => {
    const stored = localStorage.getItem(AGENT_SESSION_KEY);
    return {
      isAuthenticated: stored === 'true',
    };
  });

  const { actor } = useActor();
  const { identity, clear: clearIdentity } = useInternetIdentity();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ mobileNumber, password }: { mobileNumber: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      const result = await actor.agentLogin(mobileNumber, password);
      if (!result) {
        throw new Error('Invalid mobile number or password');
      }
      return result;
    },
    onSuccess: () => {
      localStorage.setItem(AGENT_SESSION_KEY, 'true');
      setSessionState({ isAuthenticated: true });
      queryClient.invalidateQueries({ queryKey: ['agentSession'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem(AGENT_SESSION_KEY);
      setSessionState({ isAuthenticated: false });
      await clearIdentity();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const login = async (mobileNumber: string, password: string) => {
    return loginMutation.mutateAsync({ mobileNumber, password });
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  return {
    isAuthenticated: sessionState.isAuthenticated && !!identity,
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    identity,
  };
}
