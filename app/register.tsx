import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableNativeFeedback,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { createAxiosInstance } from "@/services/api";
import { setAuthData } from "@/services/tokenService";
import { UserContext } from "@/context/UserContext";
import { Colors } from "@/constants/Colors";
import Button from "@/components/Button";

export default function RegisterScreen() {
  const { baseURL, apiKey } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const axios = createAxiosInstance(baseURL, apiKey);

  const register = (data) => axios.post("/api/register", data);

  const handleRegister = async () => {
    if (
      name == "" ||
      email == "" ||
      password == "" ||
      passwordConfirmation == ""
    ) {
      Alert.alert("Required Fields", "All Fields are required");
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

          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    try {
      setLoading(true);
      await axios.get(`${baseURL}/sanctum/csrf-cookie`);

      const response = await register({
        name: name,
        email: email.toLowerCase(),
        password: password,
        password_confirmation: passwordConfirmation,
      });

      const { token, user } = response.data;

      // console.log("token", token, "user", user);

      setLoading(false);
      await setAuthData(token, user);
      router.replace("/login");
      ToastAndroid.show(
        "Registration Successful! Please login with your credentials.",
        ToastAndroid.SHORT
      );
    } catch (e) {
      console.error(e.response.data);
      Alert.alert(e.response?.data?.errors);
      setLoading(false);
    }
    //
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Register to FotoFoshi</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
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
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
            />

            <Button
              title="Login"
              onPress={handleRegister}
              disabled={loading}
              style={{ width: "100%" }}
            />
          </View>

          <TouchableNativeFeedback onPress={() => router.push("/login")}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.sptext}>Login</Text>
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
    marginTop: 15,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    // backgroundColor: "red",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 7,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#4B5563",
  },
  sptext: {
    color: Colors.light.themeColor,
  },
  link: {
    marginTop: 10,
    color: "#6B7280",
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "1px #F3F4F6",
    height: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
