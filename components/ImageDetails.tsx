import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { UserContext } from "@/context/UserContext";
import Button from "./Button";
import { createAxiosInstance, handleError } from "@/services/api";

const ImageDetail = ({ imageId }) => {
  const { baseURL, authToken, apiKey, initializeSettings } =
    useContext(UserContext);
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const axios = createAxiosInstance(baseURL, apiKey);

  const getImage = async (id) => {
    try {
      const { data } = await axios.get(`/api/images-app/${id}`);
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const getUser = async (id) => {
    try {
      const { data } = await axios.get(`/api/user-x/${id}`);
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getImage(imageId);
        setImage(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching image:", error);
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (image) {
        try {
          const user = await getUser(image.user_id);
          setAuthor(user);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [image]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/images/${imageId}`);
      Alert.alert("Success", "Image deleted successfully");
      router.back();
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete image");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: `${baseURL}/storage/${image?.filename}` }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.details}>
        <Text style={styles.description}>{image?.description}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="gray" />
            <Text style={styles.infoText}>
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(image?.created_at))}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color="gray" />
            <Text style={styles.infoText}>{author?.name}</Text>
          </View>
        </View>
      </View>
      {image?.user_id === author?.id && (
        <Button title="Delete Photo" onPress={handleDelete} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  backButton: {
    marginTop: 20,
    marginLeft: 20,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 300,
  },
  details: {
    padding: 20,
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
});

export default ImageDetail;
