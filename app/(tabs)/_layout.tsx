import { router, Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import { UserProvider } from "@/context/UserContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 75,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="ImageDetails"
          options={{
            title: "Image Details",
            tabBarButton: () => null,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            headerShown: true,
            headerBackground: () => null,
            headerLeft: () => (
              <Ionicons
                onPress={() => router.back()}
                name="chevron-back"
                size={20}
                color="#64748B"
                style={{ marginLeft: 20 }}
              />
            ),

            title: "Settings",
            headerTitleStyle: { color: "#64748B" },
            headerLeftContainerStyle: {
              marginLeft: 20,
            },

            tabBarIcon: ({ color, focused, size }) => (
              <TabBarIcon
                name={focused ? "settings" : "settings"}
                color={color}
                size={16}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(upload)"
          options={{
            title: "Upload",
            tabBarStyle: {
              display: "none",
            },
            tabBarIcon: ({ focused, color, size }) => (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#FFD700",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 20,
                }}
              >
                <Ionicons
                  name="add"
                  size={25}
                  color={focused ? Colors.light.icon : "#FFF"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: true,
            title: "Profile",
            headerTitleStyle: { color: "#64748B" },
            headerLeft: () => (
              <Ionicons
                onPress={() => router.back()}
                name="chevron-back"
                size={20}
                color="#64748B"
                style={{ marginLeft: 20 }}
              />
            ),
            headerLeftContainerStyle: {
              marginLeft: 20,
            },
            headerBackground: () => null,
            tabBarIcon: ({ color, focused, size }) => (
              <TabBarIcon
                name={focused ? "person" : "person"}
                color={color}
                size={16}
              />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
