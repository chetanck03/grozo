import { GroceryItem } from '../types';
import { GeminiService } from './geminiService';

export interface PriceComparison {
  store: string;
  price: number;
  distance: string;
  rating: number;
}

export interface ShoppingTip {
  id: string;
  title: string;
  description: string;
  category: 'savings' | 'health' | 'convenience' | 'recipe';
  icon: string;
}

export class ShoppingService {
  // Mock price comparison data - in a real app, this would connect to store APIs
  private static mockStores = [
    { name: 'Walmart', baseMultiplier: 0.85, rating: 4.2 },
    { name: 'Target', baseMultiplier: 1.1, rating: 4.5 },
    { name: 'Kroger', baseMultiplier: 0.95, rating: 4.3 },
    { name: 'Whole Foods', baseMultiplier: 1.4, rating: 4.6 },
    { name: 'Costco', baseMultiplier: 0.75, rating: 4.4 },
  ];

  static async getPriceComparisons(item: GroceryItem): Promise<PriceComparison[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const basePrice = item.price || this.estimatePrice(item.name, item.category);
    
    return this.mockStores.map(store => ({
      store: store.name,
      price: Math.round((basePrice * store.baseMultiplier) * 100) / 100,
      distance: `${Math.random() * 5 + 0.5}`.substring(0, 3) + ' mi',
      rating: store.rating,
    })).sort((a, b) => a.price - b.price);
  }

  private static estimatePrice(itemName: string, category: string): number {
    // Simple price estimation based on category and item name
    const basePrices: { [key: string]: number } = {
      'Fruits & Vegetables': 2.5,
      'Dairy & Eggs': 3.5,
      'Meat & Seafood': 8.0,
      'Bakery': 3.0,
      'Pantry': 2.0,
      'Frozen': 4.0,
      'Beverages': 2.5,
      'Snacks': 3.5,
    };

    const basePrice = basePrices[category] || 3.0;
    
    // Add some variation based on item name length (rough complexity indicator)
    const variation = (itemName.length % 5) * 0.5;
    
    return Math.round((basePrice + variation) * 100) / 100;
  }

  static async getShoppingTips(items: GroceryItem[]): Promise<ShoppingTip[]> {
    const tips: ShoppingTip[] = [];
    
    // Generate AI-powered tips using Gemini
    try {
      const itemNames = items.map(item => item.name);
      const aiTips = await GeminiService.getShoppingTips(itemNames);
      
      aiTips.forEach((tip, index) => {
        tips.push({
          id: `ai-${index}`,
          title: 'AI Suggestion',
          description: tip,
          category: 'savings',
          icon: '🤖',
        });
      });
    } catch (error) {
      console.error('Error getting AI tips:', error);
    }

    // Add category-specific tips
    const categories = [...new Set(items.map(item => item.category))];
    
    categories.forEach(category => {
      const categoryTips = this.getCategoryTips(category);
      tips.push(...categoryTips);
    });

    // Add general shopping tips
    tips.push(...this.getGeneralTips(items));

    return tips.slice(0, 8); // Limit to 8 tips
  }

  private static getCategoryTips(category: string): ShoppingTip[] {
    const categoryTipMap: { [key: string]: ShoppingTip[] } = {
      'Fruits & Vegetables': [
        {
          id: 'produce-1',
          title: 'Buy Seasonal Produce',
          description: 'Seasonal fruits and vegetables are fresher and more affordable',
          category: 'savings',
          icon: '🍎',
        },
        {
          id: 'produce-2',
          title: 'Check for Ripeness',
          description: 'Buy fruits at different ripeness stages to enjoy them throughout the week',
          category: 'convenience',
          icon: '🥑',
        },
      ],
      'Dairy & Eggs': [
        {
          id: 'dairy-1',
          title: 'Check Expiration Dates',
          description: 'Look for the furthest expiration date, especially for milk and yogurt',
          category: 'convenience',
          icon: '🥛',
        },
      ],
      'Meat & Seafood': [
        {
          id: 'meat-1',
          title: 'Buy in Bulk and Freeze',
          description: 'Purchase larger quantities when on sale and freeze portions',
          category: 'savings',
          icon: '🥩',
        },
      ],
    };

    return categoryTipMap[category] || [];
  }

  private static getGeneralTips(items: GroceryItem[]): ShoppingTip[] {
    const tips: ShoppingTip[] = [
      {
        id: 'general-1',
        title: 'Shop the Perimeter',
        description: 'Fresh foods are usually located around the store perimeter',
        category: 'health',
        icon: '🏪',
      },
      {
        id: 'general-2',
        title: 'Use Store Apps',
        description: 'Download store apps for exclusive coupons and deals',
        category: 'savings',
        icon: '📱',
      },
      {
        id: 'general-3',
        title: 'Make a Meal Plan',
        description: 'Planning meals reduces food waste and saves money',
        category: 'convenience',
        icon: '📝',
      },
    ];

    // Add specific tips based on list size
    if (items.length > 20) {
      tips.push({
        id: 'large-list',
        title: 'Organize by Store Layout',
        description: 'Group items by store sections to shop more efficiently',
        category: 'convenience',
        icon: '🗺️',
      });
    }

    if (items.some(item => item.price && item.price > 10)) {
      tips.push({
        id: 'expensive-items',
        title: 'Compare Unit Prices',
        description: 'Check price per unit for expensive items to get the best deal',
        category: 'savings',
        icon: '💰',
      });
    }

    return tips;
  }

  static calculateTotalEstimate(items: GroceryItem[]): {
    total: number;
    breakdown: { [category: string]: number };
  } {
    const breakdown: { [category: string]: number } = {};
    let total = 0;

    items.forEach(item => {
      const price = item.price || this.estimatePrice(item.name, item.category);
      const itemTotal = price * item.quantity;
      
      total += itemTotal;
      breakdown[item.category] = (breakdown[item.category] || 0) + itemTotal;
    });

    return {
      total: Math.round(total * 100) / 100,
      breakdown: Object.fromEntries(
        Object.entries(breakdown).map(([category, amount]) => [
          category,
          Math.round(amount * 100) / 100
        ])
      ),
    };
  }

  static generateShoppingRoute(items: GroceryItem[]): {
    category: string;
    items: GroceryItem[];
    order: number;
  }[] {
    // Typical store layout order
    const storeOrder = [
      'Fruits & Vegetables',
      'Bakery',
      'Dairy & Eggs',
      'Meat & Seafood',
      'Frozen',
      'Pantry',
      'Beverages',
      'Snacks',
    ];

    const groupedItems: { [category: string]: GroceryItem[] } = {};
    
    items.forEach(item => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });

    return storeOrder
      .filter(category => groupedItems[category])
      .map((category, index) => ({
        category,
        items: groupedItems[category],
        order: index + 1,
      }));
  }
}