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

type MealPlannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MealPlanner'>;

export const MealPlannerScreen: React.FC = () => {
  const navigation = useNavigation<MealPlannerScreenNavigationProp>();
  const { mealPlans, addMealPlan, generateGroceryListFromMeal } = useGroceryStore();
  
  const [preferences, setPreferences] = useState('');
  const [servings, setServings] = useState('4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

  // Preset meal preferences
  const dietaryPresets = [
    'Vegetarian', 'Vegan', 'Keto', 'Low-carb', 'Gluten-free', 'Dairy-free'
  ];
  
  const cuisinePresets = [
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'American'
  ];
  
  const mealTypePresets = [
    'Quick meals (30 min)', 'One-pot meals', 'Meal prep friendly', 'Family-friendly', 'Healthy', 'Comfort food'
  ];

  const togglePreset = (preset: string) => {
    setSelectedPresets(prev => {
      if (prev.includes(preset)) {
        return prev.filter(p => p !== preset);
      } else {
        return [...prev, preset];
      }
    });
  };

  const getCombinedPreferences = () => {
    const combined = [...selectedPresets];
    if (preferences.trim()) {
      combined.push(preferences.trim());
    }
    return combined.join(', ');
  };

  const handleGenerateMealPlan = async () => {
    const finalPreferences = getCombinedPreferences();
    
    if (!finalPreferences) {
      Alert.alert('Error', 'Please select preferences or enter your own');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await GeminiService.generateMealPlan(finalPreferences, parseInt(servings) || 4);
      
      for (const meal of result.meals) {
        addMealPlan({
          name: meal.name,
          description: meal.description,
          ingredients: meal.ingredients,
          servings: parseInt(servings) || 4,
        });
      }

      Alert.alert(
        'Success!',
        `Generated ${result.meals.length} meal plans based on your preferences.`
      );
      setPreferences('');
      setSelectedPresets([]);
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
          
          <Text className="text-gray-600 mb-4">
            Tell us your preferences and we'll create a personalized meal plan with grocery list!
          </Text>

          <View className="space-y-6">
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-semibold text-gray-700">
                  Meal Preferences
                </Text>
                {selectedPresets.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSelectedPresets([])}
                    className="px-3 py-1 bg-red-500 rounded-full"
                  >
                    <Text className="text-xs text-white font-medium">Reset All Preferences</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Dietary Preferences */}
              {/* <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-medium text-gray-600">Dietary</Text>
                {selectedPresets.some(p => dietaryPresets.includes(p)) && (
                  <TouchableOpacity
                    onPress={() => setSelectedPresets(prev => prev.filter(p => !dietaryPresets.includes(p)))}
                    className="px-2 py-1 bg-red-100 rounded-full"
                  >
                    <Text className="text-xs text-red-600 font-medium">Reset Dietary</Text>
                  </TouchableOpacity>
                )}
              </View> */}
              <View className="flex-row flex-wrap mb-4">
                {dietaryPresets.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => togglePreset(preset)}
                    className={`px-3 py-2 rounded-full mr-3 mb-3 border-2 ${
                      selectedPresets.includes(preset)
                        ? 'bg-green-500 border-green-600'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedPresets.includes(preset)
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}>
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cuisine Preferences */}
              <Text className="text-xs font-medium text-gray-600 mb-2">Cuisine</Text>
              <View className="flex-row flex-wrap mb-4">
                {cuisinePresets.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => togglePreset(preset)}
                    className={`px-3 py-2 rounded-full mr-3 mb-3 border-2 ${
                      selectedPresets.includes(preset)
                        ? 'bg-blue-500 border-blue-600'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedPresets.includes(preset)
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}>
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Meal Type Preferences */}
              <Text className="text-xs font-medium text-gray-600 mb-2">Meal Type</Text>
              <View className="flex-row flex-wrap mb-4">
                {mealTypePresets.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => togglePreset(preset)}
                    className={`px-3 py-2 rounded-full mr-3 mb-3 border-2 ${
                      selectedPresets.includes(preset)
                        ? 'bg-orange-500 border-orange-600'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedPresets.includes(preset)
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}>
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Preferences */}
              <Text className="text-xs font-medium text-gray-600 mb-2">Additional Preferences (Optional)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 mb-3"
                placeholder="e.g., use chicken, avoid nuts, spicy food..."
                value={preferences}
                onChangeText={setPreferences}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Number of Servings
              </Text>
              <View className="flex-row items-center mb-4">
                {['2', '4', '6', '8'].map((serving) => (
                  <TouchableOpacity
                    key={serving}
                    onPress={() => setServings(serving)}
                    className={`px-4 py-2 rounded-lg mr-4 border-2 ${
                      servings === serving
                        ? 'bg-green-500 border-green-600'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <Text className={`font-medium ${
                      servings === serving
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}>
                      {serving}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TextInput
                  className="bg-gray-50 rounded-lg px-3 py-2 text-gray-800 flex-1 border-2 border-gray-200 ml-2"
                  placeholder="Custom"
                  value={!['2', '4', '6', '8'].includes(servings) ? servings : ''}
                  onChangeText={setServings}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => {
                  setSelectedPresets([]);
                  setPreferences('');
                  setServings('4');
                }}
                className="flex-1 bg-gray-200 rounded-xl py-4 mx-1"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Clear All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleGenerateMealPlan}
                disabled={isGenerating}
                className={`flex-2 rounded-xl py-4 mx-1 ${
                  isGenerating ? 'bg-gray-400' : 'bg-green-500'
                }`}
                style={{ flex: 2 }}
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
      </ScrollView>
    </SafeAreaView>
  );
};