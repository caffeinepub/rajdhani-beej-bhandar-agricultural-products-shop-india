import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AdminEditImagesPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Images</h1>
        <p className="text-muted-foreground">Manage site images and product photos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Management</CardTitle>
          <CardDescription>Upload and organize images for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Image management functionality will be available in a future update. 
              Currently, you can add product images via the Product Manager by providing image URLs.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
