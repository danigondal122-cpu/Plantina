import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollViewnimated,Animated,ScrollView, Dimensions, TouchableWithoutFeedback  } from "react-native";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../config/firebase.config"; 
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addItemToCart,removeItemFromCart } from "../store/cartSlice";
import Sidebar from "../components/sidebar";

function CategorySection() {
  const categories = [
    { name: "Flower", image: require("../../assets/images/bg/flower-icon.png") },
    { name: "Indoor", image: require("../../assets/images/bg/cactus-icon.png") },
    { name: "Green", image: require("../../assets/images/bg/pot-icon.png") },
  ];

  return (
    <View className="flex-row justify-around mt-4">
      {categories.map((category, index) => (
        <TouchableOpacity key={index} className="items-center">
          <Image source={category.image} className="w-16 h-16" resizeMode="contain" />
          <Text className="text-gray-600 mt-2">{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TopBanner() {
  return (
    <View className="flex-row relative items-center bg-[#f8d8c1]  rounded-lg  p-2 pb-0 mb-0 mx-4 mt-6">
      <View className="pb-0">
        <Image
          source={require("../../assets/images/bg/main-page-bg.png")}
          className="w-[150px]  h-[150]"
        />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-white text-[1.5rem] font-bold">Exclusive Offer</Text>
        <Text className="text-white text-sm">Buy you plants at the best rate.</Text>
      </View>
    </View>
  );
}

export default function HomeScreen({navigation}) {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  const filteredPlants = plants.filter(plant =>
  plant.name.toLowerCase().includes(searchQuery.toLowerCase())
);


  const dispatch = useDispatch();
const cartItems = useSelector((state) => state.cart.items);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const sidebarAnim = useState(new Animated.Value(-Dimensions.get('window').width * 0.8))[0]; // Start off-screen
const openSidebar = () => {
  setIsSidebarOpen(true);
  Animated.timing(sidebarAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  }).start();
};

const closeSidebar = () => {
  Animated.timing(sidebarAnim, {
    toValue: -Dimensions.get('window').width * 0.8,
    duration: 300,
    useNativeDriver: false,
  }).start(() => setIsSidebarOpen(false));
};


  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "plants"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants: ", error);
      }
    };

    fetchPlants();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 pt-14">
      {/* Header */}
      <View className="flex-row justify-between px-4 items-center">
        <Text className="text-green-700 font-bold text-xl">PLANTINIA</Text>
        <View className="flex flex-row gap-x-4">
          <FontAwesome className="mt-[3px]" name="search" size={22} color="black" />
          <Ionicons name="menu-outline" size={32} color="black" onPress={openSidebar} />


        </View>
      </View>

      {/* Banner Section */}
      <TopBanner />

      {/* Search Bar */}
      <View className="flex-row items-center border-black border-[1px] p-2 rounded-lg mt-4">
        <FontAwesome name="search" size={22} color="gray" />
        <TextInput
  placeholder="Search"
  value={searchQuery}
  onChangeText={(text) => setSearchQuery(text)}
  className="flex-1 ml-2 text-gray-700"
/>
      </View>

      {/* Categories */}
      <CategorySection />

      {/* Product List */}
      <ScrollView className="mt-4">
        {filteredPlants.map((plant, index) => {
          
          
          const isInCart = cartItems.some(item => item.uid === plant.uid);
        
          return(
          <TouchableOpacity
            key={plant.id}
            onPress={() => navigation.navigate("PlantProductScreen", { plant: plant })}
            className={`flex-row justify-between items-center p-4 mb-2 rounded-lg ${
              index % 2 === 0 ? "bg-[#c4dbb7]" : "bg-[#c3d5d9]"
            }`}
          >
            <Image
              source={{ uri: plant.image }} 
              className="w-[100px] h-[100px] rounded-lg"
            />
            <View className="flex-1 ml-4">
              <Text className="text-black text-lg font-bold">{plant.name}</Text>
              <Text className="text-gray-500 text-sm">{plant.family}</Text>
              <Text className="text-black pt-6 font-semibold">{plant.price}.0 $</Text>
            </View>
            <TouchableOpacity
  onPress={() => {
    if (isInCart) {
      dispatch(removeItemFromCart(plant));
    } else {
      dispatch(addItemToCart(plant));
    }
  }}
  className={`w-10 h-10 ${
    index % 2 === 0 ? "bg-[#c4dbb7]" : "bg-[#c3d5d9]"
  } rounded-full items-center border-black border-2 justify-center`}
>
  <Text className="text-black font-bold text-lg">
    {isInCart ? '-' : '+'}
  </Text>
</TouchableOpacity>
          </TouchableOpacity>
)})}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-4 bg-white">
        <FontAwesome onPress={()=>{ navigation.navigate("MainScreen");  }} name="home" size={24} color="black" />
        <FontAwesome  onPress={()=>{ navigation.navigate("UserPlants");  }} name="heart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("CartScreen");  }}  name="shopping-cart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("ProfileScreen");  }}  name="user" size={24} color="gray" />
      </View>

      {isSidebarOpen && (
  <TouchableWithoutFeedback onPress={closeSidebar}>
    <View className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50">
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          transform: [{ translateX: sidebarAnim }],
        }}
      >
        <Sidebar navigation={navigation} />
      </Animated.View>
    </View>
  </TouchableWithoutFeedback>
)}



      
    </View>
  );
}
