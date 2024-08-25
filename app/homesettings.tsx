import { StyleSheet, View } from "react-native";
import React from "react";
import SettingsScreen from "@/components/SettingsScreen";
import NavigationHeader from "@/components/NavigationHeader";
import { router } from "expo-router";

const homesettings = () => {
  return (
    <View style={styles.container}>
      <SettingsScreen />
    </View>
  );
};

export default homesettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
