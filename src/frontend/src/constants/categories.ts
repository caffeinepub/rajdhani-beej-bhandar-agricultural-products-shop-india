import { Category } from '../backend';

export const ALLOWED_CATEGORIES: { value: Category; label: string }[] = [
  { value: Category.pesticide, label: 'Pesticides' },
  { value: Category.herbicide, label: 'Herbicides' },
  { value: Category.insecticide, label: 'Insecticides' },
  { value: Category.fungicide, label: 'Fungicides' },
  { value: Category.plantGrowthRegulator, label: 'Plant Growth Regulators (PGR)' },
  { value: Category.seed, label: 'Seeds' },
  { value: Category.machine, label: 'Agriculture Machines' },
  { value: Category.kitchenGarden, label: 'Organic Home Kitchen Garden' },
];

export function getCategoryLabel(category: Category): string {
  return ALLOWED_CATEGORIES.find(c => c.value === category)?.label || category;
}

export function getCategoryTranslationKey(category: Category): string {
  return `category.${category}`;
}
