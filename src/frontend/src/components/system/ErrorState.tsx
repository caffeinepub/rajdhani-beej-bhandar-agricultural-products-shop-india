import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = 'Error', message, onRetry }: ErrorStateProps) {
  return (
    <div className="py-12">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">{message}</AlertDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
            Retry
          </Button>
        )}
      </Alert>
    </div>
  );
}
