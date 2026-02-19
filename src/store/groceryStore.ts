import { create } from 'zustand';
import { GroceryItem, GroceryCategory, MealPlan, FamilyList } from '../types';

interface GroceryStore {
  items: GroceryItem[];
  categories: GroceryCategory[];
  mealPlans: MealPlan[];
  familyLists: FamilyList[];
  suggestions: string[];
  
  // Actions
  addItem: (item: Omit<GroceryItem, 'id' | 'addedAt'>) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemComplete: (id: string) => void;
  
  // Categories
  addCategory: (category: Omit<GroceryCategory, 'id'>) => void;
  
  // Meal Plans
  addMealPlan: (mealPlan: Omit<MealPlan, 'id' | 'createdAt'>) => void;
  generateGroceryListFromMeal: (mealPlanId: string) => void;
  
  // AI Suggestions
  updateSuggestions: (query: string) => void;
  
  // Family Lists
  createFamilyList: (name: string, createdBy: string) => void;
  addItemToFamilyList: (listId: string, item: Omit<GroceryItem, 'id' | 'addedAt'>) => void;
}

const defaultCategories: GroceryCategory[] = [
  { id: '1', name: 'Fruits & Vegetables', icon: '🥬', color: '#22c55e' },
  { id: '2', name: 'Dairy & Eggs', icon: '🥛', color: '#3b82f6' },
  { id: '3', name: 'Meat & Seafood', icon: '🥩', color: '#ef4444' },
  { id: '4', name: 'Bakery', icon: '🍞', color: '#f59e0b' },
  { id: '5', name: 'Pantry', icon: '🥫', color: '#8b5cf6' },
  { id: '6', name: 'Frozen', icon: '🧊', color: '#06b6d4' },
  { id: '7', name: 'Beverages', icon: '🥤', color: '#10b981' },
  { id: '8', name: 'Snacks', icon: '🍿', color: '#f97316' },
];

const commonSuggestions = [
  'Milk', 'Bread', 'Eggs', 'Bananas', 'Apples', 'Chicken', 'Rice', 'Pasta',
  'Tomatoes', 'Onions', 'Potatoes', 'Cheese', 'Yogurt', 'Butter', 'Salt',
  'Sugar', 'Olive Oil', 'Garlic', 'Carrots', 'Spinach'
];

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  categories: defaultCategories,
  mealPlans: [],
  familyLists: [],
  suggestions: commonSuggestions,

  addItem: (item) => set((state) => ({
    items: [...state.items, {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date(),
    }]
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  toggleItemComplete: (id) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    )
  })),

  addCategory: (category) => set((state) => ({
    categories: [...state.categories, {
      ...category,
      id: Date.now().toString(),
    }]
  })),

  addMealPlan: (mealPlan) => set((state) => ({
    mealPlans: [...state.mealPlans, {
      ...mealPlan,
      id: Date.now().toString(),
      createdAt: new Date(),
    }]
  })),

  generateGroceryListFromMeal: (mealPlanId) => {
    const mealPlan = get().mealPlans.find(plan => plan.id === mealPlanId);
    if (mealPlan) {
      const newItems = mealPlan.ingredients.map(ingredient => ({
        name: ingredient,
        quantity: 1,
        unit: 'piece',
        category: 'Pantry',
        isCompleted: false,
      }));
      
      newItems.forEach(item => get().addItem(item));
    }
  },

  updateSuggestions: (query) => {
    if (query.length < 2) return;
    
    const filtered = commonSuggestions.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    
    // Add AI-powered suggestions here (integrate with Gemini API)
    set({ suggestions: filtered });
  },

  createFamilyList: (name, createdBy) => set((state) => ({
    familyLists: [...state.familyLists, {
      id: Date.now().toString(),
      name,
      members: [createdBy],
      items: [],
      createdBy,
      createdAt: new Date(),
    }]
  })),

  addItemToFamilyList: (listId, item) => set((state) => ({
    familyLists: state.familyLists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: [...list.items, {
              ...item,
              id: Date.now().toString(),
              addedAt: new Date(),
            }]
          }
        : list
    )
  })),
}));