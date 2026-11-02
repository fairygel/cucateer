import { Tabs } from "expo-router";
import { PawPrint, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "#4fcf6f", 
      headerShown: false,
      tabBarInactiveTintColor: '#888888',
      tabBarStyle: {
        backgroundColor: 'black',
        borderTopColor: 'black'
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
