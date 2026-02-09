import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAgentSession } from '../../hooks/auth/useAgentSession';
import { useI18n } from '../../i18n/I18nProvider';
import { AgentLoginModal } from './AgentLoginModal';
import { ShieldAlert } from 'lucide-react';

interface AgentRouteGuardProps {
  children: React.ReactNode;
}

export default function AgentRouteGuard({ children }: AgentRouteGuardProps) {
  const { t } = useI18n();
  const { isAuthenticated } = useAgentSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container py-16 max-w-2xl">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">{t('agent.accessDenied')}</AlertTitle>
          <AlertDescription className="mt-2">
            {t('agent.accessDeniedDesc')}
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-4">
          <Button onClick={() => setLoginModalOpen(true)}>
            {t('agent.login')}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">{t('nav.home')}</Link>
          </Button>
        </div>
        <AgentLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      </div>
    );
  }

  return <>{children}</>;
}
