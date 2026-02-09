import { Button } from '@/components/ui/button';
import { useAdminSession } from '../../hooks/auth/useAdminSession';
import { useI18n } from '../../i18n/I18nProvider';
import { Loader2 } from 'lucide-react';

interface AdminAuthControlsProps {
  onOpenLoginModal: () => void;
}

export function AdminAuthControls({ onOpenLoginModal }: AdminAuthControlsProps) {
  const { logout, isAuthenticated, isLoggingOut } = useAdminSession();
  const { t } = useI18n();

  const handleClick = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoggingOut}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
    >
      {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isAuthenticated ? t('admin.logout') : t('footer.admin')}
    </Button>
  );
}
