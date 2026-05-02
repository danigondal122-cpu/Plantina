import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView,Alert, Platform,TextInput,StyleSheet,ImageBackground } from "react-native";

import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { scheduleNotification } from '../utils/schedule_notification';
import { fetchUserPlants } from "../config/services/plants";
import { useSelector } from "react-redux";
import ErrorMessage from "../components/error";




const PlantRoutineScreen = ({navigation}) => {
  const [selectedDay, setSelectedDay] =useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
const rooms = ["Living Hall", "Bedroom", "Kitchen", "Balcony"];
 // or bind from input
const [wateringQuantity, setWateringQuantity] = useState('');
const [selectedHour, setSelectedHour] = useState('');
const [selectedMinute, setSelectedMinute] = useState('');
const [selectedAmPm, setSelectedAmPm] = useState('AM');
const [userPlants, setUserPlants] = useState([]);
const [showPlantPicker, setShowPlantPicker] = useState(false);
const [selectedPlantImage, setSelectedPlantImage] = useState(null); 
const [plantName, setPlantName] = useState("Peace Lily");
const user=useSelector((state)=>state.auth.user);
const [error,setError]=useState(null)


const [wateringTime, setWateringTime] = useState('');
const [showDropdown, setShowDropdown] = useState(false);



const GetUserPlants = async () => {
  try {
   
    const plants = await fetchUserPlants(user?.uid);

    
    const plantsWithImages = await Promise.all(
      plants.map(async (plant) => {
        let imageUrl = plant.image;
        
       
       
        return { ...plant, image: imageUrl };
      })
    );

    setUserPlants(plantsWithImages);
    setShowPlantPicker(true);
  } catch (error) {
    Alert.alert("Error fetching plants");
  }
};


const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const minute = m.toString().padStart(2, '0');
      const ampm = h < 12 ? 'AM' : 'PM';
      times.push(`${hour}:${minute} ${ampm}`);
    }
  }
  return times;
};





const scheduleWateringAlarm = () => {
  if (selectedDay === null || !selectedHour || !selectedMinute || !selectedAmPm) {
   setError("Please select day, hour, minute, and AM/PM.");
    return;
  }

  let hours = parseInt(selectedHour, 10);
  const minutes = parseInt(selectedMinute, 10);
  const isPM = selectedAmPm === "PM";

  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;


  const jsDayIndex = (selectedDay + 1) % 7;
  

  scheduleNotification(hours, minutes, jsDayIndex, `🌿 Time to water your ${plantName}: ${wateringQuantity || "quantity not set"}`);
  Alert.alert("✅ Notification scheduled", `Reminder set for ${selectedHour}:${selectedMinute} ${selectedAmPm}`);
};




  return (
    <View className="w-full h-full">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

    <ScrollView className={` `}>
      {/* Back Button */}
      <View className="bg-teal-900 pb-14">
      <TouchableOpacity onPress={() => navigation.goBack()} className={`absolute top-4 mt-8 left-4 z-10 p-2 bg-gray-200 rounded-full`}>
      <Feather name="chevron-left" size={24} color="black" />

      </TouchableOpacity>

      {showPlantPicker && (
         
  <ScrollView
    horizontal
    className="absolute top-48 w-[100%] z-[99] p-8"
    showsHorizontalScrollIndicator={false}
  >
    <ImageBackground
    source={require('../../assets/images/materials/almanac.png')} 
    style={{  width: '100%', zIndex: 99999 ,height:'50px'}}
  >
    <View className="flex flex-row p-4 w-[1000px]">
    
    {userPlants.map((plant, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedPlantImage(plant.image);
          setPlantName(plant.name);
          setShowPlantPicker(false);
        }}
        className="items-center mx-2"
      >
        <Image
          source={{uri:plant.image}}
          className="w-20 h-20 rounded-full "
        />
        <Text className="text-md text-white mt-1">{plant.name}</Text>
      </TouchableOpacity>
    ))}
    </View>
     </ImageBackground>
  </ScrollView>
 
)}



      {/* Plant Image */}
      <TouchableOpacity onPress={GetUserPlants} className={`items-center relative top-12 z-[10] mt-12`}>
        <Image source={selectedPlantImage ? { uri: selectedPlantImage } : require('../../assets/images/plants/vase-1.png')} className={`w-52 h-52`} />
      </TouchableOpacity>
      
      </View>
      <View className={`bg-white relative bottom-6  h-full rounded-t-[20px] p-6 `}>
        {/* Title & Edit */}
        <View className={`flex-row gap-x-4`}>
          <Text className={`text-2xl font-bold`}>{plantName}</Text>
          <TouchableOpacity className="mt-2">
          <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Last Watered */}
        <Text className={`text-teal-900 mt-8`}>Last watered on</Text>
        <Text className={`text-lg font-semibold`}>Sunday May 10</Text>

        {/* Placed In */}
        <Text className={`text-teal-900 mt-4`}>Placed in</Text>
        <View className="mt-2">
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false} 
    contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}
  >
    {rooms.map((room, index) => {
      const isSelected = selectedRoom === index;
      return (
        <TouchableOpacity
          key={index}
          onPress={() => setSelectedRoom(index)}
          className={`px-4 py-2 m-1 rounded-md ${
            isSelected ? "bg-teal-900" : "bg-gray-200"
          }`}
        >
          <Text className={`${isSelected ? "text-white" : "text-gray-700"}`}>
            {room}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
</View>
 
        {/* Watering Schedule */}
        <Text className={` font-bold text-xl mt-4`}>Watering Schedule</Text>
        <View className={`flex-row justify-between mt-2`}>
  {["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"].map((day, index) => {
    const isSelected = selectedDay === index;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedDay(index)}
        className={`w-10 h-10 ${
          isSelected ? "bg-teal-900" : "bg-gray-200"
        } rounded-md flex items-center justify-center`}
      >
        <Text className={`${
          isSelected ? "text-white" : "text-teal-900"
        } font-semibold`}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

        {/* Watering Time & Quantity */}
        <View className={`flex-col  justify-between my-6 mx-2`}>



        <View className="mt-4 flex flex-col gap-y-4">
  <Text className="text-teal-900 mb-2">Watering Time</Text>

  {/* Hour Dropdown */}
  <View>
  <Text className="mb-1 text-gray-700">Hour</Text>
  <ScrollView horizontal>
    {[...Array(12)].map((_, i) => {
      const hour = i + 1;
      return (
        <TouchableOpacity
          key={hour}
          className={`px-4 py-2 m-1 rounded-md ${selectedHour == hour ? "bg-teal-900" : "bg-gray-200"}`}
          onPress={() => setSelectedHour(hour)}
        >
          <Text className={selectedHour == hour ? "text-white" : "text-black"}>{hour}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
  </View>

  {/* Minute Dropdown */}
  <View>
  <Text className="mb-1 text-gray-700">Minute</Text>
<ScrollView horizontal>
  {[...Array(60)].map((_, i) => {
    const minute = i;
    return (
      <TouchableOpacity
        key={minute}
        className={`px-4 py-2 m-1 rounded-md ${selectedMinute == minute ? "bg-teal-900" : "bg-gray-200"}`}
        onPress={() => setSelectedMinute(minute.toString().padStart(2, '0'))}
      >
        <Text className={`${selectedMinute == minute ? "text-white" : "text-gray-700"}`}>
          {minute.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  })}
</ScrollView>
</View>

  {/* AM/PM Toggle */}
  <View>
  <Text className=" text-gray-700">Select</Text>
  <View className="flex-row ">
    {['AM', 'PM'].map((period) => (
      <TouchableOpacity
        key={period}
        className={`px-4 py-2 m-1 rounded-md ${selectedAmPm === period ? "bg-teal-900" : "bg-gray-200"}`}
        onPress={() => setSelectedAmPm(period)}
      >
        <Text className={selectedAmPm === period ? "text-white" : "text-black"}>{period}</Text>
      </TouchableOpacity>
    ))}
  </View>
  </View>
  
</View>



  <View className="mt-14">
    <Text className="text-teal-900">Watering Quantity</Text>
    <TextInput
     
      placeholder="e.g. 0.25 lt"
      className="text-lg font-semibold text-black p-0 m-0"
      underlineColorAndroid="transparent"
      onChangeText={(text) => setWateringQuantity(text)}
    />
          </View>
        </View>

      

        {/* Add to Garden Button */}
        <TouchableOpacity onPress={scheduleWateringAlarm} className={`mt-14 bg-teal-900 py-3 rounded-lg`}>
          <Text className={`text-white text-center font-semibold`}>Set Plant Remainder</Text>
        </TouchableOpacity>

        
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
};

export default PlantRoutineScreen;














const styles = StyleSheet.create({
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});