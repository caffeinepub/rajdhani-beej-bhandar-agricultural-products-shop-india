import { type ReactNode, useState } from 'react';
import { useAdminStatus } from '../../hooks/auth/useAdminStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import LoadingState from '../system/LoadingState';
import { AdminLoginModal } from './AdminLoginModal';

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading, error } = useAdminStatus();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to verify admin status. Please try logging in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <div className="container py-12 max-w-md mx-auto">
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              You need admin privileges to access this page. Please log in as an admin.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => setLoginModalOpen(true)}>
              Admin Login
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
        <AdminLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      </>
    );
  }

  return <>{children}</>;
}
