import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch,useSelector } from 'react-redux';
import { addItemToCart } from '../store/cartSlice';
import { Animated } from 'react-native';
import { toggleFavorite, isFavorite } from '../config/services/favourites';



const PlantDetails = ({ route,navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const { plant } = route.params; 
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const scaleValue = useState(new Animated.Value(1))[0];
  const user = useSelector((state) => state.auth.user); 


  const cartItems = useSelector((state) => state.cart.items);

  const handleHeartPress = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please log in to favorite plants.");
      return;
    }
    await toggleFavorite(user.uid, plant.uid, setLiked);
  
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };



  const cartItem = cartItems.find(item => item.uid === plant.uid); 
const isInCart = !!cartItem;
useEffect(() => {
  if (cartItem) {
    setQuantity(cartItem.quantity); 
  }
}, [cartItem]);

const handleAddToCart = () => {
  dispatch(addItemToCart({
    uid: plant.uid,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity, 
  }));

};
 
  useEffect(() => {
    if (user) {
      isFavorite(user.uid, plant.uid).then(setLiked);
    }
    
    const fetchPlant = async () => {
      try {
       
        
        const plantDocRef = doc(firestore, "plants", plant.name);
        const plantDocSnap = await getDoc(plantDocRef);
       
        if (plantDocSnap.exists()) {
          setProduct(plantDocSnap.data()); 
        } else {
        
        }
      } catch (error) {
       
      }
    };

    fetchPlant();
  }, []);

  if (!product) {
    return <Text>Loading...</Text>; 
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Top Navigation */}
      <View className='bg-teal-900 pt-8 rounded-b-[38px]'>
        <View className="flex-row justify-between items-center p-4">
          <TouchableOpacity>
          <Feather name="chevron-left" size={20} color="white" />

          </TouchableOpacity>
          <TouchableOpacity>
          <Feather name="shopping-cart" size={20} color="white" />

          </TouchableOpacity>
        </View>
      
        {/* Plant Image */}
        <View className="items-center mt-4">
          <Image
            source={{ uri: product.image }} 
            className="w-[250px] z-[10] relative top-16 h-[250px]"
            resizeMode="contain"
          />
          <TouchableOpacity className="relative z-[10] left-32 top-4" onPress={handleHeartPress}>
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          backgroundColor: liked ? '#fee2e2' : '#f3f4f6', 
          borderRadius: 999,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
         
          
        }}
      >
        <FontAwesome
          name={liked ? 'heart' : 'heart-o'}
          size={24}
          color={liked ? 'red' : 'black'}
        />
      </Animated.View>
    </TouchableOpacity>
        </View>
      </View>
      
      {/* Plant Details */}
      <ScrollView vertical className="bg-white p-6">
        <Text className="text-teal-900 text-lg font-bold">{product.category}</Text> {/* Display category */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-3xl ">{product.name}</Text> {/* Display product name */}
          <Text className="text-2xl  ">{`$${product.price}`}</Text> {/* Display product price */}
        </View>

        <View className="flex-row items-center mt-4 space-x-4">
          <TouchableOpacity
            className="w-8 h-8 bg-teal-900 rounded-lg flex items-center justify-center"
            onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          >
           <Feather name="minus" size={20} color="white" />

          </TouchableOpacity>

          <Text className="text-xl mx-2 py-[4px] rounded-md bg-gray-200 px-4">{quantity}</Text>

          <TouchableOpacity
            className="w-8 h-8 bg-teal-900 rounded-lg flex items-center justify-center"
            onPress={() => setQuantity(quantity + 1)}
          >
           <Feather name="plus" size={20} color="white" />

          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 mt-6">{product.description}</Text> {/* Display product description */}

        <Text className='mt-4 text-lg font-bold text-teal-900'>Details</Text>
        
        {/* Details Section */}
        <View className="flex-row justify-around my-6">
          <View className="items-center">
          
<MaterialCommunityIcons name="glass-wine" size={32} color="black" />
            <Text className="text-md text-green-900 ">{product.waterCycles}</Text>
            <Text className="text-gray-500 font-semibold text-green-900">Water</Text>
          </View>
          <View className="items-center">
          <MaterialCommunityIcons name="weather-sunny" size={32} color="black" />
          
            <Text className="text-md text-green-900 ">{product.sunlight}</Text>
            <Text className="text-gray-500 font-semibold text-green-900">Sunlight</Text>
          </View>
          <View className="items-center">
          <Ionicons name="thermometer" size={32} color="black" />
            <Text className="text-md text-green-900 ">{product.temperature}</Text>
            <Text className="text-gray-500 font-semibold text-green-900">Temp</Text>
          </View>
        </View>

        <View className="w-full">
        {isInCart ? (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CartScreen')
      }} className="bg-teal-900 py-4 flex-row justify-center items-center w-full">
              <FontAwesome   name="shopping-cart" size={24} color="white" />
      <Text className="text-white text-lg font-semibold ml-2">View Cart</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleAddToCart} className="bg-teal-900 py-4 flex-row justify-center items-center w-full">
             <FontAwesome   name="shopping-cart" size={24} color="white" />
      <Text className="text-white text-lg font-semibold ml-2">Add To My Cart</Text>
    </TouchableOpacity>
  )}

        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default PlantDetails;
