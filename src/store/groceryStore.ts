import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroceryItem, GroceryCategory, MealPlan, MyList } from '../types';

const STORAGE_KEY = '@grozo_store';

// Load persisted state
const loadState = async () => {
  try {
    const persistedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (persistedData) {
      const parsed = JSON.parse(persistedData);
      // Convert date strings back to Date objects
      if (parsed.items) {
        parsed.items = parsed.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
      }
      if (parsed.mealPlans) {
        parsed.mealPlans = parsed.mealPlans.map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt)
        }));
      }
      if (parsed.myLists) {
        parsed.myLists = parsed.myLists.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          items: list.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return null;
};

// Save state to storage
const saveState = async (state: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

interface GroceryStore {
  items: GroceryItem[];
  categories: GroceryCategory[];
  mealPlans: MealPlan[];
  myLists: MyList[];
  suggestions: string[];
  _hydrated: boolean;
  hydrate: () => Promise<void>;
  
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
  { id: '1', name: 'Fruits & Vegetables', icon: 'leaf', color: '#22c55e' },
  { id: '2', name: 'Dairy & Eggs', icon: 'egg', color: '#3b82f6' },
  { id: '3', name: 'Meat & Seafood', icon: 'fish', color: '#ef4444' },
  { id: '4', name: 'Bakery', icon: 'restaurant', color: '#f59e0b' },
  { id: '5', name: 'Pantry', icon: 'cube', color: '#8b5cf6' },
  { id: '6', name: 'Frozen', icon: 'snow', color: '#06b6d4' },
  { id: '7', name: 'Beverages', icon: 'cafe', color: '#10b981' },
  { id: '8', name: 'Snacks', icon: 'fast-food', color: '#f97316' },
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

  // Initialize with persisted data
  _hydrated: false,
  hydrate: async () => {
    const persisted = await loadState();
    if (persisted) {
      set({
        items: persisted.items || [],
        categories: persisted.categories || defaultCategories,
        mealPlans: persisted.mealPlans || [],
        myLists: persisted.myLists || [],
        suggestions: persisted.suggestions || commonSuggestions,
        _hydrated: true,
      });
    } else {
      set({ _hydrated: true });
    }
  },

  addItem: (item) => set((state) => {
    const newState = {
      items: [...state.items, {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date(),
      }]
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  updateItem: (id, updates) => set((state) => {
    const newState = {
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  deleteItem: (id) => set((state) => {
    const newState = {
      items: state.items.filter(item => item.id !== id)
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  toggleItemComplete: (id) => set((state) => {
    const newState = {
      items: state.items.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  addCategory: (category) => set((state) => {
    const newState = {
      categories: [...state.categories, {
        ...category,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }]
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  addMealPlan: (mealPlan) => set((state) => {
    const newState = {
      mealPlans: [...state.mealPlans, {
        ...mealPlan,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      }]
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

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

  createMyList: (name, color) => set((state) => {
    const newState = {
      myLists: [...state.myLists, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        items: [],
        createdAt: new Date(),
        color,
      }]
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  deleteMyList: (listId) => set((state) => {
    const newState = {
      myLists: state.myLists.filter(list => list.id !== listId)
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  addItemToMyList: (listId, item) => set((state) => {
    const newState = {
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
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  removeItemFromMyList: (listId, itemId) => set((state) => {
    const newState = {
      myLists: state.myLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.filter(item => item.id !== itemId)
            }
          : list
      )
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  toggleMyListItemComplete: (listId, itemId) => set((state) => {
    const newState = {
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
    };
    saveState({ ...state, ...newState });
    return newState;
  }),

  clearAllData: () => set(() => {
    const newState = {
      items: [],
      mealPlans: [],
      myLists: [],
      categories: defaultCategories,
      suggestions: commonSuggestions,
    };
    saveState(newState);
    // Also clear from AsyncStorage
    AsyncStorage.removeItem(STORAGE_KEY).catch(err => console.error('Failed to clear storage:', err));
    return newState;
  }),
}));