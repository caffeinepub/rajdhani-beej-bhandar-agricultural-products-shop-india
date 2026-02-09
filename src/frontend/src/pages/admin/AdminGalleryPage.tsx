import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AdminGalleryPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground">Manage your image gallery</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
          <CardDescription>View and organize your store's image collection</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Gallery management functionality will be available in a future update.
              This feature will allow you to organize and display product images in a beautiful gallery layout.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
