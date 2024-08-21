import { useNavigation, router, useFocusEffect } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { createAxiosInstance } from "../services/api";
import { getSettings, setAuthData } from "@/services/tokenService";
import { UserContext } from "@/context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import Button from "@/components/Button";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function LoginScreen() {
  const { baseURL, authToken, apiKey, initializeSettings } =
    useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [baseURL, setBaseURL] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      initializeSettings();
    }, [initializeSettings])
  );

  const axios = createAxiosInstance(baseURL, apiKey);

  const login = (data) => axios.post("/api/login", data);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("All Fields Required", "All Fields are Required");
      return;
    }

    if (!apiKey || !baseURL) {
      Alert.alert(
        "Settings Required",
        "Please enter your API Key and Website Domain in the settings screen.",
        [
          {
            text: "Go to Settings",
            onPress: () => router.push("/homesettings"),
          },
        ]
      );
      return;
    }

    try {
      setLoading(true);

      await axios.get(`${baseURL}/sanctum/csrf-cookie`);

      const response = await login({
        email: email.toLowerCase(),
        password: password,
      });

      const { token, user } = response.data;

      console.log("token", token, "user", user);

      setLoading(false);
      await setAuthData(token, user);
      router.replace("/(tabs)");
      ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
    } catch (e) {
      setLoading(false);
      Alert.alert(
        "Login Failed",
        e.response?.data?.errors || "An error occurred"
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Login to FotoFoshi</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View
              style={{
                marginTop: 20,
                marginBottom: 40,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                title={loading ? "Loggin in..." : "Login"}
                onPress={handleLogin}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </View>
          </View>

          <TouchableNativeFeedback onPress={() => router.push("/register")}>
            <Text style={styles.link}>
              Don't have an account? <Text style={styles.sptext}>Sign Up</Text>
            </Text>
          </TouchableNativeFeedback>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "#fff",
    // overflow: "scroll",
  },
  innerContainer: {
    flex: 1,
    marginTop: 65,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    // backgroundColor: "red",
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "1px #F3F4F6",
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#111827",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#4B5563",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 7,
    marginBottom: 15,
  },
  link: {
    marginTop: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  sptext: {
    color: Colors.light.themeColor,
  },
});
