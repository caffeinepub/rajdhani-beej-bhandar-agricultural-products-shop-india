import { useAdminSession } from './useAdminSession';

export function useAdminStatus() {
  const { isAuthenticated, token } = useAdminSession();

  return {
    isAdmin: isAuthenticated,
    isLoading: false,
    error: null,
    token,
  };
}
