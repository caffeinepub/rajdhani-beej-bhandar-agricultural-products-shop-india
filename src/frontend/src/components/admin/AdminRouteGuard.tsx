import { type ReactNode, useState } from 'react';
import { useAdminSession } from '../../hooks/auth/useAdminSession';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { AdminLoginModal } from './AdminLoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { t } = useI18n();

  if (!isAuthenticated) {
    return (
      <>
        <div className="container py-12 max-w-md mx-auto">
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>{t('admin.accessDenied')}</AlertTitle>
            <AlertDescription className="mt-2">
              {t('admin.accessDeniedDescription')}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => setLoginModalOpen(true)}>
              {t('admin.adminLoginButton')}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">{t('admin.goHome')}</Link>
            </Button>
          </div>
        </div>
        <AdminLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      </>
    );
  }

  return <>{children}</>;
}
