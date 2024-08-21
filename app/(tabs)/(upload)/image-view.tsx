import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { handleError } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";

const ImageDetails = () => {
  const { baseURL, authToken, apiKey, initializeSettings } =
    useContext(UserContext);
  const { id } = useLocalSearchParams();
  const [imageDetails, setImageDetails] = useState<any>(null);
  const [author, setAuthor] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        // const response = await axios.get(`${baseURL}/api/images-app/${id}`);
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
          // const user = await getUser(image.user_id);
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
          console.log(response.data);
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
      Alert.alert("Success", "Image deleted successfully");
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
    <View style={styles.container}>
      <Image
        source={{ uri: `${baseURL}/storage/${imageDetails.filename}` }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{imageDetails.title}</Text>
      <Text style={styles.description}>{imageDetails.description}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={20} color="gray" />
          <Text style={styles.infoText}>
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(imageDetails?.created_at))}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person" size={20} color="gray" />
          <Text style={styles.infoText}>{author?.name}</Text>
        </View>
      </View>
      {imageDetails && author && imageDetails.user_id === author.id && (
        <Button title="Delete Photo" onPress={handleDelete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
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

export default ImageDetails;
