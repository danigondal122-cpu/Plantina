import React from "react";
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import {fetchUserPlants} from '../config/services/plants'
import { useState,useEffect } from "react";

import Sunflower from "./sprites/sunflower";
import Dandelion from "./sprites/dandelion";


const Sidebar = ({navigation}) => {
 const [myPlants, setMyPlants] = useState([]);

 
  const avatarComponents = {
    sunflower: Sunflower,
    dandelion: Dandelion,
    
  };


   const user = useSelector((state) => state.auth.user); 
  
    useEffect(() => {
      const loadData = async () => {
        try {
          const [plants] = await Promise.all([
            fetchUserPlants(user?.uid),
           
          ]);
          setMyPlants(plants);
         
        } catch (error) {
          console.error("Error fetching plant data:", error);
        } 
      };
      loadData();
    }, [user?.uid]);


  // Dynamically set the Avatar Component
  const AvatarComponent = avatarComponents[user?.avatar];

  return (
    <ScrollView className="bg-[#0F1C2E] h-full w-full p-8">
      {/* Profile Section */}
      <View className="mx-auto flex flex-col mt-4">
        {/* Render avatar component */}
        {AvatarComponent &&
          <AvatarComponent width={100} isSelected={user?.avatar} />
}

<View className="my-4">
        <Text className="text-white text-center font-bold text-lg -mt-6">{user?.username}</Text>
        <Text className="text-white text-xs">{user?.email}</Text>
       
        </View>
        
      
      </View>

      {/* Search Box */}
      <View className="bg-[#172A46] rounded-full px-4 py-2 mt-6">
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          className="text-white"
        />
      </View>

      {/* Menu */}
      <View className="mt-6 gap-y-4">
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')} className="flex-row items-center gap-x-4">
          <Feather name="home" color="white" size={20} />
          <Text className="text-white">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PlantRoutineScreen')} className="flex-row items-center justify-between bg-blue-600 rounded-xl px-3 py-2">
          <View className="flex-row items-center gap-x-4">
            <Feather name="briefcase" color="white" size={20} />
            <Text className="text-white">Tasks</Text>
          </View>
          <View className="flex-row items-center gap-x-2">
          
            <Feather name="bell" color="white" size={20} />
          </View>
        </TouchableOpacity>

      

        <TouchableOpacity onPress={() => { navigation.navigate('UserPlants') }} className="flex-row items-center gap-x-4">
          <Feather name="heart" color="white" size={20} />
          <Text className="text-white">My Plants</Text>
          <View className="bg-[#1D3D65] rounded-full px-2 ml-auto">
            <Text className="text-white text-xs">{myPlants.length}</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => { navigation.navigate('AddUserPlant') }} className="flex-row items-center gap-x-4">
          <FontAwesome5 name="seedling" color="white" size={20} />
          <Text className="text-white">Add Plant</Text>
          <View className="w-2 h-2 rounded-full bg-red-400 mr-2 ml-auto" />
        </TouchableOpacity>
      

        <TouchableOpacity onPress={() => { navigation.navigate('SellPlantScreen') }} className="flex-row items-center gap-x-4">
          <FontAwesome5 name="dollar-sign" color="white" size={20} />
          <Text className="text-white">Sell Plant</Text>
          <View className="w-2 h-2 rounded-full bg-red-400 mr-2 ml-auto" />
        </TouchableOpacity>
      </View>

      {/* Teams Section */}
      <View className="mt-8">
        <View className="flex-row justify-between items-center px-1">
          <Text className="text-white font-semibold text-sm">Plants</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-orange-400 text-xs font-bold mr-1">VIEW ALL</Text>
            <Feather name="eye" color="orange" size={14} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Sidebar;
