import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ConfirmScreen() {
  const router = useRouter();
  const { photo } = useLocalSearchParams<{ photo: string }>();

  console.log("Photo:", photo);

  const handleConfirm = () => {
    // Handle the confirmation (e.g., upload the photo)
    console.log("Photo confirmed:", photo);
    // Navigate to another screen or perform an action
  };

  const handleDiscard = () => {
    // Handle discarding the photo
    console.log("Photo discarded");
    // Navigate back to the camera screen or perform an action
    router.push("/"); // Adjust this route to fit your navigation structure
  };

  return (
    <View style={styles.container}>
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDiscard}>
          <Text style={styles.buttonText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
