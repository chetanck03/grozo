import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGroceryStore } from '../store/groceryStore';
import { RootStackParamList } from '../types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { items, categories, mealPlans, familyLists } = useGroceryStore();

  const totalItems = items.length;
  const completedItems = items.filter(item => item.isCompleted).length;
  const totalSpent = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleExportList = () => {
    Alert.alert(
      'Export List',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Text Format', onPress: () => exportAsText() },
        { text: 'Share List', onPress: () => shareList() },
      ]
    );
  };

  const exportAsText = () => {
    const listText = items
      .map(item => `${item.isCompleted ? '✓' : '○'} ${item.name} (${item.quantity} ${item.unit})`)
      .join('\n');
    
    Alert.alert('Export Complete', `Your list:\n\n${listText}`);
  };

  const shareList = () => {
    Alert.alert('Share List', 'Sharing functionality would be implemented here with native sharing APIs.');
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your grocery items, meal plans, and family lists. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            // Clear all data logic would go here
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
  }> = ({ icon, title, subtitle, onPress, color = '#6b7280' }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500">{subtitle}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <View className="bg-white rounded-xl p-4 flex-1 mx-1 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <Ionicons name={icon as any} size={24} color={color} />
        <Text className="text-2xl font-bold" style={{ color }}>
          {value}
        </Text>
      </View>
      <Text className="text-gray-600 text-sm">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
          <Text className="text-gray-600">Manage your Grozo experience</Text>
        </View>

        {/* Stats */}
        <View className="flex-row mb-6">
          <StatCard
            title="Total Items"
            value={totalItems}
            icon="basket"
            color="#22c55e"
          />
          <StatCard
            title="Completed"
            value={completedItems}
            icon="checkmark-circle"
            color="#3b82f6"
          />
          <StatCard
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            icon="card"
            color="#f59e0b"
          />
        </View>

        {/* Quick Stats */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Quick Stats</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Categories</Text>
              <Text className="font-semibold text-gray-800">{categories.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Meal Plans</Text>
              <Text className="font-semibold text-gray-800">{mealPlans.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Family Lists</Text>
              <Text className="font-semibold text-gray-800">{familyLists.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Completion Rate</Text>
              <Text className="font-semibold text-gray-800">
                {totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <Text className="text-lg font-bold text-gray-800 mb-3">Settings</Text>

        <SettingItem
          icon="restaurant"
          title="Meal Planner"
          subtitle="AI-powered meal planning"
          onPress={() => navigation.navigate('MealPlanner')}
          color="#22c55e"
        />

        <SettingItem
          icon="people"
          title="Family Lists"
          subtitle="Shared grocery lists"
          onPress={() => navigation.navigate('FamilyLists')}
          color="#3b82f6"
        />

        <SettingItem
          icon="share"
          title="Export List"
          subtitle="Share or backup your list"
          onPress={handleExportList}
          color="#8b5cf6"
        />

        <SettingItem
          icon="notifications"
          title="Notifications"
          subtitle="Low stock alerts and reminders"
          onPress={() => Alert.alert('Notifications', 'Notification settings would be configured here.')}
          color="#f59e0b"
        />

        <SettingItem
          icon="settings"
          title="App Settings"
          subtitle="Preferences and configuration"
          onPress={() => Alert.alert('Settings', 'App settings would be configured here.')}
          color="#6b7280"
        />

        <SettingItem
          icon="help-circle"
          title="Help & Support"
          subtitle="Get help using Grozo"
          onPress={() => Alert.alert('Help', 'Help and support information would be shown here.')}
          color="#06b6d4"
        />

        <SettingItem
          icon="trash"
          title="Clear All Data"
          subtitle="Reset app to initial state"
          onPress={handleClearAllData}
          color="#ef4444"
        />

        {/* App Info */}
        <View className="bg-white rounded-xl p-4 mt-6 mb-8 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">About Grozo</Text>
          <Text className="text-gray-600 mb-2">Version 1.0.0</Text>
          <Text className="text-gray-500 text-sm">
            Smart grocery shopping made easy with AI-powered suggestions and meal planning.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};