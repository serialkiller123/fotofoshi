import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SettingsScreen from "@/components/SettingsScreen";

const settings = () => {
  return (
    <View style={styles.container}>
      <SettingsScreen />
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
