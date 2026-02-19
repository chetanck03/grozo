import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  message?: string;
}

export const LoadingScreen: React.FC<Props> = ({ message = 'Loading...' }) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-8">
        <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-lg font-semibold text-gray-800 mt-4">
            {message}
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Please wait while we prepare your grocery experience
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};