import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useI18n } from '../../i18n/I18nProvider';
import { useAdminSession } from '../../hooks/auth/useAdminSession';
import { useAgentSession } from '../../hooks/auth/useAgentSession';
import { AdminLoginModal } from '../admin/AdminLoginModal';
import { AgentLoginModal } from '../agent/AgentLoginModal';
import { CONTACT_INFO } from '../../constants/contact';
import { Phone, MapPin } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { isAuthenticated: isAdminAuthenticated } = useAdminSession();
  const { isAuthenticated: isAgentAuthenticated } = useAgentSession();
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [agentLoginModalOpen, setAgentLoginModalOpen] = useState(false);

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
            {isAdminAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/admin">{t('nav.admin')}</Link>
              </Button>
            )}
            {isAgentAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/agent/orders">{t('nav.agentOrders')}</Link>
              </Button>
            )}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3">{CONTACT_INFO.shopName}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{t('footer.phone')}</div>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-primary">
                      {CONTACT_INFO.phoneFormatted}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{t('footer.address')}</div>
                    <p>{CONTACT_INFO.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end justify-start">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAdminLoginModalOpen(true)}
                >
                  {t('footer.admin')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAgentLoginModalOpen(true)}
                >
                  {t('footer.agent')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AdminLoginModal open={adminLoginModalOpen} onOpenChange={setAdminLoginModalOpen} />
      <AgentLoginModal open={agentLoginModalOpen} onOpenChange={setAgentLoginModalOpen} />
    </div>
  );
}
