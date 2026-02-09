import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '../../i18n/I18nProvider';
import { Loader2, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const isAuthenticated = !!identity;
  const isLoading = loginStatus === 'logging-in' || loginStatus === 'initializing';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onOpenChange(false);
    } else {
      try {
        await login();
        onOpenChange(false);
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t('footer.admin')}
          </DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? 'You are currently logged in as an admin. Click below to log out.'
              : 'Admin access is required to manage products, orders, and site content. Please log in using Internet Identity.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleAuth}
            disabled={isLoading}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="lg"
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAuthenticated ? t('admin.logout') : t('admin.login')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
