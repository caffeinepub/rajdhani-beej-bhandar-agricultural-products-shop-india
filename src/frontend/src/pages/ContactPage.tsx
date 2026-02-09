import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t('contact.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('contact.location')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2916756447897!2d77.20902931508047!3d28.61393948241943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd371d9e2b1f%3A0x3c1c3e3e3e3e3e3e!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('contact.location')}
            />
          </div>
          <Button asChild variant="outline">
            <a
              href="https://www.google.com/maps/search/agricultural+products+store+near+me"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('contact.openMap')} <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
