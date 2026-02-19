// API Configuration
export const API_CONFIG = {
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY', // Replace with your actual Gemini API key
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  
  // Other API endpoints can be added here
  // PRICE_COMPARISON_API: 'your-price-api-endpoint',
  // STORE_LOCATOR_API: 'your-store-locator-endpoint',
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