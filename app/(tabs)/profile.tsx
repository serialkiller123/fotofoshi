import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useContext } from "react";
import { deleteAuthData, getToken } from "../../services/tokenService";
import axios from "axios";
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";
import { handleError } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import GlobalHeader from "@/components/GlobalHeader";

export default function Profile() {
  const { user, loading, baseURL } = useContext(UserContext);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const handleLogout = async () => {
    try {
      const token = await getToken();
      // console.log("token---", token);

      const csrfResponse = await axios.get(`${baseURL}/sanctum/csrf-cookie`);
      const csrfToken = csrfResponse.data.csrfToken;

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      if (token) {
        const response = await axios.post(
          `${baseURL}/api/logout`,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("Logout response", response.data);
        ToastAndroid.show(`${response.data.message}`, ToastAndroid.SHORT);

        await deleteAuthData();
        router.replace("/login");
      }
    } catch (e) {
      handleError(e);
      Alert.alert("Logout Error", "Unable to logout");
    }
  };

  const handleLogin = async () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        title={"Profile"}
        titleColor="#64748B"
        iconColor="#64748B"
        onBack={() => router.back()}
      />
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Ionicons name="person" size={40} color="#D9D9D9" />
        </View>
      </View>
      <View style={styles.userinfo}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      {user ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#94A3B8"
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
          <Ionicons
            name="log-in-outline"
            size={24}
            color="#94A3B8"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  iconContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  iconBackground: {
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userinfo: {
    marginBottom: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#94A3B8",
  },
  email: {
    fontSize: 16,
    color: "#94A3B8",
  },
  logoutButton: {
    justifyContent: "space-between",
    width: 300,
    height: 60,
    flexDirection: "row",
    padding: 15,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#94A3B8",
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});
