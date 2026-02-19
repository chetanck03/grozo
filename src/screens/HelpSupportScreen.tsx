import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type HelpSupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpSupport'>;

export const HelpSupportScreen: React.FC = () => {
  const navigation = useNavigation<HelpSupportScreenNavigationProp>();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I add items to my grocery list?",
      answer: "Tap the 'Add Item' button on the home screen or use the search bar to find and add items. You can also add items by category from the Categories screen."
    },
    {
      question: "How does the AI Meal Planner work?",
      answer: "The AI Meal Planner uses your dietary preferences to suggest personalized meal plans. Simply tap the sparkles icon on the home screen, select your preferences, and let AI create meal plans with automatic grocery lists."
    },
    {
      question: "Can I create multiple shopping lists?",
      answer: "Yes! Use the 'My Lists' feature to create separate lists for different occasions, family members, or stores. Each list can have its own color and items."
    },
    {
      question: "How do I share my grocery lists?",
      answer: "Go to Profile → Export Lists to share your lists via text message, email, or any other app. You can also copy the list to your clipboard."
    },
    {
      question: "How do I mark items as completed?",
      answer: "Tap the circle next to any item to mark it as completed. Completed items will show with a green checkmark and move to the bottom of your list."
    },
    {
      question: "Can I edit or delete items?",
      answer: "Yes! Tap on any item to edit its details like quantity, unit, or category. You can also delete items by tapping the trash icon."
    },
    {
      question: "How do I clear all my data?",
      answer: "Go to Profile → Clear All Data. This will permanently delete all your lists, meal plans, and items. This action cannot be undone."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! Your data is stored locally on your device. When using AI features, only meal preferences are sent securely to our AI service. We never share your personal information."
    }
  ];

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => openEmail() },
        { text: 'Report Bug', onPress: () => reportBug() },
      ]
    );
  };

  const openEmail = () => {
    const email = 'support@cktechhub.dev';
    const subject = 'Grozo App Support Request';
    const body = 'Hi Ck Tech Hub team,\n\nI need help with the Grozo app.\n\nIssue: [Please describe your issue here]\n\nDevice: [Your device model]\nApp Version: 1.0.0\n\nThank you!';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open email app. Please email us directly at support@cktechhub.dev');
    });
  };

  const reportBug = () => {
    const email = 'support@cktechhub.dev';
    const subject = 'Grozo App - Bug Report';
    const body = 'Hi Ck Tech Hub team,\n\nI found a bug in the Grozo app.\n\nBug Description: [Please describe what happened]\nSteps to Reproduce: [How to recreate the bug]\nExpected Behavior: [What should have happened]\n\nDevice: [Your device model]\nApp Version: 1.0.0\n\nThank you!';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open email app. Please email us directly at support@cktechhub.dev');
    });
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const FeatureCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }> = ({ icon, title, description, color }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}20` }}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text className="text-lg font-semibold text-gray-800 flex-1">{title}</Text>
      </View>
      <Text className="text-gray-600 ml-13">{description}</Text>
    </View>
  );

  const FAQItem: React.FC<{
    question: string;
    answer: string;
    index: number;
  }> = ({ question, answer, index }) => (
    <View className="bg-white rounded-xl mb-3 shadow-sm overflow-hidden">
      <TouchableOpacity
        onPress={() => toggleFAQ(index)}
        className="p-4 flex-row items-center justify-between"
      >
        <Text className="text-gray-800 font-medium flex-1 mr-3">{question}</Text>
        <Ionicons 
          name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6b7280" 
        />
      </TouchableOpacity>
      {expandedFAQ === index && (
        <View className="px-4 pb-4 border-t border-gray-100">
          <Text className="text-gray-600 mt-3">{answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-4">Help & Support</Text>
        </View>

        {/* Welcome Section */}
        <View className="bg-green-500 rounded-xl p-6 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="help-circle" size={32} color="white" />
            <Text className="text-2xl font-bold text-white ml-3">Welcome to Grozo Help</Text>
          </View>
          <Text className="text-green-100">
            Find answers to common questions, learn about features, and get support when you need it.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-gray-800 mb-3">Quick Actions</Text>
        
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={handleContactSupport}
            className="flex-1 bg-blue-500 rounded-xl p-4 mr-2 items-center"
          >
            <Ionicons name="mail" size={24} color="white" />
            <Text className="text-white font-semibold mt-2">Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            className="flex-1 bg-purple-500 rounded-xl p-4 ml-2 items-center"
          >
            <Ionicons name="shield-checkmark" size={24} color="white" />
            <Text className="text-white font-semibold mt-2">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* App Features */}
        <Text className="text-lg font-bold text-gray-800 mb-3">App Features</Text>
        
        <FeatureCard
          icon="basket"
          title="Smart Grocery Lists"
          description="Create and manage multiple grocery lists with categories, quantities, and completion tracking."
          color="#22c55e"
        />
        
        <FeatureCard
          icon="sparkles"
          title="AI Meal Planner"
          description="Get personalized meal suggestions based on your dietary preferences and automatically generate grocery lists."
          color="#8b5cf6"
        />
        
        <FeatureCard
          icon="people"
          title="My Lists"
          description="Create separate lists for different occasions, family members, or stores with custom colors."
          color="#3b82f6"
        />
        
        <FeatureCard
          icon="share"
          title="Export & Share"
          description="Share your grocery lists via text, email, or any app. Export your data for backup."
          color="#f59e0b"
        />

        {/* FAQ Section */}
        <Text className="text-lg font-bold text-gray-800 mb-3 mt-6">Frequently Asked Questions</Text>
        
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index}
          />
        ))}

        {/* Contact Information */}
        <View className="bg-white rounded-xl p-4 mt-6 mb-8 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Still Need Help?</Text>
          <Text className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help!
          </Text>
          
          <TouchableOpacity
            onPress={handleContactSupport}
            className="bg-green-500 rounded-xl p-4 flex-row items-center justify-center"
          >
            <Ionicons name="mail" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Email Support</Text>
          </TouchableOpacity>
          
          <View className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-600 text-center">
              support@cktechhub.dev
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              We typically respond within 24 hours
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};