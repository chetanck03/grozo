import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

interface InternetCheckProps {
  children: React.ReactNode;
}

export const InternetCheck: React.FC<InternetCheckProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showOfflineScreen, setShowOfflineScreen] = useState(false);

  useEffect(() => {
    // Check initial connection state
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      
      if (!connected) {
        setShowOfflineScreen(true);
      } else {
        setShowOfflineScreen(false);
      }
    });

    // Initial check
    NetInfo.fetch().then(state => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      if (!connected) {
        setShowOfflineScreen(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (showOfflineScreen || isConnected === false) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
          <View className="items-center mb-6">
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <Ionicons name="cloud-offline" size={48} color="#ef4444" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              No Internet Connection
            </Text>
            <Text className="text-gray-600 text-center leading-5">
              Grozo requires an active internet connection to work properly. Please check your connection and try again.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  setShowOfflineScreen(false);
                }
              });
            }}
            className="bg-green-500 rounded-xl py-4 px-6"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Retry Connection
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-sm text-center mt-4">
            Make sure Wi-Fi or mobile data is enabled
          </Text>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};
