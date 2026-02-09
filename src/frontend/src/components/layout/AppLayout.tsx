import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useI18n } from '../../i18n/I18nProvider';
import { useAdminStatus } from '../../hooks/auth/useAdminStatus';
import { AdminLoginModal } from '../admin/AdminLoginModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { isAdmin } = useAdminStatus();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <img src="/assets/generated/logo-agri.dim_512x512.png" alt="Logo" className="h-8 w-8" />
            <span className="hidden sm:inline">{t('app.title')}</span>
          </Link>
          
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" asChild>
              <Link to="/">{t('nav.home')}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/products">{t('nav.products')}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">{t('nav.contact')}</Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin">{t('nav.admin')}</Link>
              </Button>
            )}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-6">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLoginModalOpen(true)}
            >
              {t('footer.admin')}
            </Button>
          </div>
        </div>
      </footer>

      <AdminLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
