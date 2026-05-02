import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { FontAwesome5, MaterialIcons ,FontAwesome} from "@expo/vector-icons";
import { setLogout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";


import Sunflower from "../components/sprites/sunflower";
import Dandelion from "../components/sprites/dandelion";
import { useEffect } from "react";

export default function ProfilePage({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

 
  const avatarComponents = {
    sunflower: Sunflower,
    dandelion: Dandelion,
   
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigation.replace("AuthScreen");
  };

  const AvatarComponent = user?.avatar ? avatarComponents[user.avatar] : null;


  return (
    <View className="flex-1 bg-white relative">
      {/* Top Background Image */}
      <Image
        source={require("../../assets/images/bg/profile-page-up.png")}
        className="absolute top-0 z-[10] w-full h-[20vh]"
        resizeMode="cover"
      />

      <ScrollView vertical contentContainerStyle={{ minHeight: "140%" }} className="flex-1 pt-[22vh] px-6">
        {/* Profile Info */}
        {user && (
  <View className="items-center">
    {AvatarComponent && <AvatarComponent />}

    
    <Text className="text-gray-500">{user.email}</Text>

    <TouchableOpacity className="bg-green-500 px-6 py-2 rounded-full mt-3">
      <Text className="text-white font-medium">Edit Profile</Text>
    </TouchableOpacity>
  </View>
)}

        {/* Menu List */}
        <View className="mt-8 gap-y-2 gap-x-2">
          <MenuItem onPress={()=>{navigation.navigate('AvatarScreen')}} icon="user" text="Change Avatar" />
          <MenuItem onPress={()=>{navigation.navigate('UserPlants')}} icon="heart" text="Favourites" />
          <MenuItem onPress={()=>{navigation.navigate('MyOrderScreen')}} icon="download" text="My Orders" />
          <MenuItem onPress={()=>{navigation.navigate('CartScreen')}} icon="shopping-cart" text="Cart" />
          <MenuItem onPress={()=>{navigation.navigate('SellPlantScreen')}} icon="dollar-sign" text="Sell Plants" />
          <MenuItem onPress={()=>{navigation.navigate('AddUserPlant')}} icon="seedling" text="Add Plants" />
          
         
          <MenuItem onPress={handleLogout} icon="sign-out-alt" text="Logout" isLogout />
        </View>
      </ScrollView>

       <View className="flex-row z-[999] justify-around items-center py-4 bg-white">
        <FontAwesome onPress={()=>{ navigation.navigate("MainScreen");  }} name="home" size={24} color="black" />
        <FontAwesome  onPress={()=>{ navigation.navigate("UserPlants");  }} name="heart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("CartScreen");  }}  name="shopping-cart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("ProfileScreen");  }}  name="user" size={24} color="gray" />
      </View>

      {/* Bottom Background Image */}
      <Image
        source={require("../../assets/images/bg/profile-page-bottom.png")}
        className="absolute bottom-0 w-full h-[20vh]"
        resizeMode="cover"
      />
    </View>
  );
}

const MenuItem = ({ icon, text, isLogout, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-2 py-3 border-b border-gray-200"
    >
      <View className="flex-row items-center gap-x-4">
        <FontAwesome5 name={icon} size={20} color={isLogout ? "red" : "black"} />
        <Text className={`text-lg ${isLogout ? "text-red-500" : "text-black"}`}>{text}</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
    </TouchableOpacity>
  );
};
