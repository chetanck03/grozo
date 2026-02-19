import React, { useState, useEffect } from 'react';
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
import { GeminiService } from '../services/geminiService';

type AddItemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddItem'>;
type AddItemScreenRouteProp = RouteProp<RootStackParamList, 'AddItem'>;

const units = ['piece', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'cup', 'tbsp', 'tsp', 'pack', 'bottle', 'can'];

export const AddItemScreen: React.FC = () => {
  const navigation = useNavigation<AddItemScreenNavigationProp>();
  const route = useRoute<AddItemScreenRouteProp>();
  const { addItem, categories, addItemToMyList } = useGroceryStore();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState('piece');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || '');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!selectedCategory) {
      // Auto-categorize using AI if no category selected
      try {
        const aiCategory = await GeminiService.categorizeItem(name);
        setSelectedCategory(aiCategory);
      } catch (error) {
        setSelectedCategory('Pantry');
      }
    }

    const newItem = {
      name: name.trim(),
      quantity: parseInt(quantity) || 1,
      unit: selectedUnit,
      category: selectedCategory || 'Pantry',
      isCompleted: false,
      price: price ? parseFloat(price) : undefined,
      notes: notes.trim() || undefined,
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
    };

    // If listId is provided, add to specific list, otherwise add to main items
    if (route.params?.listId) {
      addItemToMyList(route.params.listId, newItem);
    } else {
      addItem(newItem);
    }
    
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
          <Text className="text-xl font-bold text-gray-800">Add Item</Text>
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
              autoFocus
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
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-500 rounded-xl py-4 mt-6 mb-8"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Add to List
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};