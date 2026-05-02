import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { firestore } from "../config/firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";


import Sunflower from "../components/sprites/sunflower";
import Dandelion from "../components/sprites/dandelion";

const avatars = [
  { name: "sunflower", image: require("../../assets/avatars/sunflower.png") },
  { name: "dandelion", image: require("../../assets/avatars/dandelion.png") },
];

const avatarComponents = {
  sunflower: Sunflower,
  dandelion: Dandelion,
};

export default function AvatarSelectionScreen({ navigation }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleNext = async () => {
    if (!selectedAvatar) {
      Alert.alert("Please select an avatar to continue.");
      return;
    }

    if (user) {
      try {
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, {
          avatar: selectedAvatar.name,
        });
        dispatch(setUser({
          ...user,
          avatar: selectedAvatar.name,
        }));

        navigation.replace("MainScreen");
      } catch (error) {
        console.error("Error updating avatar:", error);
        Alert.alert("Error", "Something went wrong while saving your avatar.");
      }
    } else {
      Alert.alert("User not found", "You must be logged in to select an avatar.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121026", alignItems: "center", paddingTop: 50 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Select your avatar
      </Text>

      <FlatList
  data={avatars}
  keyExtractor={(item) => item.name}
  numColumns={2}
  contentContainerStyle={{ alignItems: "center" }}
  renderItem={({ item }) => {
    const AvatarComponent = avatarComponents[item.name];
    const isSelected = selectedAvatar?.name === item.name;
    const isDandelion = item.name === "dandelion";

    return (
      <View style={{ alignItems: "center", margin: 10 }}>
        <TouchableOpacity
          onPress={() => setSelectedAvatar(item)}
          style={{
            padding: 0,
            backgroundColor: isSelected
              ? isDandelion
                ? "transparent"
                : "#ff5600"
              : "#4C2A85",
            borderRadius: 100,
          }}
        >
          <AvatarComponent isSelected={selectedAvatar?.name} />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            marginTop: 5,
            fontWeight: isSelected ? "bold" : "normal",
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  }}
/>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 30,
          backgroundColor: "#ff5600",
          paddingVertical: 10,
          paddingHorizontal: 40,
          borderRadius: 25,
        }}
        onPress={handleNext}
        disabled={!selectedAvatar || isLoading}
      >
        {isLoading ? (
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Loading...</Text>
        ) : (
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Next</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
