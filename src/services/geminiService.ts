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
    // Check for dietary restrictions
    const isVegetarian = preferences.toLowerCase().includes('vegetarian') && !preferences.toLowerCase().includes('vegan');
    const isVegan = preferences.toLowerCase().includes('vegan');
    const isKeto = preferences.toLowerCase().includes('keto');
    const isGlutenFree = preferences.toLowerCase().includes('gluten-free') || preferences.toLowerCase().includes('gluten free');
    const isDairyFree = preferences.toLowerCase().includes('dairy-free') || preferences.toLowerCase().includes('dairy free');
    
    let dietaryRestriction = '';
    if (isVegan) {
      dietaryRestriction = 'STRICTLY VEGAN - NO animal products whatsoever (no meat, fish, dairy, eggs, honey, or any animal-derived ingredients)';
    } else if (isVegetarian) {
      dietaryRestriction = 'STRICTLY VEGETARIAN - NO meat, fish, or seafood. Dairy and eggs are allowed.';
    }
    
    if (isKeto) {
      dietaryRestriction += (dietaryRestriction ? ' AND ' : '') + 'KETO - Low carb, high fat. NO grains, NO sugar, NO starchy vegetables (potatoes, corn). Focus on meat, fish, eggs, cheese, avocados, nuts.';
    }
    
    if (isGlutenFree) {
      dietaryRestriction += (dietaryRestriction ? ' AND ' : '') + 'GLUTEN-FREE - NO wheat, barley, rye, or any gluten-containing ingredients. Use rice, quinoa, or gluten-free alternatives.';
    }
    
    if (isDairyFree) {
      dietaryRestriction += (dietaryRestriction ? ' AND ' : '') + 'DAIRY-FREE - NO milk, cheese, butter, cream, yogurt, or any dairy products.';
    }
    
    const prompt = `Create a weekly meal plan for ${servings} people with these preferences: ${preferences}.

${dietaryRestriction ? `IMPORTANT DIETARY RESTRICTION: ${dietaryRestriction}

` : `DIETARY TYPE: No restrictions - You CAN include meat, chicken, fish, seafood, dairy, and all other ingredients.

`}
CRITICAL RULES:
${isVegetarian || isVegan ? '- You MUST NOT include ANY meat, chicken, beef, pork, fish, seafood, or any animal flesh\n' : (!isVegetarian && !isVegan ? '- You CAN include meat, chicken, beef, pork, fish, seafood, and other animal products\n' : '')}${isVegan ? '- You MUST NOT include ANY dairy products (milk, cheese, butter, cream), eggs, or honey\n' : ''}${isKeto ? '- You MUST NOT include ANY grains, sugar, bread, pasta, rice, potatoes, or high-carb foods\n' : ''}${isGlutenFree ? '- You MUST NOT include ANY wheat, barley, rye, or gluten-containing ingredients\n' : ''}${isDairyFree ? '- You MUST NOT include ANY milk, cheese, butter, cream, yogurt, or dairy products\n' : ''}- Every single ingredient MUST comply with the dietary restrictions above
- Double-check each ingredient before including it
- If you're unsure about an ingredient, exclude it

Return 7 meals in this exact JSON format without any markdown formatting:
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
      // Return fallback meal plan based on dietary preferences
      const isVegetarian = preferences.toLowerCase().includes('vegetarian') && !preferences.toLowerCase().includes('vegan');
      const isVegan = preferences.toLowerCase().includes('vegan');
      
      if (isVegan) {
        return {
          meals: [
            {
              name: "Vegan Buddha Bowl",
              description: "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing",
              ingredients: ["quinoa", "sweet potato", "chickpeas", "kale", "tahini", "lemon", "olive oil"]
            },
            {
              name: "Vegan Lentil Curry",
              description: "Hearty and flavorful lentil curry with coconut milk",
              ingredients: ["red lentils", "coconut milk", "onion", "garlic", "curry powder", "tomatoes", "rice"]
            },
            {
              name: "Vegan Pasta Primavera",
              description: "Fresh vegetable pasta with garlic and olive oil",
              ingredients: ["pasta", "bell peppers", "zucchini", "cherry tomatoes", "garlic", "olive oil", "basil"]
            }
          ]
        };
      } else if (isVegetarian) {
        return {
          meals: [
            {
              name: "Vegetable Stir Fry with Tofu",
              description: "Colorful vegetable stir fry with crispy tofu",
              ingredients: ["tofu", "broccoli", "bell peppers", "carrots", "soy sauce", "ginger", "rice"]
            },
            {
              name: "Cheese Quesadillas",
              description: "Crispy quesadillas with melted cheese and vegetables",
              ingredients: ["tortillas", "cheddar cheese", "bell peppers", "onion", "sour cream", "salsa"]
            },
            {
              name: "Vegetable Pasta Bake",
              description: "Baked pasta with vegetables and cheese",
              ingredients: ["pasta", "mozzarella cheese", "tomato sauce", "zucchini", "spinach", "garlic"]
            }
          ]
        };
      } else {
        // Non-vegetarian fallback
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