import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { useGetReferenceWebsite, useSaveReferenceWebsite } from '../../hooks/admin/useReferenceWebsite';
import { toast } from 'sonner';
import LoadingState from '../../components/system/LoadingState';
import ErrorState from '../../components/system/ErrorState';

export default function ReferenceWebsitePage() {
  const navigate = useNavigate();
  const { data: referenceWebsite, isLoading, error, refetch } = useGetReferenceWebsite();
  const saveMutation = useSaveReferenceWebsite();

  const [url, setUrl] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (referenceWebsite) {
      setUrl(referenceWebsite.url);
      setDesignNotes(referenceWebsite.designNotes || '');
      setIsEditing(false);
    } else if (!isLoading) {
      setIsEditing(true);
    }
  }, [referenceWebsite, isLoading]);

  const handleSave = async () => {
    if (!url.trim()) {
      toast.error('URL is required');
      return;
    }

    try {
      await saveMutation.mutateAsync({
        url: url.trim(),
        designNotes: designNotes.trim() || undefined,
      });
      toast.success('Reference website saved successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to save reference website:', error);
      toast.error(error.message || 'Failed to save reference website');
    }
  };

  const handleCancel = () => {
    if (referenceWebsite) {
      setUrl(referenceWebsite.url);
      setDesignNotes(referenceWebsite.designNotes || '');
      setIsEditing(false);
    } else {
      navigate({ to: '/admin' });
    }
  };

  const handleOpenLink = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading reference website..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load reference website"
        message={error instanceof Error ? error.message : 'An error occurred'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/admin' })} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Reference Website</h1>
        <p className="text-muted-foreground">
          Save a reference website URL and design notes for future reference
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Reference</CardTitle>
          <CardDescription>
            Store a URL and optional notes about design inspiration or reference materials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEditing && referenceWebsite ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Website URL</Label>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 p-3 bg-muted rounded-md break-all">
                    {referenceWebsite.url}
                  </div>
                  <Button onClick={handleOpenLink} variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {referenceWebsite.designNotes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Design Notes</Label>
                  <div className="mt-2 p-3 bg-muted rounded-md whitespace-pre-wrap">
                    {referenceWebsite.designNotes}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">
                  Website URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={saveMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designNotes">Design Notes (Optional)</Label>
                <Textarea
                  id="designNotes"
                  placeholder="Add any design notes, color schemes, layout ideas, or other observations..."
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  rows={6}
                  disabled={saveMutation.isPending}
                />
              </div>

              {url && (
                <Alert>
                  <ExternalLink className="h-4 w-4" />
                  <AlertDescription>
                    <button
                      onClick={handleOpenLink}
                      className="text-primary hover:underline font-medium"
                    >
                      Open link in new tab
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saveMutation.isPending || !url.trim()}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saveMutation.isPending}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
