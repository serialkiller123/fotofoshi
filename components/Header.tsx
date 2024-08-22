import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface HeaderProps {
  title: string;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({ title, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    width: "100%",
    height: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "left",
  },
});

export default Header;
