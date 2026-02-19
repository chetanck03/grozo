import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GroceryCategory } from '../types';

interface Props {
  category: GroceryCategory;
  itemCount: number;
  onPress: () => void;
}

export const CategoryCard: React.FC<Props> = ({ category, itemCount, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 shadow-sm mb-3"
      style={{ borderLeftWidth: 4, borderLeftColor: category.color }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Text className="text-2xl">{category.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              {category.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Text 
            className="text-sm font-semibold"
            style={{ color: category.color }}
          >
            {itemCount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};