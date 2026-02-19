export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isCompleted: boolean;
  price?: number;
  notes?: string;
  addedAt: Date;
  lowStockThreshold?: number;
}

export interface GroceryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  servings: number;
  createdAt: Date;
}

export interface FamilyList {
  id: string;
  name: string;
  members: string[];
  items: GroceryItem[];
  createdBy: string;
  createdAt: Date;
}

export type RootStackParamList = {
  MainTabs: undefined;
  AddItem: { category?: string };
  EditItem: { item: GroceryItem };
  MealPlanner: undefined;
  FamilyLists: undefined;
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Lists: undefined;
  Profile: undefined;
};