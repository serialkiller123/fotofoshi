import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ToastAndroid,
  BackHandler,
} from "react-native";
import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
  useNavigation,
} from "expo-router";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { handleError } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import Header from "@/components/Header";
import CustomModal from "@/components/CustomModal";
import { IconButton } from "@/components/IconButton";

const ImageDetails = () => {
  const { baseURL, authToken, fetchImages, user } = useContext(UserContext);
  const { id } = useLocalSearchParams();
  const [imageDetails, setImageDetails] = useState<any>(null);
  const [author, setAuthor] = useState(null);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/images/${id}`,

          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setImageDetails(response.data);
      } catch (error) {
        console.error("Error fetching image details:", error);
        handleError(error);
      }
    };

    fetchImageDetails();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (imageDetails) {
        try {
          const response = await axios.get(
            `${baseURL}/api/user/${imageDetails.user_id}`,

            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setAuthor(response.data);
          // console.log(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          handleError(error);
        }
      }
    };

    fetchUser();
  }, [imageDetails]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/images/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setModalVisible(false);
      fetchImages();

      ToastAndroid.show("Image deleted successfully", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete image");
    }
  };

  if (!imageDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Header title={"Foto Details"} style={styles.header} />
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${baseURL}/storage/${imageDetails.filename}` }}
          width={300}
          height={300}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.desContainer}>
          <Text style={styles.description}>{imageDetails.description}</Text>
        </View>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={12} color="#94A3B8" />
            <Text style={styles.infoText}>
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(imageDetails?.created_at))}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={12} color="#94A3B8" />
            <Text style={styles.infoText}>{author?.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        {imageDetails && author && imageDetails.user_id === user.id && (
          <Button
            textStyle={{ color: "#CC3B3B" }}
            style={styles.button}
            title="Delete Photo"
            onPress={handleOpenModal}
          />
        )}
        <IconButton
          icon="arrow-back"
          color="#CC3B3B"
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onDismiss={handleCloseModal}
        onConfirm={handleDelete}
        // iconName="check-circle"
        title="Are you sure?"
        description="You can't undo this delete operation. Are you sure you want to delete this photo?"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  header: {
    marginTop: 10,
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 15,
  },
  desContainer: {
    width: 250,
    paddingHorizontal: 1,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    color: "#4B5563",
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoList: {
    width: 250,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#94A3B8",
  },
  button: {
    width: 250,
    backgroundColor: "#EEEEEF",
    marginTop: 10,
  },
  footer: {
    width: "100%",
    height: 200,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ImageDetails;
