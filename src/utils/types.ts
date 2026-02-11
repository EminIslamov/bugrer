export type IngredientType = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile?: string;
  image_large?: string;
  __v?: number;
};

export type ConstructorIngredientType = IngredientType & {
  uniqueId: string;
};

export type OrderStatus = 'created' | 'pending' | 'done';

export type Order = {
  _id: string;
  ingredients: string[];
  status: OrderStatus;
  name?: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type RefType<T = Element> = {
  current: T | null;
};
