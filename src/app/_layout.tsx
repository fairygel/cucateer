import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'expo-router/build/SafeAreaProvider.js';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts([
    {
      fontFamily: 'Andika',
      fontDefinitions: [
        {
          path: require('../../assets/fonts/Andika-Regular.ttf'),
          weight: 400,
        },
        {
          path: require('../../assets/fonts/Andika-Italic.ttf'),
          weight: 400,
          style: 'italic',
        },
        {
          path: require('../../assets/fonts/Andika-Bold.ttf'),
          weight: 700,
        },
        {
          path: require('../../assets/fonts/Andika-BoldItalic.ttf'),
          weight: 700,
          style: 'italic',
        },
      ],
    },
  ]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' options={{headerShown: false}} />
      </Stack>
    </SafeAreaProvider>
  );
}
