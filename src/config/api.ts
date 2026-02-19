// API Configuration
export const API_CONFIG = {
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '', // Get from environment variables
};

// App Configuration
export const APP_CONFIG = {
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_UNITS: ['piece', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'cup', 'tbsp', 'tsp', 'pack', 'bottle', 'can'],
  MAX_SUGGESTIONS: 8,
  NOTIFICATION_CHANNELS: {
    LOW_STOCK: 'low_stock_alerts',
    REMINDERS: 'shopping_reminders',
    MEAL_PLANNING: 'meal_planning',
  },
};

// Feature Flags
export const FEATURES = {
  AI_SUGGESTIONS: true,
  MEAL_PLANNER: true,
  FAMILY_LISTS: true,
  PRICE_COMPARISON: true,
  NOTIFICATIONS: true,
  OFFLINE_MODE: false, // Future feature
};