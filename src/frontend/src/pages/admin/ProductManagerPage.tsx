import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllProducts } from '../../hooks/products/useProducts';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/products/useProductMutations';
import { ALLOWED_CATEGORIES } from '../../constants/categories';
import { useI18n } from '../../i18n/I18nProvider';
import LoadingState from '../../components/system/LoadingState';
import ErrorState from '../../components/system/ErrorState';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import type { ProductInput, Category } from '../../backend';
import { validateRequired, validatePrice, validateStock } from '../../utils/validation';

// Local type for product with language-aware fields
type ProductWithTranslations = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: bigint;
  stock: bigint;
  category: Category;
  createdAt: bigint;
  minimumOrderQuantity: bigint;
  translations: {
    name: { entries: Array<[string, string]> };
    description: { entries: Array<[string, string]> };
  };
};

export default function ProductManagerPage() {
  const { t } = useI18n();
  const { data: products, isLoading, error, refetch } = useGetAllProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithTranslations | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: ProductWithTranslations) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorState message="Failed to load products" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('admin.products')}</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!products || products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No products yet. Add your first product!
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t(`category.${product.category}`)}</Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toString()}</TableCell>
                    <TableCell>{product.stock.toString()}</TableCell>
                    <TableCell>{product.minimumOrderQuantity.toString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm product={editingProduct} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeleteProductButton({ productId }: { productId: string }) {
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await deleteProduct.mutateAsync(productId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={deleteProduct.isPending}
    >
      {deleteProduct.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}

function ProductForm({ product, onClose }: { product: ProductWithTranslations | null; onClose: () => void }) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || ('' as Category),
    price: product?.price.toString() || '',
    stock: product?.stock.toString() || '',
    minimumOrderQuantity: product?.minimumOrderQuantity.toString() || '1',
    images: product?.images.join('\n') || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!product) {
      const idError = validateRequired(formData.id, 'Product ID');
      if (idError) newErrors.id = idError;
    }

    const nameError = validateRequired(formData.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const descError = validateRequired(formData.description, 'Description');
    if (descError) newErrors.description = descError;

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    const priceError = validatePrice(formData.price);
    if (priceError) newErrors.price = priceError;

    const stockError = validateStock(formData.stock);
    if (stockError) newErrors.stock = stockError;

    const minOrderError = validateStock(formData.minimumOrderQuantity);
    if (minOrderError) newErrors.minimumOrderQuantity = minOrderError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData: ProductInput = {
      id: product?.id || formData.id,
      translations: {
        name: [['en', formData.name]],
        description: [['en', formData.description]],
      },
      category: formData.category,
      price: BigInt(Math.round(parseFloat(formData.price))),
      stock: BigInt(parseInt(formData.stock, 10)),
      minimumOrderQuantity: BigInt(parseInt(formData.minimumOrderQuantity, 10)),
      images: formData.images.split('\n').filter(url => url.trim() !== ''),
      createdAt: product?.createdAt || BigInt(Date.now() * 1000000),
    };

    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, product: productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!product && (
        <div>
          <Label htmlFor="id">Product ID *</Label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            className={errors.id ? 'border-destructive' : ''}
            placeholder="unique-product-id"
          />
          {errors.id && <p className="text-sm text-destructive mt-1">{errors.id}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {ALLOWED_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className={errors.price ? 'border-destructive' : ''}
          />
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className={errors.stock ? 'border-destructive' : ''}
          />
          {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock}</p>}
        </div>

        <div>
          <Label htmlFor="minimumOrderQuantity">Min Order *</Label>
          <Input
            id="minimumOrderQuantity"
            type="number"
            value={formData.minimumOrderQuantity}
            onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)}
            className={errors.minimumOrderQuantity ? 'border-destructive' : ''}
          />
          {errors.minimumOrderQuantity && (
            <p className="text-sm text-destructive mt-1">{errors.minimumOrderQuantity}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={errors.description ? 'border-destructive' : ''}
          rows={4}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
      </div>

      <div>
        <Label htmlFor="images">Image URLs (one per line)</Label>
        <Textarea
          id="images"
          value={formData.images}
          onChange={(e) => handleChange('images', e.target.value)}
          rows={4}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
