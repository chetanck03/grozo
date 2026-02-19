import { create } from 'zustand';
import { GroceryItem, GroceryCategory, MealPlan, MyList } from '../types';

interface GroceryStore {
  items: GroceryItem[];
  categories: GroceryCategory[];
  mealPlans: MealPlan[];
  myLists: MyList[];
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
  
  // My Lists
  createMyList: (name: string, color: string) => void;
  deleteMyList: (listId: string) => void;
  addItemToMyList: (listId: string, item: Omit<GroceryItem, 'id' | 'addedAt'>) => void;
  removeItemFromMyList: (listId: string, itemId: string) => void;
  toggleMyListItemComplete: (listId: string, itemId: string) => void;
  
  // Clear all data
  clearAllData: () => void;
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

const listColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f97316'];

const commonSuggestions = [
  'Milk', 'Bread', 'Eggs', 'Bananas', 'Apples', 'Chicken', 'Rice', 'Pasta',
  'Tomatoes', 'Onions', 'Potatoes', 'Cheese', 'Yogurt', 'Butter', 'Salt',
  'Sugar', 'Olive Oil', 'Garlic', 'Carrots', 'Spinach'
];

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  categories: defaultCategories,
  mealPlans: [],
  myLists: [],
  suggestions: commonSuggestions,

  addItem: (item) => set((state) => ({
    items: [...state.items, {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }]
  })),

  addMealPlan: (mealPlan) => set((state) => ({
    mealPlans: [...state.mealPlans, {
      ...mealPlan,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  createMyList: (name, color) => set((state) => ({
    myLists: [...state.myLists, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      items: [],
      createdAt: new Date(),
      color,
    }]
  })),

  deleteMyList: (listId) => set((state) => ({
    myLists: state.myLists.filter(list => list.id !== listId)
  })),

  addItemToMyList: (listId, item) => set((state) => ({
    myLists: state.myLists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: [...list.items, {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              addedAt: new Date(),
            }]
          }
        : list
    )
  })),

  removeItemFromMyList: (listId, itemId) => set((state) => ({
    myLists: state.myLists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter(item => item.id !== itemId)
          }
        : list
    )
  })),

  toggleMyListItemComplete: (listId, itemId) => set((state) => ({
    myLists: state.myLists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
            )
          }
        : list
    )
  })),

  clearAllData: () => set(() => ({
    items: [],
    mealPlans: [],
    myLists: [],
    categories: defaultCategories, // Keep default categories
    suggestions: commonSuggestions, // Keep default suggestions
  })),
}));