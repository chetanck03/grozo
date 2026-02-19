import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-4">Privacy Policy</Text>
        </View>

        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Grozo Privacy Policy</Text>
          <Text className="text-sm text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">1. Information We Collect</Text>
              <Text className="text-gray-600 mb-2">
                Grozo collects and processes the following information:
              </Text>
              <Text className="text-gray-600 ml-4 mb-1">• Grocery lists and shopping items you create</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Meal plans and preferences you set</Text>
              <Text className="text-gray-600 ml-4 mb-1">• App usage data for improving functionality</Text>
              <Text className="text-gray-600 ml-4">• Device information for app optimization</Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">2. How We Use Your Information</Text>
              <Text className="text-gray-600 mb-2">We use your information to:</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Provide personalized grocery and meal planning features</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Generate AI-powered meal suggestions using advanced AI models</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Improve app performance and user experience</Text>
              <Text className="text-gray-600 ml-4">• Sync your data across devices (if applicable)</Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">3. Data Storage and Security</Text>
              <Text className="text-gray-600 mb-2">
                Your data is stored locally on your device. When using AI features, meal preferences may be sent to our AI service providers for processing. We implement appropriate security measures to protect your information.
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">4. Third-Party Services</Text>
              <Text className="text-gray-600 mb-2">
                Grozo uses third-party AI services for AI-powered meal planning. We work only with reputable AI service providers who maintain high standards of data protection and privacy.
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">5. Data Sharing</Text>
              <Text className="text-gray-600 mb-2">
                We do not sell, trade, or share your personal information with third parties except as described in this policy or with your explicit consent.
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">6. Your Rights</Text>
              <Text className="text-gray-600 mb-2">You have the right to:</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Access your data stored in the app</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Delete your data using the "Clear All Data" feature</Text>
              <Text className="text-gray-600 ml-4 mb-1">• Export your data using the "Export Lists" feature</Text>
              <Text className="text-gray-600 ml-4">• Contact us with privacy concerns</Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">7. Children's Privacy</Text>
              <Text className="text-gray-600 mb-2">
                Grozo is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">8. Changes to This Policy</Text>
              <Text className="text-gray-600 mb-2">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy in the app.
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-800 mb-2">9. Contact Us</Text>
              <Text className="text-gray-600 mb-2">
                If you have questions about this privacy policy, please contact us at:
              </Text>
              <Text className="text-gray-600 ml-4 mb-1">Email: support@cktechhub.dev</Text>
              <Text className="text-gray-600 ml-4 mb-1">Developer: Ck Tech Hub</Text>
              <Text className="text-gray-600 ml-4">App: Grozo - Smart Grocery List</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};