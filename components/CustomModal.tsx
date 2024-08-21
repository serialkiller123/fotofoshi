import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";

interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  iconColor?: string;
  iconName?: string;
  btn1Color?: string;
  btn2Color?: string;
  btn1Textcolor?: string;
  btn2Textcolor?: string;
  button1text?: string;
  button2text?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  description,
  iconName,
  iconColor,
  btn1Color = "#F1F5F9",
  btn2Color = "#CC3B3B",
  btn1Textcolor = "#334155",
  btn2Textcolor = "white",
  button1text = "Cancel",
  button2text = "Delete",
}) => {
  return (
    <Portal>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.content}>
              <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
              <View style={styles.iconContainer}>
                {iconName && (
                  <MaterialIcons name={iconName} size={30} color={iconColor} />
                )}
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  buttonColor={btn2Color}
                  textColor={btn2Textcolor}
                  onPress={onConfirm}
                  style={styles.confirmButton}
                >
                  {button2text}
                </Button>
                <Button
                  mode="contained-tonal"
                  buttonColor={btn1Color}
                  textColor={btn1Textcolor}
                  onPress={onDismiss}
                  style={styles.cancelButton}
                >
                  {button1text}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: 300,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 20,
    elevation: 5,
  },
  content: {
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 1,
    right: 10,
  },
  closeText: {
    fontSize: 15,
    color: "gray",
  },
  iconContainer: {
    marginBottom: 10,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  confirmButton: {
    backgroundColor: "#d9534f",
    color: "white",
  },
  cancelButton: {
    borderColor: "#d9534f",
    color: "#d9534f",
  },
});

export default CustomModal;
