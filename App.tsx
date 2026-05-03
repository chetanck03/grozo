import "./global.css";
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useGroceryStore } from './src/store/groceryStore';
import { InternetCheck } from './src/components/InternetCheck';
import { AdMobService } from './src/services/adMobService';
import mobileAds from 'react-native-google-mobile-ads';

export default function App() {
  const hydrate = useGroceryStore((state) => state.hydrate);

  useEffect(() => {
    // Load persisted data when app starts
    hydrate();
    
    // Initialize AdMob
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('AdMob initialized:', adapterStatuses);
      })
      .catch((error) => {
        console.log('AdMob initialization error:', error);
      });
    
    // Reset ad counter on app start
    AdMobService.resetAdCounter();
  }, [hydrate]);

  return (
    <InternetCheck>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
        <StatusBar style="dark" backgroundColor="#f9fafb" />
      </GestureHandlerRootView>
    </InternetCheck>
  );
}