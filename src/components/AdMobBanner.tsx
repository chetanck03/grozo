import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG } from '../services/adMobService';

interface AdMobBannerProps {
  unitId?: string;
  size?: BannerAdSize;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  unitId,
  size = BannerAdSize.BANNER,
}) => {
  const [hasError, setHasError] = useState(false);

  // Show ads on all platforms if enabled
  if (!ADMOB_CONFIG.adsEnabled) {
    return null;
  }

  const adUnitId = unitId || ADMOB_CONFIG.bannerAdUnitId;

  useEffect(() => {
    setHasError(false);
  }, []);

  if (hasError) {
    return null;
  }

  return (
    <View className="bg-gray-100" style={{ 
      minHeight: 50,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
    }}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          setHasError(false);
        }}
        onAdFailedToLoad={(error: Error) => {
          console.log('Banner ad failed to load:', error);
          setHasError(true);
        }}
      />
    </View>
  );
};
