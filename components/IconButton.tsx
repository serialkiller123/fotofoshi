import * as React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const IconButton: React.FC<{
  icon: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}> = ({ icon, size, color, style, onPress }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <MaterialIcons
      name={icon}
      size={size ? size : 28}
      color={color ? color : "#f1f1f1"}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
