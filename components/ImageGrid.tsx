import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { UserContext } from "@/context/UserContext";
import { createAxiosInstance, handleError } from "@/services/api";

interface ImageData {
  id: number;
  filename: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

const ImageGrid: React.FC = () => {
  const { baseURL, authToken, apiKey } = useContext(UserContext);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const axios = createAxiosInstance(baseURL, apiKey);

  const getImages = async () => {
    try {
      const { data } = await axios.get("/api/images-app");
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getImages();
        if (Array.isArray(data)) {
          setImages(data);
          setLoading(false);
        } else {
          console.error("Expected an array of images, but got:", data);
          setImages([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
        setLoading(false);
        setError("Error fetching images");
      }
    };
    fetchImages();
  }, []);

  console.log("images", images);

  const renderItem = ({ item }: { item: ImageData }) => (
    <TouchableOpacity
      key={item.filename}
      style={styles.imageContainer}
      onPress={() => {
        // Handle image press
      }}
    >
      <Image
        source={{ uri: `${baseURL}/storage/${item.filename}` }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
  // [baseURL]

  if (loading) {
    return <Text style={styles.noImages}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.noImages}>{error}</Text>;
  }

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={1}
      ListEmptyComponent={
        <Text style={styles.noImages}>No images available.</Text>
      }
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 120,
  },
  noImages: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
  },
});

export default ImageGrid;
