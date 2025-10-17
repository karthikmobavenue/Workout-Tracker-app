import React, { useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const MobileEnhancements = ({ children }) => {
  useEffect(() => {
    const initMobileFeatures = async () => {
      try {
        // Check if running on mobile device
        const deviceInfo = await Device.getInfo();
        const isMobile = deviceInfo.platform !== 'web';

        if (isMobile) {
          // Configure Status Bar
          await StatusBar.setStyle({ style: 'dark' });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });

          // Hide Splash Screen after app loads
          setTimeout(async () => {
            await SplashScreen.hide();
          }, 2000);

          // Configure Keyboard
          Keyboard.addListener('keyboardWillShow', (info) => {
            document.body.style.paddingBottom = `${info.keyboardHeight}px`;
          });

          Keyboard.addListener('keyboardWillHide', () => {
            document.body.style.paddingBottom = '0px';
          });

          // Add mobile-specific CSS
          document.body.classList.add('mobile-app');
        }
      } catch (error) {
        console.log('Mobile features not available:', error);
      }
    };

    initMobileFeatures();

    return () => {
      try {
        Keyboard.removeAllListeners();
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, []);

  // Haptic feedback for button clicks
  const addHapticFeedback = () => {
    try {
      Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  // Add click listeners for haptic feedback
  useEffect(() => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', addHapticFeedback);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', addHapticFeedback);
      });
    };
  });

  return <>{children}</>;
};

export default MobileEnhancements;