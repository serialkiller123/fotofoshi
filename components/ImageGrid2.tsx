import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { UserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { Image } from "react-native-elements";

interface ImageData {
  id: string;
  filename: string;
  description?: string;
}

const ImageGrid2: React.FC = () => {
  const { baseURL, images } = useContext(UserContext);
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
          numColumns={3}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noImages}>No images available.</Text>
          }
          contentContainerStyle={styles.flatlist}
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
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
