import { useState } from "react";
import { View, Text,Alert, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from "firebase/firestore";
import {firestore} from '../config/firebase.config'
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import Error from '../components/error'
import LoadingScreen from "../components/loading-flora";


export default function PlantScreen({navigation}) {
  const [image, setImage] = useState(require("../../assets/images/plants/vase-1.png")); 
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [price, setPrice] = useState("");
  const [waterCycles, setWaterCycles] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);




  const user=useSelector(state=>state.auth.user)
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage({ uri: result.assets[0].uri });
    }
  };


 const uploadImageToFreeImageHost = async (imageUri) => {
  
 
   const apiKey = "6d207e02198a847aa98d0a2a901485a5"; 
   const url = "https://freeimage.host/api/1/upload";
 
   const formData = new FormData();
   formData.append("source", {
     uri: imageUri,
     type: "image/jpeg", 
     name: "image.jpg",
   });
   formData.append("action", "upload");
   formData.append("key", apiKey);
 
   try {
     const response = await fetch(url, {
       method: "POST",
       body: formData,
     });
 
     const data = await response.json();
    
 
     if (data.status_code === 200) {
       return data.image.display_url; 
     } else {
       throw new Error("Image upload failed.");
     }
   } catch (error) {
     Alert.alert("Upload Error", "Failed to upload image.");
     console.error(error);
     return null;
   }
 };

  const handleSubmit = async () => {
    
    if (!name.trim()) setError("Name is required");
  if (!family.trim())  setError("Family is required");
  if (!price.trim())  setError("Price is required");
  if (!waterCycles.trim())  setError("Water cycles are required");
  if (!sunlight.trim()) setError("Sunlight is required");
  if (!temperature.trim())  setError("Temperature is required");
  if (!description.trim())  setError("Description is required");
   


    if (!name || !family || !price || !waterCycles || !sunlight || !temperature || !description) {
     
      return;
    }

    // Upload image
    setLoading(true)
    const imageUrl = await uploadImageToFreeImageHost(image.uri);
    if (!imageUrl) return;
    const plantId = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Save to Firebase
    try {
      
      await setDoc(doc(firestore, "plants",name), {
        uid:plantId,
        name,
        family,
        price,
        waterCycles,
        sunlight,
        temperature,
        description,
        image: imageUrl,
        createdBy:user.uid,
        stock:10
      });
      Alert.alert("Success", "Plant information submitted successfully!");
      setName("");
    setFamily("");
    setPrice("");
    setWaterCycles("");
    setSunlight("");
    setTemperature("");
    setDescription("");
    setImage(require("../../assets/images/plants/vase-1.png"));
    setError(null);
    setLoading(false)
    } catch (error) {
      Alert.alert("Error", "Failed to submit plant information.");
      setLoading(false)
      console.error(error);
    }
  };





  return (
    <View className="w-full h-full">
       {error && <Error message={error} onClose={() => setError(null)} />}
       {loading &&  <LoadingScreen/>}
    <ScrollView className="flex-1 bg-white">
      <View className="bg-white h-[40vh] relative top-4 z-[10] rounded-b-3xl overflow-hidden relative">
        <TouchableOpacity  onPress={() => navigation.goBack()} className="absolute top-12 left-6">
          <FontAwesome5 name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <View className="pt-28 w-[50%] px-6">
          <TextInput
           value={name}
           onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="black"
            className="text-3xl font-bold text-gray-900 border-b-[1px] border-black pb-1"
          />
          <TextInput
           value={family}
           onChangeText={setFamily}
            placeholder="Family"
            placeholderTextColor="black"
            className="text-lg text-gray-500 border-b-[1px] border-black pb-1 mt-2"
          />
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
            placeholderTextColor="black"
            className="text-lg text-gray-500 border-b-[1px] border-black pb-1 mt-2"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity onPress={pickImage} className="absolute right-0 bottom-0">
          <Image
            source={image}
            className="w-40 h-56"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="bg-green-900 h-[80vh] flex-1 px-6 pt-10 pb-16 ">
        <Text className="text-white text-3xl font-semibold">Plant care</Text>
        <View className="mt-4 gap-y-3">
          <View className="flex-row items-center gap-x-6">
            <FontAwesome5 name="tint" size={20} color="white" />
            <TextInput
              value={waterCycles}
              onChangeText={setWaterCycles}
              placeholder="Water cycles"
              placeholderTextColor="white"
              className="flex-1 border-b-2 border-white text-white text-lg pb-1"
            />
          </View>
          <View className="flex-row items-center gap-x-4">
            <FontAwesome5 name="sun" size={20} color="white" />
            <TextInput
              value={sunlight}
              onChangeText={setSunlight}
              placeholder="Sunlight"
              placeholderTextColor="white"
              className="flex-1 border-b-2 border-white text-white text-lg pb-1"
            />
          </View>
          <View className="flex-row items-center gap-x-6">
            <FontAwesome5 name="thermometer-half" size={20} color="white" />
            <TextInput
              value={temperature}
              onChangeText={setTemperature}
              placeholder="Temperature"
              placeholderTextColor="white"
              className="flex-1 border-b-2 border-white text-white text-lg pb-1"
            />
          </View>
        </View>

        <Text className="text-white text-2xl font-semibold mt-20">Information</Text>
        <TextInput
           value={description}
           onChangeText={setDescription}
          placeholder="Describe your plant ....."
          placeholderTextColor="white"
          className="border-b-2 border-white text-white text-md pb-1"
          multiline
        />

        <View className="">
          <TouchableOpacity   onPress={handleSubmit} className="bg-white w-[50%] my-20 mx-auto px-6 py-3 rounded-tl-xl rounded-br-xl">
            <Text className="text-green-900 text-lg font-semibold text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

     <View className="flex-row z-[999] justify-around items-center py-4 bg-white">
        <FontAwesome onPress={()=>{ navigation.navigate("MainScreen");  }} name="home" size={24} color="black" />
        <FontAwesome  onPress={()=>{ navigation.navigate("UserPlants");  }} name="heart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("CartScreen");  }}  name="shopping-cart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("ProfileScreen");  }}  name="user" size={24} color="gray" />
      </View>

      </View>
  );
}
