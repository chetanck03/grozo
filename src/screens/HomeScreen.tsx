import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useGroceryStore } from '../store/groceryStore';
import { GroceryItem } from '../components/GroceryItem';
import { CategoryCard } from '../components/CategoryCard';
import { RootStackParamList, TabParamList } from '../types';
import { GeminiService } from '../services/geminiService';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { items, categories, suggestions, updateSuggestions } = useGroceryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const recentItems = items.slice(-5).reverse();
  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setShowSuggestions(true);
      updateSuggestions(query);
      
      // Get AI suggestions from Gemini
      try {
        const aiSuggestions = await GeminiService.getGrocerySuggestions(
          query, 
          items.map(item => item.name)
        );
        // Update store with AI suggestions
        updateSuggestions(query);
      } catch (error) {
        console.error('Error getting AI suggestions:', error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const getCategoryItemCount = (categoryName: string) => {
    return items.filter(item => item.category === categoryName).length;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              Welcome to Grozo
            </Text>
            <Text className="text-gray-600">
              Smart grocery shopping made easy
            </Text>
          </View>
          <View className="items-center">
            <TouchableOpacity 
              onPress={() => navigation.navigate('MealPlanner', undefined)}
              className="bg-green-500 p-3 rounded-full"
            >
              <Ionicons name="sparkles" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xs text-gray-700 font-semibold mt-1">AI Planner</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="relative mb-6">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Search or add items..."
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg mt-1 z-10 max-h-48">
              <ScrollView nestedScrollEnabled={true}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={`${item}-${index}`}
                    className="px-4 py-3 border-b border-gray-100"
                    onPress={() => {
                      navigation.navigate('AddItem', { category: undefined });
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                  >
                    <Text className="text-gray-800">{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View className="flex-row mb-6">
          <View className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm">
            <Text className="text-2xl font-bold text-green-600">{totalCount}</Text>
            <Text className="text-gray-600">Total Items</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm">
            <Text className="text-2xl font-bold text-blue-600">{completedCount}</Text>
            <Text className="text-gray-600">Completed</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate('AddItem', { category: undefined })}
            className="flex-1 bg-green-500 rounded-xl p-4 mr-2 flex-row items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyLists', undefined)}
            className="flex-1 bg-blue-500 rounded-xl p-4 ml-2 flex-row items-center justify-center"
          >
            <Ionicons name="people" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">My Lists</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Recent Items
            </Text>
            {recentItems.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onEdit={() => navigation.navigate('EditItem', { item })}
              />
            ))}
          </View>
        )}

        {/* Categories */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Categories
          </Text>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              itemCount={getCategoryItemCount(category.name)}
              onPress={() => navigation.navigate('AddItem', { category: category.name })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};