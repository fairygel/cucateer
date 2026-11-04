import { Tabs } from "expo-router";
import { PawPrint, Settings } from "lucide-react-native";

import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: colors.accent, 
      headerShown: false,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontFamily: "Andika" },
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopColor: colors.background
      }
    }}>
      <Tabs.Screen
        name="focus"
        options={{
          title: "focus",
          tabBarIcon: ({ color, size }) => (
            <PawPrint color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
