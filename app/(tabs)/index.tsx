import { Image, StyleSheet, Platform, View, Text } from "react-native";

import ImageGrid from "@/components/ImageGrid";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageGrid2 from "@/components/ImageGrid2";
import Header from "@/components/Header";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.contentContainer}>
        <Header title={"Feed"} />
        <ImageGrid2 />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 18,
    color: "#333",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
