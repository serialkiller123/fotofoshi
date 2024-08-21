import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NavigationHeaderProps {
  title: string;
  onBack?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onBack,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    // paddingTop: 20,
    zIndex: 1000,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "white",
    flex: 1,
  },
});

export default NavigationHeader;
