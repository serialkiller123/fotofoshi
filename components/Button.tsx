import { Colors } from "@/constants/Colors";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary"; // Define variants if needed
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = [styles.button, styles[variant], style];
  const textStyles = [styles.text, styles[`${variant}Text`], textStyle];

  return (
    <TouchableOpacity style={buttonStyles} {...props}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded button
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: {
    backgroundColor: Colors.light.themeColor,
  },
  secondary: {
    backgroundColor: "#F1F5F9",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#334155",
  },
});

export default Button;
