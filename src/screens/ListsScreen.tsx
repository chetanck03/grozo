import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGroceryStore } from '../store/groceryStore';
import { GroceryItem } from '../components/GroceryItem';
import { RootStackParamList } from '../types';

type ListsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ListsScreen: React.FC = () => {
  const navigation = useNavigation<ListsScreenNavigationProp>();
  const { items, deleteItem } = useGroceryStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredItems = items.filter(item => {
    switch (filter) {
      case 'pending':
        return !item.isCompleted;
      case 'completed':
        return item.isCompleted;
      default:
        return true;
    }
  });

  const pendingCount = items.filter(item => !item.isCompleted).length;
  const completedCount = items.filter(item => item.isCompleted).length;

  const handleClearCompleted = () => {
    const completedItems = items.filter(item => item.isCompleted);
    if (completedItems.length === 0) {
      Alert.alert('No Items', 'No completed items to clear.');
      return;
    }

    Alert.alert(
      'Clear Completed Items',
      `Are you sure you want to remove ${completedItems.length} completed items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            completedItems.forEach(item => deleteItem(item.id));
          },
        },
      ]
    );
  };

  const FilterButton: React.FC<{ 
    type: 'all' | 'pending' | 'completed'; 
    label: string; 
    count: number 
  }> = ({ type, label, count }) => (
    <TouchableOpacity
      onPress={() => setFilter(type)}
      className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
        filter === type ? 'bg-green-500' : 'bg-white'
      }`}
    >
      <Text className={`text-center font-semibold ${
        filter === type ? 'text-white' : 'text-gray-700'
      }`}>
        {label}
      </Text>
      <Text className={`text-center text-sm ${
        filter === type ? 'text-green-100' : 'text-gray-500'
      }`}>
        {count}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-2xl font-bold text-gray-800">
            Shopping List
          </Text>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={handleClearCompleted}
              className="bg-red-500 p-3 rounded-full mr-2"
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddItem')}
              className="bg-green-500 p-3 rounded-full"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mb-4">
          <FilterButton type="all" label="All" count={items.length} />
          <FilterButton type="pending" label="Pending" count={pendingCount} />
          <FilterButton type="completed" label="Done" count={completedCount} />
        </View>

        {/* Progress Bar */}
        {items.length > 0 && (
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Progress</Text>
              <Text className="text-sm text-gray-600">
                {completedCount}/{items.length} completed
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2">
              <View 
                className="bg-green-500 h-2 rounded-full"
                style={{ 
                  width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` 
                }}
              />
            </View>
          </View>
        )}

        {/* Items List */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GroceryItem
                item={item}
                onEdit={() => navigation.navigate('EditItem', { item })}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="basket-outline" size={80} color="#d1d5db" />
            <Text className="text-xl font-semibold text-gray-500 mt-4">
              {filter === 'all' && 'No items in your list'}
              {filter === 'pending' && 'No pending items'}
              {filter === 'completed' && 'No completed items'}
            </Text>
            <Text className="text-gray-400 mt-2 text-center px-8">
              {filter === 'all' && 'Start by adding some items to your grocery list'}
              {filter === 'pending' && 'All items are completed! Great job!'}
              {filter === 'completed' && 'Complete some items to see them here'}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddItem')}
                className="bg-green-500 px-6 py-3 rounded-lg mt-6"
              >
                <Text className="text-white font-semibold">Add First Item</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};