import "./global.css";
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useGroceryStore } from './src/store/groceryStore';

export default function App() {
  const hydrate = useGroceryStore((state) => state.hydrate);

  useEffect(() => {
    // Load persisted data when app starts
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style="dark" backgroundColor="#f9fafb" />
    </GestureHandlerRootView>
  );
}