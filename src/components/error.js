import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function ErrorMessage({ message = "Something went wrong.", onClose }) {
  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/images/error.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
   
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    position: "relative",
    width: 350,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    position: "absolute",
    color: "black",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Arial",
    top: 140,
    paddingHorizontal: 10,
  },
});
