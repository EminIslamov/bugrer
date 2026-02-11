import type { IngredientType, Order, OrderStatus } from './types';

const isIngredient = (value: IngredientType | undefined): value is IngredientType =>
  Boolean(value);

export const buildIngredientsMap = (
  ingredients: IngredientType[]
): Map<string, IngredientType> => new Map(ingredients.map((item) => [item._id, item]));

export const getOrderIngredients = (
  order: Order,
  ingredientsById: Map<string, IngredientType>
): IngredientType[] =>
  order.ingredients.map((id) => ingredientsById.get(id)).filter(isIngredient);

export const getOrderIngredientCounts = (
  order: Order,
  ingredientsById: Map<string, IngredientType>
): { ingredient: IngredientType; count: number }[] => {
  const counts = new Map<string, { ingredient: IngredientType; count: number }>();

  order.ingredients.forEach((id) => {
    const ingredient = ingredientsById.get(id);
    if (!ingredient) return;
    const existing = counts.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(id, { ingredient, count: 1 });
    }
  });

  return Array.from(counts.values());
};

export const getOrderTotal = (
  order: Order,
  ingredientsById: Map<string, IngredientType>
): number =>
  getOrderIngredients(order, ingredientsById).reduce((sum, item) => sum + item.price, 0);

export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'done':
      return 'Выполнен';
    case 'pending':
      return 'Готовится';
    case 'created':
      return 'Создан';
    default:
      return 'Неизвестно';
  }
};

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
