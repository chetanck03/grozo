import { GoogleGenAI } from "@google/genai";
import { API_CONFIG } from '../config/api';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({
  apiKey: API_CONFIG.GEMINI_API_KEY
});

export class GeminiService {
  private static async generateContent(prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Using the correct model name
        contents: prompt,
      });
      
      return response.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to empty string if API fails
      return '';
    }
  }

  static async getGrocerySuggestions(query: string, existingItems: string[] = []): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const prompt = `Given the search query "${query}" and existing grocery items [${existingItems.join(', ')}], suggest 5-8 relevant grocery items that would complement this search. Return only the item names, one per line, without numbers or bullets. Focus on common grocery items that people typically buy together.`;

    try {
      const response = await this.generateContent(prompt);
      if (!response) {
        return [];
      }
      
      return response
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0 && !item.match(/^\d+\.?\s/)) // Remove numbered items
        .slice(0, 8);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  static async generateMealPlan(preferences: string, servings: number = 4): Promise<{
    meals: Array<{ name: string; ingredients: string[]; description: string }>;
  }> {
    const prompt = `Create a weekly meal plan for ${servings} people with these preferences: ${preferences}. Return 7 meals in this exact JSON format without any markdown formatting:
{
  "meals": [
    {
      "name": "Meal Name",
      "description": "Brief description",
      "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
    }
  ]
}
Focus on practical, common ingredients that are easy to find in grocery stores.`;

    try {
      const response = await this.generateContent(prompt);
      if (!response) {
        throw new Error('Empty response from API');
      }
      
      // Clean the response more thoroughly
      let cleanedResponse = response
        .replace(/```json\n?/g, '')
        .replace(/\n?```/g, '')
        .replace(/```/g, '')
        .trim();
      
      // Find JSON object in the response
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
      }
      
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // Return fallback meal plan
      return {
        meals: [
          {
            name: "Simple Pasta",
            description: "Quick and easy pasta dish",
            ingredients: ["pasta", "tomato sauce", "cheese", "garlic", "olive oil"]
          },
          {
            name: "Chicken Stir Fry",
            description: "Healthy chicken and vegetable stir fry",
            ingredients: ["chicken breast", "mixed vegetables", "soy sauce", "rice", "ginger"]
          },
          {
            name: "Vegetable Soup",
            description: "Nutritious vegetable soup",
            ingredients: ["mixed vegetables", "vegetable broth", "onion", "garlic", "herbs"]
          }
        ]
      };
    }
  }

  static async categorizeItem(itemName: string): Promise<string> {
    const prompt = `Categorize this grocery item: "${itemName}". Return only one of these categories: Fruits & Vegetables, Dairy & Eggs, Meat & Seafood, Bakery, Pantry, Frozen, Beverages, Snacks`;

    try {
      const response = await this.generateContent(prompt);
      if (!response) {
        return 'Pantry';
      }
      
      const category = response.trim();
      
      const validCategories = [
        'Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Seafood', 
        'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Snacks'
      ];
      
      // Find matching category (case insensitive)
      const matchedCategory = validCategories.find(cat => 
        category.toLowerCase().includes(cat.toLowerCase())
      );
      
      return matchedCategory || 'Pantry';
    } catch (error) {
      console.error('Error categorizing item:', error);
      return 'Pantry';
    }
  }

  static async getShoppingTips(items: string[]): Promise<string[]> {
    if (!items || items.length === 0) {
      return ['Make a shopping list to stay organized', 'Check store flyers for deals'];
    }

    const prompt = `Given this grocery list: [${items.join(', ')}]. Provide 3-5 helpful shopping tips, money-saving advice, or recipe suggestions. Return each tip on a new line without numbers or bullets. Keep tips practical and actionable.`;

    try {
      const response = await this.generateContent(prompt);
      if (!response) {
        return ['Buy seasonal produce for better prices', 'Check store brands for savings'];
      }
      
      return response
        .split('\n')
        .map(tip => tip.trim())
        .filter(tip => tip.length > 0 && !tip.match(/^\d+\.?\s/)) // Remove numbered items
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting shopping tips:', error);
      return ['Buy seasonal produce for better prices', 'Check store brands for savings'];
    }
  }
}