import {
  Camera,
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from "expo-camera";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ToastAndroid,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import Button from "@/components/Button";
import NavigationHeader from "@/components/NavigationHeader";
import { UserContext } from "@/context/UserContext";
import { ActivityIndicator } from "react-native-paper";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { handleError } from "@/services/api";
import mime from "mime";
import axios from "axios";
import CustomModal from "@/components/CustomModal";
import { Slider } from "react-native-elements";
import { IconButton } from "@/components/IconButton";

export default function index() {
  const {
    dispatchPhoto,
    selectedImage,
    setSelectedImage,
    fetchImages,
    baseURL,
    authToken,
  } = useContext(UserContext);
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [captureReady, setCaptureReady] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [cameraProps, setCameraProps] = useState<{
    zoom: number;
    facing: CameraType;
    flash: FlashMode;
    animateShutter: boolean;
    enableTorch: boolean;
  }>({
    zoom: 0,
    facing: "back",
    flash: "on",
    animateShutter: false,
    enableTorch: false,
  });

  const cameraRef = useRef(null);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  // useEffect(() => {
  //   if (cameraPermission && cameraPermission.granted) {
  //
  //   }
  // }, [cameraPermission]);

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button
          style={{ marginTop: 10, marginHorizontal: 50 }}
          onPress={() => {
            requestCameraPermission();
          }}
          title="grant permission"
        />
      </View>
    );
  }

  const toggleProperty = (prop, option1, option2) => {
    setCameraProps((current) => ({
      ...current,
      [prop]: current[prop] === option1 ? option2 : option1,
    }));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync();
        setPhoto(picture.uri);
      } catch (err) {
        // console.log("Error while taking the picture : ", err);
      }
    }
  };

  //zoom in
  const zoomIn = () => {
    setCameraProps((current) => ({
      ...current,
      zoom: Math.min(current.zoom + 0.1, 1),
    }));
  };

  //zoom out
  const zoomOut = () => {
    setCameraProps((current) => ({
      ...current,
      zoom: Math.max(current.zoom - 0.1, 0),
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const getFileExtension = (uri) => {
    const parts = uri.split(".");
    return parts.length > 1 ? parts.pop() : "jpg";
  };

  const generateUniqueFileName = () => {
    return `photo_${Date.now()}.jpg`;
  };

  const uploadImage = async () => {
    const fileExtension = getFileExtension(photo);
    const uniqueFileName = generateUniqueFileName();

    const formData = new FormData();

    const uri = Platform.OS === "ios" ? photo?.replace("file://", "") : photo;

    const mimeType = mime.getType(fileExtension) || "image/jpeg";

    formData.append("image", {
      uri,
      type: mimeType,
      name: uniqueFileName,
    });
    formData.append("description", description);

    try {
      const { data } = await axios.post(`${baseURL}/api/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (data && data.id) {
        return data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await uploadImage();
      if (response && response.id) {
        router.replace(`/image-view?id=${response.id}`);

        ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
        setConfirmation(false);
        setDescription("");
        setPhoto(null);
        fetchImages();
      } else {
        ToastAndroid.show("Failed to upload image", ToastAndroid.SHORT);
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const handleDiscard = () => {
    setConfirmation(false);
    setDescription("");
    setPhoto(null);
    setModalVisible(false);
  };

  return (
    <>
      <>
        {!photo ? (
          <View style={styles.container}>
            <NavigationHeader title="Back" onBack={() => router.back()} />

            <CameraView
              style={styles.camera}
              zoom={cameraProps.zoom}
              facing={cameraProps.facing}
              flash={cameraProps.flash}
              animateShutter={cameraProps.animateShutter}
              enableTorch={cameraProps.enableTorch}
              ref={cameraRef}
            />
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
                onPress={() => toggleProperty("facing", "front", "back")}
              >
                <FontAwesome name="refresh" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : photo && !description && !confirmation ? (
          <View style={styles.previewContainer}>
            <NavigationHeader
              title="Confirm Photo"
              onBack={() => {
                setPhoto(null);
              }}
            />
            <Image
              progressiveRenderingEnabled
              source={{ uri: photo }}
              style={styles.preview}
            />
            <View style={styles.confirmControls}>
              <Button
                style={styles.confirmbutton}
                title="Confirm"
                variant="primary"
                onPress={() => {
                  setConfirmation(true);
                }}
              />
              <Button
                style={styles.confirmbutton}
                variant="secondary"
                title="Discard"
                onPress={handleOpenModal}
              />
            </View>
          </View>
        ) : photo && confirmation ? (
          <View style={styles.descontainer}>
            <NavigationHeader
              title="Description"
              titleColor="#64748B"
              iconColor="#64748B"
              onBack={() => {
                setConfirmation(false);
              }}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Write a Description here"
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline={true}
              />
            </View>
            <View style={styles.desbuttonContainer}>
              <Button
                style={styles.confirmbutton}
                title="Submit"
                variant="primary"
                onPress={handleSubmit}
              />
              <Button
                style={styles.confirmbutton}
                title="Discard"
                variant="secondary"
                onPress={handleOpenModal}
              />
            </View>
          </View>
        ) : null}
      </>
      <CustomModal
        visible={modalVisible}
        onDismiss={handleCloseModal}
        onConfirm={handleDiscard}
        button2text="Discard"
        // iconName="check-circle"
        title="Are you sure?"
        description="Are you sure you want to discard this photo?"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  topControlsContainer: {
    height: 100,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
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
  loader: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  descontainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 110,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  input: {
    height: 200,
    padding: 20,
    textAlignVertical: "top",
    borderRadius: 10,
  },
  desbuttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    // width: "100%",
    padding: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sliderContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: "row",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  bottomControlsContainer: {
    height: 100,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
