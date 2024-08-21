import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  FlatList,
} from "react-native";
import { UserContext } from "@/context/UserContext";
import { createAxiosInstance, handleError } from "@/services/api";
import { Redirect, router } from "expo-router";

// Define types for image data
interface ImageData {
  id: string;
  filename: string;
  description?: string;
}

// Define types for the component props

const ImageGrid2: React.FC = () => {
  const { baseURL, authToken, apiKey, images } = useContext(UserContext);
  const [imageList, setImageList] = useState<ImageData[]>([]);

  useEffect(() => {
    setImageList(images);
  }, [images]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.imageContainer}
      onPress={() => {
        router.push(`/ImageDetails?id=${item.id}`);
      }}
    >
      <Image
        source={{ uri: `${baseURL}/storage/${item.filename}` }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {images.length === 0 ? (
        <Text style={styles.noImages}>No images available.</Text>
      ) : (
        <FlatList
          data={imageList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.flatlist}
          numColumns={3}
          ListEmptyComponent={
            <Text style={styles.noImages}>No images available.</Text>
          }
          contentContainerStyle={styles.container}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  flatlist: {
    flex: 1,
  },
  imageContainer: {
    margin: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  noImages: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
  },
});

export default ImageGrid2;
