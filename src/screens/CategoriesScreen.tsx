import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGroceryStore } from '../store/groceryStore';
import { GroceryItem } from '../components/GroceryItem';
import { RootStackParamList } from '../types';

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { items, categories } = useGroceryStore();

  const getItemsByCategory = (categoryName: string) => {
    return items.filter(item => item.category === categoryName);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-2xl font-bold text-gray-800">
            Categories
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddItem')}
            className="bg-green-500 p-3 rounded-full"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories with Items */}
        {categories.map((category) => {
          const categoryItems = getItemsByCategory(category.name);
          
          return (
            <View key={category.id} className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Text className="text-xl">{category.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-gray-800">
                      {category.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddItem', { category: category.name })}
                  className="p-2"
                >
                  <Ionicons name="add-circle-outline" size={24} color={category.color} />
                </TouchableOpacity>
              </View>

              {categoryItems.length > 0 ? (
                categoryItems.map((item) => (
                  <GroceryItem
                    key={item.id}
                    item={item}
                    onEdit={() => navigation.navigate('EditItem', { item })}
                  />
                ))
              ) : (
                <View className="bg-white rounded-xl p-6 items-center">
                  <Ionicons name="basket-outline" size={48} color="#d1d5db" />
                  <Text className="text-gray-500 mt-2">No items in this category</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddItem', { category: category.name })}
                    className="mt-3 bg-green-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Add First Item</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};