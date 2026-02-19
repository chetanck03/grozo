import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useGroceryStore } from '../store/groceryStore';
import { RootStackParamList } from '../types';

type EditItemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditItem'>;
type EditItemScreenRouteProp = RouteProp<RootStackParamList, 'EditItem'>;

const units = ['piece', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'cup', 'tbsp', 'tsp', 'pack', 'bottle', 'can'];

export const EditItemScreen: React.FC = () => {
  const navigation = useNavigation<EditItemScreenNavigationProp>();
  const route = useRoute<EditItemScreenRouteProp>();
  const { updateItem, categories } = useGroceryStore();

  const { item } = route.params;

  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [selectedUnit, setSelectedUnit] = useState(item.unit);
  const [selectedCategory, setSelectedCategory] = useState(item.category);
  const [price, setPrice] = useState(item.price?.toString() || '');
  const [notes, setNotes] = useState(item.notes || '');
  const [lowStockThreshold, setLowStockThreshold] = useState(item.lowStockThreshold?.toString() || '');
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const updates = {
      name: name.trim(),
      quantity: parseInt(quantity) || 1,
      unit: selectedUnit,
      category: selectedCategory,
      price: price ? parseFloat(price) : undefined,
      notes: notes.trim() || undefined,
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
      isCompleted,
    };

    updateItem(item.id, updates);
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Edit Item</Text>
          <View className="w-6" />
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Item Name */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Item Name *</Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-gray-800 shadow-sm"
              placeholder="Enter item name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Quantity and Unit */}
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Quantity</Text>
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-gray-800 shadow-sm"
                placeholder="1"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Unit</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="bg-white rounded-xl shadow-sm"
              >
                <View className="flex-row p-2">
                  {units.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setSelectedUnit(unit)}
                      className={`px-3 py-2 rounded-lg mr-2 ${
                        selectedUnit === unit 
                          ? 'bg-green-500' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        selectedUnit === unit 
                          ? 'text-white' 
                          : 'text-gray-700'
                      }`}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Category */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="bg-white rounded-xl shadow-sm"
            >
              <View className="flex-row p-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategory(category.name)}
                    className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${
                      selectedCategory === category.name 
                        ? 'bg-green-500' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text className="text-lg mr-2">{category.icon}</Text>
                    <Text className={`text-sm font-medium ${
                      selectedCategory === category.name 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }`}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Price */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Price (Optional)</Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-gray-800 shadow-sm"
              placeholder="0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Low Stock Threshold */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Low Stock Alert (Optional)</Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-gray-800 shadow-sm"
              placeholder="Notify when quantity is below..."
              value={lowStockThreshold}
              onChangeText={setLowStockThreshold}
              keyboardType="numeric"
            />
          </View>

          {/* Notes */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-gray-800 shadow-sm"
              placeholder="Add any notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Item Status */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Item Status</Text>
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setIsCompleted(false)}
                  className={`flex-1 items-center justify-center py-3 px-4 rounded-lg ${
                    !isCompleted ? 'bg-orange-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`font-medium ${
                    !isCompleted ? 'text-white' : 'text-gray-600'
                  }`}>
                    Pending
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setIsCompleted(true)}
                  className={`flex-1 items-center justify-center py-3 px-4 rounded-lg ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`font-medium ${
                    isCompleted ? 'text-white' : 'text-gray-600'
                  }`}>
                    Completed
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-3">
                Added on {item.addedAt.toLocaleDateString()} at {item.addedAt.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 rounded-xl py-4 mt-6 mb-8"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};