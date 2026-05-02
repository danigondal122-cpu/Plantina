import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity,ActivityIndicator,Animated } from "react-native";
import { useState,useEffect } from "react";
import { Feather } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { fetchUserFavourites } from "../config/services/user_favourite";
import {fetchUserPlants} from '../config/services/plants'
import { FontAwesome } from "@expo/vector-icons";
import LoadingScreen from '../components/loading-flora'




const UserPlantsScreen = ({navigation}) => {
  const [myPlants, setMyPlants] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const [plants, favs] = await Promise.all([
          fetchUserPlants(user?.uid),
          fetchUserFavourites(user?.uid)
        ]);
        setMyPlants(plants);
        setFavourites(favs);
   
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.uid]);

  if (loading) {
    return <LoadingScreen/>;
  }
  const AnimatedHeartIcon = () => {
    const scaleAnim = useState(new Animated.Value(0))[0];
  
    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        useNativeDriver: true,
        friction: 3,
      }).start();
    }, []);
  
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          backgroundColor: '#fee2e2',
          borderRadius: 999,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <FontAwesome name="heart" size={20} color="red" />
      </Animated.View>
    );
  };

  return (
    <View className="w-full h-full">
    <ScrollView className={`flex-1 bg-white p-4`}>
      
      {/* Water Today Section */}
      <Text className={`text-3xl font-bold mt-14 `}>My Plants</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className={`mt-3`}>
        {myPlants.map((plant, index) => (
          <View key={index} className={`w-40 bg-blue-100 rounded-xl p-4 mx-2`}>
            <Image source={{ uri: plant.image }} className={`w-20 h-20 self-center`} />
            <Text className={`text-gray-900 font-semibold mt-2 text-center`}>{plant.name}</Text>
            <Text className={`text-gray-500 text-center`}>{plant.family}</Text>
            <Text className={`text-gray-500 text-center mt-2`}>{plant.waterCycles}</Text>
          </View>
        ))}
      </ScrollView>

      {/* My Plants Section */}
      <Text className={`text-3xl font-bold text-gray-900 my-6`}>Favourites</Text>
      <View className={`mt-3`}>
      {favourites.map((plant, index) => (
          <View key={plant.id || index} className="flex-row h-[90px] items-center bg-teal-900 px-2 rounded-lg my-4">
            <Image source={{ uri: plant.image }} className="w-32 h-32 relative bottom-8" />
            <View className="ml-4 flex-1">
              <Text className="text-white text-2xl font-semibold">{plant.name}</Text>
              <Text className="text-white">{plant.location}</Text>
            </View>
            <AnimatedHeartIcon />
          </View>
        ))}
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

export default UserPlantsScreen;
