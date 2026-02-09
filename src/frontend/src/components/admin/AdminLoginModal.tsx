import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminSession } from '../../hooks/auth/useAdminSession';
import { useI18n } from '../../i18n/I18nProvider';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const { login, logout, isAuthenticated, isLoggingIn, isLoggingOut, loginError } = useAdminSession();
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  const isLoading = isLoggingIn || isLoggingOut;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t('admin.loginRequired')}
          </DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? t('admin.loggedInDescription')
              : t('admin.loginDescription')}
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated ? (
          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('admin.logout')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-4 py-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginError.message || t('admin.loginError')}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">{t('admin.username')}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('admin.usernamePlaceholder')}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('admin.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.passwordPlaceholder')}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('admin.login')}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
