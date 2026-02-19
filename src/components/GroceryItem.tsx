import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GroceryItem as GroceryItemType } from '../types';
import { useGroceryStore } from '../store/groceryStore';

interface Props {
  item: GroceryItemType;
  onEdit?: () => void;
}

export const GroceryItem: React.FC<Props> = ({ item, onEdit }) => {
  const { toggleItemComplete, deleteItem } = useGroceryStore();

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(item.id) },
      ]
    );
  };

  return (
    <View className={`flex-row items-center p-4 bg-white rounded-xl mb-2 shadow-sm ${
      item.isCompleted ? 'opacity-60' : ''
    }`}>
      <TouchableOpacity
        onPress={() => toggleItemComplete(item.id)}
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
          item.isCompleted 
            ? 'bg-green-500 border-green-500' 
            : 'border-gray-300'
        }`}
      >
        {item.isCompleted && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </TouchableOpacity>

      <View className="flex-1">
        <Text className={`text-lg font-semibold ${
          item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
        }`}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-sm text-gray-600 mr-4">
            {item.quantity} {item.unit}
          </Text>
          <View className="bg-green-100 px-2 py-1 rounded-full">
            <Text className="text-xs text-green-700 font-medium">
              {item.category}
            </Text>
          </View>
        </View>
        {item.notes && (
          <Text className="text-sm text-gray-500 mt-1">{item.notes}</Text>
        )}
        {item.price && (
          <Text className="text-sm font-semibold text-green-600 mt-1">
            ${item.price.toFixed(2)}
          </Text>
        )}
      </View>

      <View className="flex-row">
        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            className="p-2 mr-2"
          >
            <Ionicons name="pencil" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleDelete}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};