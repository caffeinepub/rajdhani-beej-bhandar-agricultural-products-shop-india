import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminActor } from '../useAdminActor';
import { useAdminSession } from '../auth/useAdminSession';
import type { Agent, AgentInput } from '../../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

// Type alias to avoid conflict with @dfinity/agent's Agent type
type BackendAgent = Agent;

export function useGetAllAgents() {
  const { actor } = useAdminActor();
  const { token } = useAdminSession();

  return useQuery<BackendAgent[]>({
    queryKey: ['agents', token],
    queryFn: async (): Promise<BackendAgent[]> => {
      if (!actor || !token) return [];
      return actor.getAllAgents(token) as unknown as Promise<BackendAgent[]>;
    },
    enabled: !!actor && !!token,
  });
}

export function useGetAgent(mobileNumber: string) {
  const { actor } = useAdminActor();
  const { token } = useAdminSession();

  return useQuery<BackendAgent | null>({
    queryKey: ['agent', mobileNumber, token],
    queryFn: async (): Promise<BackendAgent | null> => {
      if (!actor || !token) return null;
      return actor.getAgent(token, mobileNumber) as unknown as Promise<BackendAgent | null>;
    },
    enabled: !!actor && !!token && !!mobileNumber,
  });
}

export function useCreateAgent() {
  const { actor } = useAdminActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agentInput: AgentInput) => {
      if (!actor || !token) throw new Error('Not authorized');
      
      // Generate a unique principal for the agent (in production, this would be handled differently)
      const agentPrincipal = Principal.fromText('2vxsx-fae');
      
      await actor.createAgent(token, agentInput, agentPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create agent');
    },
  });
}

export function useUpdateAgent() {
  const { actor } = useAdminActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mobileNumber, agentInput }: { mobileNumber: string; agentInput: AgentInput }) => {
      if (!actor || !token) throw new Error('Not authorized');
      await actor.updateAgent(token, mobileNumber, agentInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update agent');
    },
  });
}

export function useDeleteAgent() {
  const { actor } = useAdminActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mobileNumber: string) => {
      if (!actor || !token) throw new Error('Not authorized');
      await actor.deleteAgent(token, mobileNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete agent');
    },
  });
}
