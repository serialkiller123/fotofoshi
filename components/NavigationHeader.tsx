import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NavigationHeaderProps {
  title: string;
  titleColor?: string;
  iconColor?: string;
  onBack?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  titleColor = "white",
  iconColor = "white",
  onBack,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 35,
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

    flex: 1,
  },
});

export default NavigationHeader;
