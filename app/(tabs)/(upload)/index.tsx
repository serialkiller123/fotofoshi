import {
  Camera,
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Entypo, FontAwesome, MaterialIcons } from "expo-vector-icons";
import Button from "@/components/Button";
import NavigationHeader from "@/components/NavigationHeader";

export default function index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
    if (camera) {
      const picture = await camera.takePictureAsync();
      if (picture) {
        const uri = picture?.uri;
        console.log(uri);
        setPhoto(uri);
      }
    }
  };

  // const openCamera = async () => {
  //   const result = await ImagePicker.launchCameraAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //     allowsMultipleSelection: true,
  //     selectionLimit: 1,
  //   });
  //   if (!result.canceled) {
  //     setPhoto(result.assets[0].uri);
  //   }
  // };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <>
      {!photo ? (
        <View style={styles.container}>
          <NavigationHeader title="Back" onBack={() => router.back()} />
          <CameraView style={styles.camera} facing={facing} ref={setCamera}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <MaterialIcons name="photo-library" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={takePicture}
              >
                <Entypo name="controller-record" size={60} color="#FFC700" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <FontAwesome name="refresh" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <NavigationHeader
            title="Confirm Photo"
            onBack={() => setPhoto(null)}
          />
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.confirmControls}>
            <Button
              style={styles.confirmbutton}
              title="Confirm"
              variant="primary"
              onPress={() =>
                router.push({ pathname: "/description", params: { photo } })
              }
            />
            <Button
              style={styles.confirmbutton}
              variant="secondary"
              title="Discard"
              onPress={() => setPhoto(null)}
            />
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "transparent",
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  confirmControls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  confirmbutton: {
    width: 150,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 50,
    height: 50,
    borderRadius: 999,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "white",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
