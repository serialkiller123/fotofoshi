import { router, Stack } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import {} from "expo-vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function UploadLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: "Upload",
          headerShown: false,
        }}
      />

      <Stack.Screen name="image-view" options={{ headerShown: false }} />
    </Stack>
  );
}
