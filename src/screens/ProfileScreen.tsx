import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useGroceryStore } from '../store/groceryStore';
import { RootStackParamList } from '../types';
import { AlertModal } from '../components/AlertModal';
import { useInterstitialAd } from '../hooks/useInterstitialAd';

type ProfileScreenNavigationProp = NavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { items, categories, mealPlans, myLists, clearAllData } = useGroceryStore();
  const { showAd: showInterstitialAd } = useInterstitialAd();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<any>({});

  const totalItems = items.length;
  const completedItems = items.filter(item => item.isCompleted).length;
  const totalSpent = items.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Calculate My Lists stats
  const totalListItems = myLists.reduce((sum, list) => sum + list.items.length, 0);
  const completedListItems = myLists.reduce((sum, list) => 
    sum + list.items.filter(item => item.isCompleted).length, 0
  );

  const handleExportList = () => {
    setAlertConfig({
      title: 'Export List',
      message: 'Choose export format:',
      showCancel: true,
      cancelText: 'Cancel',
      okText: 'Text Format',
      onOk: () => {
        setAlertVisible(false);
        exportAsText();
      },
      extraButtons: [
        {
          text: 'Share List',
          onPress: () => {
            setAlertVisible(false);
            shareList();
          },
        },
      ],
    });
    setAlertVisible(true);
  };

  const exportAsText = () => {
    const listText = generateExportText();
    Clipboard.setString(listText);
    
    setAlertConfig({
      title: 'Export Complete',
      message: 'Your lists have been copied to clipboard!',
      onOk: () => {
        setAlertVisible(false);
        // Show interstitial ad after exporting
        showInterstitialAd();
      },
      okText: 'OK',
    });
    setAlertVisible(true);
  };

  const shareList = async () => {
    const listText = generateExportText();
    
    try {
      const result = await Share.share({
        message: listText,
        title: 'My Grozo Shopping Lists',
      });
      
      if (result.action === Share.sharedAction) {
        setAlertConfig({
          title: 'Success',
          message: 'Lists shared successfully!',
          onOk: () => {
            setAlertVisible(false);
            // Show interstitial ad after sharing
            showInterstitialAd();
          },
          okText: 'OK',
        });
        setAlertVisible(true);
      }
    } catch (error) {
      Clipboard.setString(listText);
      setAlertConfig({
        title: 'Copied',
        message: 'Lists copied to clipboard!',
        onOk: () => setAlertVisible(false),
        okText: 'OK',
      });
      setAlertVisible(true);
    }
  };

  const generateExportText = () => {
    let listText = 'GROZO SHOPPING LISTS\n';
    listText += '========================\n\n';
    
    // Export main grocery list
    if (items.length > 0) {
      listText += 'MAIN GROCERY LIST:\n';
      listText += '--------------------\n';
      items.forEach(item => {
        listText += `${item.isCompleted ? '[DONE]' : '[TODO]'} ${item.name} (${item.quantity} ${item.unit})\n`;
      });
      listText += '\n';
    }
    
    // Export My Lists
    if (myLists.length > 0) {
      myLists.forEach(list => {
        listText += `${list.name.toUpperCase()}:\n`;
        listText += '--------------------\n';
        if (list.items.length > 0) {
          list.items.forEach(item => {
            listText += `${item.isCompleted ? '[DONE]' : '[TODO]'} ${item.name} (${item.quantity} ${item.unit})\n`;
          });
        } else {
          listText += 'No items\n';
        }
        listText += '\n';
      });
    }
    
    // Export meal plans
    if (mealPlans.length > 0) {
      listText += 'MEAL PLANS:\n';
      listText += '--------------------\n';
      mealPlans.forEach(meal => {
        listText += `• ${meal.name}\n`;
        listText += `  ${meal.description}\n`;
        listText += `  Ingredients: ${meal.ingredients.join(', ')}\n\n`;
      });
    }
    
    if (items.length === 0 && myLists.length === 0 && mealPlans.length === 0) {
      listText += 'No data to export\n';
    }
    
    listText += `\nExported from Grozo on ${new Date().toLocaleDateString()}`;
    
    return listText;
  };

  const handleClearAllData = () => {
    setAlertConfig({
      title: 'Clear All Data',
      message: 'This will permanently delete all your grocery items, meal plans, and my lists. This action cannot be undone.',
      showCancel: true,
      cancelText: 'Cancel',
      okText: 'Clear All',
      onOk: () => {
        clearAllData();
        setAlertVisible(false);
        setTimeout(() => {
          setAlertConfig({
            title: 'Success',
            message: 'All data has been cleared successfully!',
            onOk: () => setAlertVisible(false),
            okText: 'OK',
          });
          setAlertVisible(true);
        }, 100);
      },
    });
    setAlertVisible(true);
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
            title="Main List Items"
            value={totalItems}
            icon="basket"
            color="#22c55e"
          />
          <StatCard
            title="My Lists Items"
            value={totalListItems}
            icon="list"
            color="#3b82f6"
          />
          <StatCard
            title="Total Spent"
            value={`${totalSpent.toFixed(2)}`}
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
              <Text className="text-gray-600">My Lists</Text>
              <Text className="font-semibold text-gray-800">{myLists.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Main List Completion</Text>
              <Text className="font-semibold text-gray-800">
                {totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Lists Completion</Text>
              <Text className="font-semibold text-gray-800">
                {totalListItems > 0 ? Math.round((completedListItems / totalListItems) * 100) : 0}%
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
          onPress={() => navigation.navigate('MealPlanner', undefined)}
          color="#22c55e"
        />

        <SettingItem
          icon="list"
          title="My Lists"
          subtitle="Organize shopping with multiple lists"
          onPress={() => navigation.navigate('MyLists', undefined)}
          color="#3b82f6"
        />

        <SettingItem
          icon="share"
          title="Export Lists"
          subtitle="Share or backup all your lists"
          onPress={handleExportList}
          color="#8b5cf6"
        />

        <SettingItem
          icon="help-circle"
          title="Help & Support"
          subtitle="Get help using Grozo"
          onPress={() => navigation.navigate('HelpSupport', undefined)}
          color="#06b6d4"
        />

        <SettingItem
          icon="shield-checkmark"
          title="Privacy Policy"
          subtitle="How we protect your data"
          onPress={() => navigation.navigate('PrivacyPolicy', undefined)}
          color="#8b5cf6"
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
      <AlertModal
        visible={alertVisible}
        title={alertConfig.title || ''}
        message={alertConfig.message || ''}
        onOk={alertConfig.onOk || (() => {})}
        okText={alertConfig.okText || 'OK'}
        onCancel={alertConfig.onCancel}
        cancelText={alertConfig.cancelText || 'Cancel'}
        showCancel={alertConfig.showCancel || false}
        extraButtons={alertConfig.extraButtons}
      />
    </SafeAreaView>
  );
};