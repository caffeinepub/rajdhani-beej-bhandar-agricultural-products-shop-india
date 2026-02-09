import { ProductType } from '../backend';

export function getProductTypeLabel(productType: ProductType): string {
  switch (productType) {
    case ProductType.agriProduct:
      return 'Agri product';
    case ProductType.machine:
      return 'Machine';
    case ProductType.kitchenGarden:
      return 'Kitchen Garden';
    default:
      return 'Unknown';
  }
}

export function getCategoryProductType(category: string): ProductType {
  if (category === 'machine') {
    return ProductType.machine;
  } else if (category === 'kitchenGarden') {
    return ProductType.kitchenGarden;
  }
  return ProductType.agriProduct;
}
