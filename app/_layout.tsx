import React, { useCallback, useEffect, useState } from "react";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useFocusEffect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getSettings, getToken } from "../services/tokenService";
import { UserProvider } from "@/context/UserContext";
import CustomHeader from "@/components/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [baseURL, setBaseURL] = useState<string | null>(null);
  const [apiKey, setApikey] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await getToken();
      const settings = await getSettings();

      setApikey(settings.apiKey);
      setBaseURL(settings.websiteDomain);
      setToken(res);
    };

    fetchSettings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (loaded) {
        if (!token || !baseURL || !apiKey) {
          router.replace("/login");
        } else {
          router.replace("/(tabs)");
        }
      }
    }, [token, loaded, baseURL, apiKey])
  );

  if (!loaded) {
    return null;
  }

  const myDefaultTheme: Theme = {
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "#F9FAFB",
      card: "rgb(255, 255, 255)",
      text: "rgb(28, 28, 30)",
      border: "rgb(216, 216, 216)",
      notification: "rgb(255, 59, 48)",
    },
  };

  return (
    <UserProvider>
      <Provider>
        <ThemeProvider value={myDefaultTheme}>
          <StatusBar backgroundColor="transparent" style="dark" translucent />
          {token && baseURL && apiKey ? <AppStack /> : <AuthStack />}
        </ThemeProvider>
      </Provider>
    </UserProvider>
  );
}

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false, header: () => null }}>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, header: () => null }}
      />
    </Stack>
  );
}

function AuthStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        // options={{
        //   headerShown: true,
        //   header: (props) => (
        //     <CustomHeader
        //       {...props}
        //       onSettingsPress={() => router.push("/homesettings")}
        //     />
        //   ),
        // }}
      />
      <Stack.Screen
        name="register"
        // options={{
        //   headerShown: true,
        //   header: (props) => (
        //     <CustomHeader
        //       {...props}
        //       onSettingsPress={() => router.push("/homesettings")}
        //     />
        //   ),
        // }}
      />
      <Stack.Screen
        name="homesettings"
        // options={{
        //   headerShown: true,
        //   title: "Settings",
        //   headerShadowVisible: false,
        //   headerTitleStyle: { color: "#64748B" },
        //   headerStyle: { backgroundColor: "#F9FAFB" },
        //   headerBackImageSource: require("../assets/images/back.png"),
        // }}
      />
    </Stack>
  );
}
