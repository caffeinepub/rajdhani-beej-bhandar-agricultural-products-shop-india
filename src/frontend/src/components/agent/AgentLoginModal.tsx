import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAgentSession } from '../../hooks/auth/useAgentSession';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useI18n } from '../../i18n/I18nProvider';
import { Loader2, AlertCircle } from 'lucide-react';

interface AgentLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentLoginModal({ open, onOpenChange }: AgentLoginModalProps) {
  const { t } = useI18n();
  const { login: iiLogin, identity, loginStatus } = useInternetIdentity();
  const { login, logout, isAuthenticated, isLoggingIn, loginError } = useAgentSession();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mobileNumber || !password) {
      setError(t('agent.loginErrorRequired'));
      return;
    }

    try {
      // First authenticate with Internet Identity if not already
      if (!identity) {
        await iiLogin();
      }
      
      // Then authenticate with agent credentials
      await login(mobileNumber, password);
      onOpenChange(false);
      setMobileNumber('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || t('agent.loginError'));
    }
  };

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isAuthenticated ? t('agent.logout') : t('agent.loginTitle')}</DialogTitle>
          <DialogDescription>
            {isAuthenticated ? t('agent.logoutDesc') : t('agent.loginDesc')}
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>{t('agent.loggedInAs')}</AlertDescription>
            </Alert>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              {t('agent.logout')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {(error || loginError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || loginError?.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="agent-mobile">{t('agent.mobileNumber')}</Label>
              <Input
                id="agent-mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder={t('agent.mobileNumberPlaceholder')}
                disabled={isLoggingIn || loginStatus === 'logging-in'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-password">{t('agent.password')}</Label>
              <Input
                id="agent-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('agent.passwordPlaceholder')}
                disabled={isLoggingIn || loginStatus === 'logging-in'}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoggingIn || loginStatus === 'logging-in'}>
              {isLoggingIn || loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('agent.loggingIn')}
                </>
              ) : (
                t('agent.login')
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
