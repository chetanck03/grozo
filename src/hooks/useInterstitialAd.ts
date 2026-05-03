import { useState, useEffect, useCallback, useRef } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG, AdMobService } from '../services/adMobService';

export const useInterstitialAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const interstitialRef = useRef<InterstitialAd | null>(null);

  // Create interstitial ad instance once
  if (!interstitialRef.current) {
    interstitialRef.current = InterstitialAd.createForAdRequest(ADMOB_CONFIG.interstitialAdUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });
  }

  const interstitial = interstitialRef.current;

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded successfully');
      setIsAdLoaded(true);
      setError(null);
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (err: Error) => {
      console.log('Interstitial ad error:', err.message);
      setError(err);
      setIsAdLoaded(false);
      // Try to reload after error
      setTimeout(() => loadAd(), 2000);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      setIsAdShowing(false);
      setIsAdLoaded(false);
      // Preload next ad immediately
      setTimeout(() => loadAd(), 1000);
    });

    const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
      console.log('Interstitial ad opened');
    });

    // Load ad on mount
    console.log('Loading interstitial ad...');
    loadAd();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      unsubscribeOpened();
    };
  }, []);

  const loadAd = useCallback(() => {
    if (!isAdShowing && interstitial) {
      console.log('Calling interstitial.load()...');
      interstitial.load();
    } else {
      console.log('Cannot load ad - showing:', isAdShowing, 'interstitial:', !!interstitial);
    }
  }, [isAdShowing, interstitial]);

  const showAd = useCallback(() => {
    console.log('showAd called - isAdLoaded:', isAdLoaded, 'isAdShowing:', isAdShowing, 'canShow:', AdMobService.canShowInterstitial());
    
    // Check if ad is loaded and we can show it
    if (isAdLoaded && !isAdShowing && AdMobService.canShowInterstitial()) {
      console.log('Attempting to show interstitial ad...');
      // Add a small delay to ensure ad is fully ready
      setTimeout(() => {
        try {
          interstitial.show();
          setIsAdShowing(true);
          AdMobService.recordInterstitialShown();
          console.log('Interstitial ad show() called successfully');
        } catch (error: any) {
          console.log('Failed to show interstitial ad:', error.message);
          // Reload ad for next time
          loadAd();
        }
      }, 500); // 500ms delay to ensure ad is ready
      return true;
    }
    console.log('Interstitial ad not ready to show');
    return false;
  }, [isAdLoaded, isAdShowing, loadAd, interstitial]);

  return {
    isAdLoaded,
    isAdShowing,
    error,
    showAd,
    loadAd,
  };
};
