import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NavigationHeaderProps {
  title: string;
  titleColor?: string;
  iconColor?: string;
  onBack?: () => void;
}

const GlobalHeader: React.FC<NavigationHeaderProps> = ({
  title,
  titleColor = "white",
  iconColor = "white",
  onBack,
}) => {
  const statusBarHeight = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
  return (
    <View style={[styles.header, { paddingTop: statusBarHeight }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    marginBottom: 20,
    // paddingTop: 20,
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

export default GlobalHeader;
