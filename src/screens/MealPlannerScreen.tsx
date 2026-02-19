import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGroceryStore } from '../store/groceryStore';
import { RootStackParamList } from '../types';
import { GeminiService } from '../services/geminiService';

type MealPlannerScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const MealPlannerScreen: React.FC = () => {
  const navigation = useNavigation<MealPlannerScreenNavigationProp>();
  const { mealPlans, addMealPlan, generateGroceryListFromMeal } = useGroceryStore();
  
  const [preferences, setPreferences] = useState('');
  const [servings, setServings] = useState('4');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMealPlan = async () => {
    if (!preferences.trim()) {
      Alert.alert('Error', 'Please enter your meal preferences');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await GeminiService.generateMealPlan(preferences, parseInt(servings) || 4);
      
      result.meals.forEach(meal => {
        addMealPlan({
          name: meal.name,
          description: meal.description,
          ingredients: meal.ingredients,
          servings: parseInt(servings) || 4,
        });
      });

      Alert.alert(
        'Success!',
        `Generated ${result.meals.length} meal plans based on your preferences.`
      );
      setPreferences('');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToGroceryList = (mealPlanId: string) => {
    Alert.alert(
      'Add to Grocery List',
      'This will add all ingredients from this meal plan to your grocery list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            generateGroceryListFromMeal(mealPlanId);
            Alert.alert('Success', 'Ingredients added to your grocery list!');
          },
        },
      ]
    );
  };

  const MealPlanCard: React.FC<{ mealPlan: any }> = ({ mealPlan }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{mealPlan.name}</Text>
          <Text className="text-gray-600 mt-1">{mealPlan.description}</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Serves {mealPlan.servings} people
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleAddToGroceryList(mealPlan.id)}
          className="bg-green-500 px-3 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold text-sm">Add to List</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</Text>
        <View className="flex-row flex-wrap">
          {mealPlan.ingredients.map((ingredient: string, index: number) => (
            <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-2">
              <Text className="text-xs text-gray-700">{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">AI Meal Planner</Text>
          <View className="w-6" />
        </View>

        {/* AI Meal Generator */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons name="sparkles" size={24} color="#22c55e" />
            <Text className="text-lg font-bold text-gray-800 ml-2">
              Generate Meal Plan
            </Text>
          </View>
          
          <Text className="text-gray-600 mb-3">
            Tell us your preferences and we'll create a personalized meal plan with grocery list!
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Meal Preferences
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="e.g., vegetarian, low-carb, Italian cuisine, quick meals..."
                value={preferences}
                onChangeText={setPreferences}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Number of Servings
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="4"
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              onPress={handleGenerateMealPlan}
              disabled={isGenerating}
              className={`rounded-xl py-4 ${
                isGenerating ? 'bg-gray-400' : 'bg-green-500'
              }`}
            >
              {isGenerating ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold ml-2">
                    Generating...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Generate Meal Plan
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Existing Meal Plans */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Your Meal Plans ({mealPlans.length})
          </Text>

          {mealPlans.length > 0 ? (
            mealPlans.map((mealPlan) => (
              <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <Ionicons name="restaurant-outline" size={64} color="#d1d5db" />
              <Text className="text-lg font-semibold text-gray-500 mt-4">
                No Meal Plans Yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Generate your first AI-powered meal plan above to get started!
              </Text>
            </View>
          )}
        </View>

        {/* Tips */}
        <View className="bg-blue-50 rounded-xl p-4 mb-8">
          <View className="flex-row items-center mb-2">
            <Ionicons name="bulb" size={20} color="#3b82f6" />
            <Text className="text-blue-800 font-semibold ml-2">Pro Tips</Text>
          </View>
          <Text className="text-blue-700 text-sm">
            • Be specific with your preferences for better results{'\n'}
            • Include dietary restrictions or allergies{'\n'}
            • Mention cooking time preferences (quick, slow-cook, etc.){'\n'}
            • Add ingredients you want to use up
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};