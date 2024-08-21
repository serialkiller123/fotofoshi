import { Stack } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";

export default function UploadLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: "Upload",
          headerShown: false,
          // headerRight: () => (
          //   <TabBarIcon
          //     name="checkmark-circle"
          //     color={colorScheme === "dark" ? "#fff" : "#000"}
          //   />
          // ),
        }}
      />

      <Stack.Screen name="confirm" />
      <Stack.Screen name="description" />
      <Stack.Screen name="image-view" options={{ headerShown: false }} />
    </Stack>
  );
}
