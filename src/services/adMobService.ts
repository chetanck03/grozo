import { Platform } from 'react-native';

// AdMob Configuration
// Production Ad Unit IDs for Android
export const ADMOB_CONFIG = {
  // Android Ad Unit IDs (your production IDs)
  bannerAdUnitId: 'ca-app-pub-9236732680797508/4746287184',
  interstitialAdUnitId: 'ca-app-pub-9236732680797508/6188503005',
  appId: 'ca-app-pub-9236732680797508~3215169935',
  // Enable ads on all platforms
  adsEnabled: true,
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
