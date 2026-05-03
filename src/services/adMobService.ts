import { Platform } from 'react-native';

// AdMob Configuration
// Replace these with your actual AdMob Ad Unit IDs from Google AdMob console
export const ADMOB_CONFIG = {
  // Test Ad Unit IDs (replace with production IDs before publishing)
  bannerAdUnitId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test banner ID for iOS
    android: 'ca-app-pub-3940256099942544/6300978111', // Test banner ID for Android
    default: 'ca-app-pub-3940256099942544/6300978111',
  }),
  interstitialAdUnitId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910', // Test interstitial ID for iOS
    android: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial ID for Android
    default: 'ca-app-pub-3940256099942544/1033173712',
  }),
  appId: Platform.select({
    ios: 'ca-app-pub-3940256099942544~1458002511', // Test App ID for iOS
    android: 'ca-app-pub-3940256099942544~3347511713', // Test App ID for Android
    default: 'ca-app-pub-3940256099942544~3347511713',
  }),
};

// Ad display intervals (in milliseconds)
export const AD_INTERVALS = {
  interstitialMinInterval: 60000, // Minimum 1 minute between interstitial ads
  interstitialMaxPerSession: 5, // Maximum 5 interstitial ads per session
};

// Track ad display
let interstitialCount = 0;
let lastInterstitialTime = 0;

export const AdMobService = {
  // Check if interstitial ad can be shown
  canShowInterstitial(): boolean {
    const now = Date.now();
    const timeSinceLastAd = now - lastInterstitialTime;
    
    return (
      interstitialCount < AD_INTERVALS.interstitialMaxPerSession &&
      timeSinceLastAd >= AD_INTERVALS.interstitialMinInterval
    );
  },

  // Record that an interstitial ad was shown
  recordInterstitialShown(): void {
    interstitialCount++;
    lastInterstitialTime = Date.now();
  },

  // Reset ad counter (call on app start)
  resetAdCounter(): void {
    interstitialCount = 0;
    lastInterstitialTime = 0;
  },

  // Get current ad count
  getInterstitialCount(): number {
    return interstitialCount;
  },
};
