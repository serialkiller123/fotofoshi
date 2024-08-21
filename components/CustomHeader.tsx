import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomHeaderProps {
  onSettingsPress: (event: any) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ onSettingsPress }) => {
  const statusBarHeight = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
  return (
    <View style={[styles.headerContainer, { paddingTop: statusBarHeight }]}>
      <Image
        source={require("../assets/images/FotoFoshiLogo.png")}
        style={styles.logo}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={onSettingsPress}>
        <Ionicons name="settings" size={16} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    // height: 60,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: "contain",
  },
  iconContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
});

export default CustomHeader;
