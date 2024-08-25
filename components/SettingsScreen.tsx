import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { UserContext } from "@/context/UserContext";
import {
  setSettings,
  deleteSettings,
  deleteAuthData,
} from "@/services/tokenService";
import { router } from "expo-router";
import { createAxiosInstance, handleError } from "@/services/api";
import Button from "./Button";
import CustomModal from "./CustomModal";
import NavigationHeader from "./NavigationHeader";
import GlobalHeader from "./GlobalHeader";

const SettingsScreen = () => {
  const { baseURL, apiKey, authToken, initializeSettings, user } =
    useContext(UserContext);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [websiteDomainInput, setWebsiteDomainInput] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [keyStatus, setKeyStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const axios = createAxiosInstance(websiteDomainInput, apiKeyInput);

  const checkApiKeyValidity = async () => {
    if (!apiKeyInput) {
      setIsKeyValid(false);
      setKeyStatus("API Key is required.");
      return false;
    }

    try {
      const response = await axios.get(`/api/validate-apikey/${apiKeyInput}`);

      // console.log(response.data);

      if (response.data.valid) {
        setIsKeyValid(true);
        setKeyStatus("Valid key");
        // console.log(response.data.message);
        return true;
      } else {
        setIsKeyValid(false);
        setKeyStatus("InValid key");
        // console.log(response.data.message);
        return false;
      }
    } catch (error) {
      handleError(error);
      console.error("API Key validation failed:", error);
      setIsKeyValid(false);
      setKeyStatus("Error validating API key");
      return false;
    }
  };

  useEffect(() => {}, [user, baseURL, authToken]);

  useEffect(() => {
    setApiKeyInput(apiKey);
    setWebsiteDomainInput(baseURL);
  }, [baseURL, apiKey]);

  const handleSave = async () => {
    if (!apiKeyInput || !websiteDomainInput) {
      Alert.alert("Error", "Please enter both API Key and Website Domain.");
      return;
    }
    const isKeyValid = await checkApiKeyValidity();
    if (!isKeyValid) {
      return;
    }

    try {
      setLoading(true);
      await setSettings(apiKeyInput, websiteDomainInput);
      ToastAndroid.show("Settings saved successfully.", ToastAndroid.SHORT);
      // Alert.alert("Success", "Settings saved successfully.");
      initializeSettings();
      router.replace("/login");
    } catch (error) {
      setLoading(false);
      ToastAndroid.show("Failed to save settings.", ToastAndroid.SHORT);
      // Alert.alert("Error", "Failed to save settings.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSettings();
      await deleteAuthData();
      Alert.alert("Success", "Settings deleted successfully.");
      setApiKeys([]);
      setKeyStatus("");
      setIsKeyValid(false);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to delete settings.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        title={"Settings"}
        titleColor="#64748B"
        iconColor="#64748B"
        onBack={() => router.back()}
      />
      {!apiKey && !baseURL && (
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>API Key:</Text>
            <TextInput
              style={styles.input}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
            />
            {keyStatus && (
              <Text style={{ color: isKeyValid ? "green" : "red" }}>
                {keyStatus}
              </Text>
            )}

            <Text style={styles.label}>Website Domain:</Text>
            <TextInput
              style={styles.input}
              value={websiteDomainInput}
              onChangeText={setWebsiteDomainInput}
            />
          </View>
          <View
            style={{
              padding: 20,
              width: "100%",
            }}
          >
            <Button
              title={loading ? "Validating..." : "Save settings"}
              onPress={handleSave}
              disabled={loading}
              style={{ width: "100%" }}
            />
          </View>
        </View>
      )}

      {apiKey && baseURL && (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.savedlabel}>API Key:</Text>
              <Text selectable style={styles.savedText}>
                {apiKey}
              </Text>

              {keyStatus && (
                <Text
                  style={[
                    styles.keyStatus,
                    { color: isKeyValid ? "green" : "red" },
                  ]}
                >
                  {keyStatus}
                </Text>
              )}

              <Text style={styles.savedlabel}>Website Domain:</Text>
              <Text selectable style={styles.savedText}>
                {baseURL}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 20,

              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              style={{ marginBottom: 15 }}
              title="Check Api Key Status"
              onPress={checkApiKeyValidity}
            />
            <Button
              style={{ backgroundColor: "orangered" }}
              title="Delete Api Settings"
              onPress={handleOpenModal}
            />
          </View>
        </>
      )}

      <CustomModal
        visible={modalVisible}
        onDismiss={handleCloseModal}
        onConfirm={handleDelete}
        // iconName="check-circle"
        title="Are you sure?"
        description="Are you sure you want to delete your API settings?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

  savedlabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  savedText: {
    fontSize: 16,
    color: "silver",
    marginBottom: 12,
  },
  keyStatus: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "500",
  },
});

export default SettingsScreen;
