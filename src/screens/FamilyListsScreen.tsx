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
import { StackNavigationProp } from '@react-navigation/stack';
import { useGroceryStore } from '../store/groceryStore';
import { GroceryItem } from '../components/GroceryItem';
import { RootStackParamList } from '../types';

type FamilyListsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const FamilyListsScreen: React.FC = () => {
  const navigation = useNavigation<FamilyListsScreenNavigationProp>();
  const { familyLists, createFamilyList, addItemToFamilyList } = useGroceryStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleCreateList = () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    createFamilyList(newListName.trim(), 'You'); // In a real app, this would be the current user
    setNewListName('');
    setShowCreateModal(false);
    Alert.alert('Success', 'Family list created successfully!');
  };

  const handleAddItemToFamily = (listId: string) => {
    Alert.alert(
      'Add Item',
      'This would open the add item screen for the family list. In a full implementation, you would navigate to a specialized add item screen for family lists.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Sample Item',
          onPress: () => {
            addItemToFamilyList(listId, {
              name: 'Sample Item',
              quantity: 1,
              unit: 'piece',
              category: 'Pantry',
              isCompleted: false,
            });
            Alert.alert('Success', 'Sample item added to family list!');
          },
        },
      ]
    );
  };

  const FamilyListCard: React.FC<{ list: any }> = ({ list }) => (
    <TouchableOpacity
      onPress={() => setSelectedListId(selectedListId === list.id ? null : list.id)}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{list.name}</Text>
          <Text className="text-gray-600">
            {list.items.length} items • {list.members.length} members
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            Created by {list.createdBy} on {list.createdAt.toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleAddItemToFamily(list.id)}
            className="bg-green-500 p-2 rounded-lg mr-2"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
          <Ionicons 
            name={selectedListId === list.id ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6b7280" 
          />
        </View>
      </View>

      {/* Members */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="people" size={16} color="#6b7280" />
        <Text className="text-sm text-gray-600 ml-2">
          Members: {list.members.join(', ')}
        </Text>
      </View>

      {/* Expanded Items */}
      {selectedListId === list.id && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          {list.items.length > 0 ? (
            list.items.map((item: any) => (
              <GroceryItem key={item.id} item={item} />
            ))
          ) : (
            <View className="items-center py-4">
              <Ionicons name="basket-outline" size={32} color="#d1d5db" />
              <Text className="text-gray-500 mt-2">No items in this list</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Family Lists</Text>
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
            <Text className="text-blue-800 font-semibold ml-2">Family Lists</Text>
          </View>
          <Text className="text-blue-700 text-sm">
            Create shared grocery lists that your family members can access and edit together. 
            Perfect for coordinating shopping trips and ensuring nothing gets forgotten!
          </Text>
        </View>

        {/* Family Lists */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Your Family Lists ({familyLists.length})
          </Text>

          {familyLists.length > 0 ? (
            familyLists.map((list) => (
              <FamilyListCard key={list.id} list={list} />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <Ionicons name="people-outline" size={64} color="#d1d5db" />
              <Text className="text-lg font-semibold text-gray-500 mt-4">
                No Family Lists Yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Create your first family list to start sharing grocery lists with your loved ones!
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
              <Ionicons name="sync" size={20} color="#22c55e" />
              <Text className="text-gray-700 ml-3">Real-time synchronization</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="people" size={20} color="#3b82f6" />
              <Text className="text-gray-700 ml-3">Multiple family members</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={20} color="#f59e0b" />
              <Text className="text-gray-700 ml-3">Update notifications</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="share" size={20} color="#8b5cf6" />
              <Text className="text-gray-700 ml-3">Easy sharing via invite codes</Text>
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
              <Text className="text-xl font-bold text-gray-800">Create Family List</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">List Name</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="e.g., Smith Family Groceries"
                value={newListName}
                onChangeText={setNewListName}
                autoFocus
              />
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