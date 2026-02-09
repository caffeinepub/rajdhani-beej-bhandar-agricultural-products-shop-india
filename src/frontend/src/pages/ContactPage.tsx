import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, MapPin, Navigation } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { CONTACT_INFO } from '../constants/contact';
import { useState } from 'react';

export default function ContactPage() {
  const { t } = useI18n();
  const [mapError, setMapError] = useState(false);

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('contact.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          Get in touch with us for all your agricultural needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              {t('contact.phone')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold text-foreground">{CONTACT_INFO.shopName}</p>
            <a 
              href={`tel:${CONTACT_INFO.phone}`}
              className="text-primary hover:text-primary/80 text-xl font-medium inline-flex items-center gap-2 hover:underline transition-colors"
            >
              {CONTACT_INFO.phoneFormatted}
            </a>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              {t('contact.address')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-foreground">{CONTACT_INFO.address}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              {t('contact.location')}
            </CardTitle>
            <Button 
              asChild 
              variant="default"
              size="lg"
              className="hidden md:flex gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <a
                href={CONTACT_INFO.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('contact.openMap')} 
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full bg-muted/30">
            <div className="aspect-video w-full">
              {!mapError ? (
                <iframe
                  src={CONTACT_INFO.googleMapsEmbedUrlFallback}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('contact.location')}
                  onError={() => setMapError(true)}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 p-8 text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Map preview unavailable
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {CONTACT_INFO.address}
                  </p>
                  <Button 
                    asChild 
                    variant="default"
                    size="lg"
                    className="gap-2"
                  >
                    <a
                      href={CONTACT_INFO.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-t">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Click the map to interact or use the button to open in Google Maps</span>
              </div>
              <Button 
                asChild 
                variant="default"
                size="lg"
                className="md:hidden gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
              >
                <a
                  href={CONTACT_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('contact.openMap')} 
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
