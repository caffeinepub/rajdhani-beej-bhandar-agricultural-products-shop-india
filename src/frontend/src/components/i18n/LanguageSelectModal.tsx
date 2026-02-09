import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES, hasSeenLanguageModal, markLanguageModalSeen } from '../../i18n/i18n';
import { useI18n } from '../../i18n/I18nProvider';

export function LanguageSelectModal() {
  const [open, setOpen] = useState(false);
  const { setLanguage } = useI18n();

  useEffect(() => {
    if (!hasSeenLanguageModal()) {
      setOpen(true);
    }
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code as any);
    markLanguageModalSeen();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Language / अपनी भाषा चुनें</DialogTitle>
          <DialogDescription>
            Choose your preferred language for the best experience
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              onClick={() => handleSelect(lang.code)}
              className="h-auto py-3 flex flex-col items-center gap-1"
            >
              <span className="font-semibold">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
