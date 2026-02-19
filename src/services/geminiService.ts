import { API_CONFIG } from '../config/api';

// Gemini AI Service for smart suggestions and meal planning
const GEMINI_API_KEY = API_CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = API_CONFIG.GEMINI_API_URL;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return '';
    }
  }

  static async getGrocerySuggestions(query: string, existingItems: string[] = []): Promise<string[]> {
    const prompt = `
      Given the search query "${query}" and existing grocery items [${existingItems.join(', ')}], 
      suggest 5-8 relevant grocery items that would complement this search. 
      Return only the item names, one per line, without numbers or bullets.
      Focus on common grocery items that people typically buy together.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return response
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, 8);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  static async generateMealPlan(preferences: string, servings: number = 4): Promise<{
    meals: Array<{ name: string; ingredients: string[]; description: string }>;
  }> {
    const prompt = `
      Create a weekly meal plan for ${servings} people with these preferences: ${preferences}.
      Return 7 meals in this exact JSON format:
      {
        "meals": [
          {
            "name": "Meal Name",
            "description": "Brief description",
            "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
          }
        ]
      }
      Focus on practical, common ingredients that are easy to find in grocery stores.
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return {
        meals: [
          {
            name: "Simple Pasta",
            description: "Quick and easy pasta dish",
            ingredients: ["pasta", "tomato sauce", "cheese", "garlic", "olive oil"]
          }
        ]
      };
    }
  }

  static async categorizeItem(itemName: string): Promise<string> {
    const prompt = `
      Categorize this grocery item: "${itemName}"
      Return only one of these categories:
      - Fruits & Vegetables
      - Dairy & Eggs  
      - Meat & Seafood
      - Bakery
      - Pantry
      - Frozen
      - Beverages
      - Snacks
    `;

    try {
      const response = await this.makeRequest(prompt);
      const category = response.trim();
      
      const validCategories = [
        'Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Seafood', 
        'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Snacks'
      ];
      
      return validCategories.includes(category) ? category : 'Pantry';
    } catch (error) {
      console.error('Error categorizing item:', error);
      return 'Pantry';
    }
  }

  static async getShoppingTips(items: string[]): Promise<string[]> {
    const prompt = `
      Given this grocery list: [${items.join(', ')}]
      Provide 3-5 helpful shopping tips, money-saving advice, or recipe suggestions.
      Return each tip on a new line without numbers or bullets.
      Keep tips practical and actionable.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return response
        .split('\n')
        .map(tip => tip.trim())
        .filter(tip => tip.length > 0)
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting shopping tips:', error);
      return ['Buy seasonal produce for better prices', 'Check store brands for savings'];
    }
  }
}