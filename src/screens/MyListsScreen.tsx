import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useGroceryStore } from '../store/groceryStore';
import { GroceryItem } from '../components/GroceryItem';
import { RootStackParamList } from '../types';

type MyListsScreenNavigationProp = NavigationProp<RootStackParamList>;

const listColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f97316'];

export const MyListsScreen: React.FC = () => {
  const navigation = useNavigation<MyListsScreenNavigationProp>();
  const { 
    myLists, 
    createMyList, 
    deleteMyList, 
    addItemToMyList, 
    removeItemFromMyList, 
    toggleMyListItemComplete 
  } = useGroceryStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedColor, setSelectedColor] = useState(listColors[0]);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const handleCreateList = () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    createMyList(newListName.trim(), selectedColor);
    setNewListName('');
    setSelectedColor(listColors[0]);
    setShowCreateModal(false);
  };

  const handleDeleteList = (listId: string, listName: string) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${listName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMyList(listId),
        },
      ]
    );
  };

  const handleAddItemToList = (listId: string) => {
    navigation.navigate('AddItem', { listId });
  };

  const getCompletionPercentage = (items: any[]) => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.isCompleted).length;
    return Math.round((completed / items.length) * 100);
  };

  const MyListCard: React.FC<{ list: any }> = ({ list }) => {
    const completionPercentage = getCompletionPercentage(list.items);
    const isExpanded = expandedListId === list.id;

    return (
      <TouchableOpacity
        onPress={() => setExpandedListId(isExpanded ? null : list.id)}
        className="bg-white rounded-xl p-4 mb-4 shadow-sm"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: list.color }}
              />
              <Text className="text-lg font-bold text-gray-800 flex-1">{list.name}</Text>
            </View>
            <Text className="text-gray-600">
              {list.items.length} items • {completionPercentage}% complete
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Created on {list.createdAt.toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => handleAddItemToList(list.id)}
              className="bg-green-500 p-2 rounded-lg mr-2"
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteList(list.id, list.name)}
              className="bg-red-500 p-2 rounded-lg mr-2"
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#6b7280" 
            />
          </View>
        </View>

        {/* Progress Bar */}
        {list.items.length > 0 && (
          <View className="mb-3">
            <View className="bg-gray-200 rounded-full h-2">
              <View 
                className="h-2 rounded-full"
                style={{ 
                  backgroundColor: list.color, 
                  width: `${completionPercentage}%` 
                }}
              />
            </View>
          </View>
        )}

        {/* Expanded Items */}
        {isExpanded && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            {list.items.length > 0 ? (
              list.items.map((item: any) => (
                <View key={item.id} className="mb-2">
                  <GroceryItem 
                    item={item} 
                    onToggle={() => toggleMyListItemComplete(list.id, item.id)}
                    onDelete={() => removeItemFromMyList(list.id, item.id)}
                    onEdit={() => navigation.navigate('EditItem', { item })}
                  />
                </View>
              ))
            ) : (
              <View className="items-center py-4">
                <Ionicons name="basket-outline" size={32} color="#d1d5db" />
                <Text className="text-gray-500 mt-2">No items in this list</Text>
                <TouchableOpacity
                  onPress={() => handleAddItemToList(list.id)}
                  className="mt-2 px-4 py-2 bg-green-500 rounded-lg"
                >
                  <Text className="text-white text-sm font-medium">Add First Item</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">My Lists</Text>
          <TouchableOpacity 
            onPress={() => setShowCreateModal(true)}
            className="bg-green-500 p-3 rounded-full"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text className="text-blue-800 font-semibold ml-2">My Lists</Text>
          </View>
          <Text className="text-blue-700 text-sm">
            Organize your shopping with multiple lists! Create separate lists for different occasions, 
            stores, or categories to stay organized and efficient.
          </Text>
        </View>

        {/* My Lists */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Your Lists ({myLists.length})
          </Text>

          {myLists.length > 0 ? (
            myLists.map((list) => (
              <MyListCard key={list.id} list={list} />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <Ionicons name="list-outline" size={64} color="#d1d5db" />
              <Text className="text-lg font-semibold text-gray-500 mt-4">
                No Lists Yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Create your first list to organize your shopping by occasion, store, or category!
              </Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(true)}
                className="bg-green-500 px-6 py-3 rounded-lg mt-4"
              >
                <Text className="text-white font-semibold">Create First List</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Features */}
        <View className="bg-white rounded-xl p-4 mb-8 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Features</Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="list" size={20} color="#22c55e" />
              <Text className="text-gray-700 ml-3">Multiple shopping lists</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="folder" size={20} color="#3b82f6" />
              <Text className="text-gray-700 ml-3">Organize by category or store</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
              <Text className="text-gray-700 ml-3">Track completion status</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="archive" size={20} color="#8b5cf6" />
              <Text className="text-gray-700 ml-3">Local storage - always available</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create List Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">Create New List</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">List Name</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="e.g., Weekly Shopping, Party Supplies, Costco Trip"
                value={newListName}
                onChangeText={setNewListName}
                autoFocus
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Choose Color</Text>
              <View className="flex-row flex-wrap">
                {listColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full mr-3 mb-3 ${
                      selectedColor === color ? 'border-4 border-gray-400' : 'border-2 border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 rounded-xl py-3"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateList}
                className="flex-1 bg-green-500 rounded-xl py-3"
              >
                <Text className="text-white text-center font-semibold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};