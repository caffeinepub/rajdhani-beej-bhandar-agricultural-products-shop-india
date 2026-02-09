import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '../../i18n/I18nProvider';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';
import { useGetLandingPageTranslations, useUpdateLandingPageTranslation } from '../../hooks/translations/useLandingPageTranslations';
import { useGetAllProducts } from '../../hooks/products/useProducts';
import { useUpdateProductTranslations } from '../../hooks/translations/useProductTranslations';
import { useGetAboutUs, useUpdateAboutUsTranslation } from '../../hooks/translations/useAboutUsTranslations';
import LoadingState from '../../components/system/LoadingState';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEditTextPage() {
  const { t } = useI18n();

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Text & Translations</h1>
        <p className="text-muted-foreground">Manage site content across all supported languages</p>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="products">Product Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <HeroTranslationEditor />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <AboutUsTranslationEditor />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductTranslationEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroTranslationEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { data: translations, isLoading } = useGetLandingPageTranslations();
  const updateTranslation = useUpdateLandingPageTranslation();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  });

  // Update form when language changes
  React.useEffect(() => {
    if (translations) {
      const titleEntry = translations.heroTitle.entries.find(([lang]) => lang === selectedLanguage);
      const subtitleEntry = translations.heroSubtitle.entries.find(([lang]) => lang === selectedLanguage);
      
      setFormData({
        title: titleEntry?.[1] || (selectedLanguage === 'en' ? 'RAJDHANI BEEJ BHANDAR' : ''),
        subtitle: subtitleEntry?.[1] || (selectedLanguage === 'en' ? 'Trusted Agricultural Products Store' : ''),
      });
    }
  }, [selectedLanguage, translations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTranslation.mutateAsync({
        language: selectedLanguage,
        title: formData.title,
        subtitle: formData.subtitle,
      });
      toast.success('Hero translations updated successfully');
    } catch (error) {
      toast.error('Failed to update translations');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section Translations</CardTitle>
        <CardDescription>Edit the main hero title and subtitle for each language</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Hero Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="RAJDHANI BEEJ BHANDAR"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Hero Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Trusted Agricultural Products Store"
            />
          </div>

          <Button type="submit" disabled={updateTranslation.isPending}>
            {updateTranslation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AboutUsTranslationEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { data: aboutUs, isLoading } = useGetAboutUs();
  const updateAboutUs = useUpdateAboutUsTranslation();
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Update form when language changes
  React.useEffect(() => {
    if (aboutUs) {
      const titleEntry = aboutUs.title.find(([lang]) => lang === selectedLanguage);
      const contentEntry = aboutUs.content.find(([lang]) => lang === selectedLanguage);
      
      setFormData({
        title: titleEntry?.[1] || (selectedLanguage === 'en' ? t('about.title') : ''),
        content: contentEntry?.[1] || (selectedLanguage === 'en' ? t('about.defaultContent') : ''),
      });
    }
  }, [selectedLanguage, aboutUs, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAboutUs.mutateAsync({
        language: selectedLanguage,
        title: formData.title,
        content: formData.content,
      });
      toast.success('About Us translations updated successfully');
    } catch (error) {
      toast.error('Failed to update About Us translations');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Us Translations</CardTitle>
        <CardDescription>Edit the About Us section content for each language</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="aboutLanguage">Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="aboutTitle">About Us Title</Label>
            <Input
              id="aboutTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="About Rajdhani Beej Bhandar"
            />
          </div>

          <div>
            <Label htmlFor="aboutContent">About Us Content</Label>
            <Textarea
              id="aboutContent"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter the About Us content..."
              rows={8}
            />
          </div>

          <Button type="submit" disabled={updateAboutUs.isPending}>
            {updateAboutUs.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProductTranslationEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const updateProductTranslation = useUpdateProductTranslations();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const selectedProduct = products?.find(p => p.id === selectedProductId);

  // Update form when product or language changes
  React.useEffect(() => {
    if (selectedProduct) {
      const nameEntry = selectedProduct.translations.name.entries.find(([lang]) => lang === selectedLanguage);
      const descEntry = selectedProduct.translations.description.entries.find(([lang]) => lang === selectedLanguage);
      
      // Fallback to English if translation doesn't exist
      const englishName = selectedProduct.translations.name.entries.find(([lang]) => lang === 'en')?.[1] || '';
      const englishDesc = selectedProduct.translations.description.entries.find(([lang]) => lang === 'en')?.[1] || '';
      
      setFormData({
        name: nameEntry?.[1] || (selectedLanguage === 'en' ? englishName : ''),
        description: descEntry?.[1] || (selectedLanguage === 'en' ? englishDesc : ''),
      });
    }
  }, [selectedProductId, selectedLanguage, selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }
    try {
      await updateProductTranslation.mutateAsync({
        productId: selectedProductId,
        language: selectedLanguage,
        name: formData.name,
        description: formData.description,
      });
      toast.success('Product translations updated successfully');
    } catch (error) {
      toast.error('Failed to update product translations');
    }
  };

  if (productsLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Translations</CardTitle>
        <CardDescription>Edit product names and descriptions for each language</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="product">Select Product</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => {
                  const englishName = product.translations.name.entries.find(([lang]) => lang === 'en')?.[1] || product.id;
                  return (
                    <SelectItem key={product.id} value={product.id}>
                      {englishName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedProductId && (
            <>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="productDescription">Product Description</Label>
                <Input
                  id="productDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>

              <Button type="submit" disabled={updateProductTranslation.isPending}>
                {updateProductTranslation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
