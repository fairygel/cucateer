import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'expo-router/build/SafeAreaProvider.js';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' options={{headerShown: false}} />
      </Stack>
    </SafeAreaProvider>
  );
}
