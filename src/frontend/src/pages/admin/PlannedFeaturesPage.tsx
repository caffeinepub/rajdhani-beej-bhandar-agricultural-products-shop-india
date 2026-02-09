import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

export default function PlannedFeaturesPage() {
  const phase2Features = [
    {
      title: 'Multilingual Content Editing',
      description: 'Admin can edit website content in all supported languages (Hindi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Punjabi, Bengali)',
      category: 'Admin Tools',
    },
    {
      title: 'Full Website WYSIWYG Editor',
      description: 'Admin can edit any text, image, banner, icon, button, spacing, and section on the website without coding',
      category: 'Admin Tools',
    },
    {
      title: 'Bulk Order / Dealer Enquiry Workflow',
      description: 'Complete bulk order submission form with separate admin management section for dealer enquiries',
      category: 'Orders',
    },
    {
      title: 'Before/After Photo Gallery',
      description: 'Home page photo gallery showing product results with admin controls to add, delete, and edit captions',
      category: 'Content',
    },
    {
      title: 'AI Chatbot',
      description: 'Multilingual AI chatbot that answers product queries, guides ordering, suggests products, with admin-trainable knowledge base',
      category: 'Customer Support',
    },
    {
      title: 'Enhanced SEO & Performance',
      description: 'Advanced SEO optimization, performance tuning, and production-ready polish',
      category: 'Technical',
    },
    {
      title: 'Product Image Upload',
      description: 'Direct image upload functionality instead of URL-based images',
      category: 'Products',
    },
    {
      title: 'Bulk Price Management',
      description: 'Support for bulk order pricing tiers and dealer-specific pricing',
      category: 'Products',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Planned Features (Phase 2)</h1>
        <p className="text-muted-foreground">
          These features will be implemented in the next phase to create a fully professional, production-ready application.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {phase2Features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </div>
                <Badge variant="outline">{feature.category}</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-muted/50">
        <CardHeader>
          <CardTitle>Phase 1 Complete ✓</CardTitle>
          <CardDescription>
            The current version includes: multilingual UI with language selection, admin authentication, product catalog management (6 categories), product browsing and detail views, website checkout and WhatsApp ordering, admin order management, Google Maps integration, and robust error handling.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
