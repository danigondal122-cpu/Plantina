import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useSelector, useDispatch } from 'react-redux'; 

import { useState } from "react";
import { addItemToCart,removeItemFromCart } from "../store/cartSlice";
import { clearCart } from "../store/cartSlice";
import {createOrder } from '../config/services/order'


const ProductCard = ({ name, price, image, quantity, onAdd, onRemove, uid,plant,navigation }) => {
  const [isInCart, setIsInCart] = useState(false); 
   


  const handlePress = () => {
    if (isInCart) {
      onRemove({ uid, name, price, image, quantity: 1 });
    } else {
      onAdd({ uid, name, price, image, quantity: 1 }); 
    }
    setIsInCart(!isInCart); 
  };


  
  return (
    <TouchableOpacity onPress={() => navigation.navigate("PlantProductScreen", { plant: plant })} className="bg-emerald-800 w-auto relative h-[50vh] w-[250px] rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg p-4 items-center overflow-visible">
      <Image source={{ uri: image }} className="w-[200px] absolute -top-20 z-[22] h-[200px] rounded-full" />
     
      <View className="mt-40">
        <View className="bg-emerald-500 rounded-tl-sm rounded-br-sm rounded-tr-lg rounded-bl-lg px-4 flex justify-center py-1 w-[30%]">
          <Text className="text-white text-sm rounded-full">Indoor</Text>
        </View>
        <Text numberOfLines={1} className="text-white text-[3rem] font-bold mt-2">{name}</Text>
        <Text className="text-white text-[2rem]">${price}</Text>
        <Text className="text-white text-[1.5rem] mt-1">Qty: {quantity}</Text>
      </View>
      <TouchableOpacity 
        onPress={handlePress} 
        className={`p-4 absolute -bottom-8 rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg mt-2 ${isInCart ? 'bg-white' : 'bg-black'}`}
      >
       <Feather name="shopping-cart" color={isInCart ? 'black' : 'white'} size={40} />

      </TouchableOpacity>
    </TouchableOpacity>
  );
};


export default function CartScreen({navigation}) {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items); 
  const totalQuantity = useSelector(state => state.cart.totalQuantity); 
  const totalPrice = useSelector(state => state.cart.totalPrice); 
const user=useSelector((state)=>state.auth.user)
  const handleRemoveFromCart = (uid) => {
    dispatch(removeItemFromCart(uid)); 
  };



  const handleCheckout = async () => {
    try {
      
      if (!user) {
        alert("You must be logged in to place an order.");
        return;
      }
    
      await createOrder({cartItems,userId: user.uid});
      dispatch(clearCart()); 
      navigation.navigate("AddressScreen"); 
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-green-700 text-2xl font-bold">Cart</Text>
      <ScrollView horizontal className="mt-0 m-6 py-20">
        {cartItems.map(item => (
          <View key={item.uid}>
            <ProductCard
              name={item.name}
              price={item.price}
              image={item.image}
              quantity={item.quantity}
              onAdd={(item) =>  dispatch(addItemToCart(item))}
              onRemove={(item) => dispatch(removeItemFromCart(item))} 
              uid={item.uid}
              plant={item}
              navigation={navigation}
            />
            <View className="w-4" />
          </View>
        ))}
      </ScrollView>
      <View className="flex-row bg-white relative rounded-b-2xl -bottom-12 z-[20] pb-8 justify-around mt-4">
        <Text className="bg-[#ff5600] px-4 py-2 rounded-tl-sm rounded-br-sm rounded-tr-lg rounded-bl-lg text-white">Plants</Text>
        <Text className="bg-gray-200 px-4 py-2 rounded-tl-sm rounded-br-sm rounded-tr-lg rounded-bl-lg">Pots</Text>
        <Text className="bg-gray-200 px-4 py-2 rounded-tl-sm rounded-br-sm rounded-tr-lg rounded-bl-lg">Garden</Text>
      </View>
      <View className="bg-emerald-900 ">
      <View className="flex-row bg-emerald-900 justify-between items-center mt-4 p-4 pt-12">
        <View className="flex-row justify-center items-center gap-x-4">
          <Text className="text-gray-500 text-2xl text-white font-bold">Cart</Text>
          <Text className="text-white text-xs">{totalQuantity} items</Text>
        </View>
        <Text className="bg-[#ff5600] px-8 text-lg rounded-tl-sm rounded-br-sm rounded-tr-lg rounded-bl-lg py-[2px] text-white font-bold">${totalPrice}</Text>
           
      </View>



      {totalQuantity > 0 && (
  <TouchableOpacity
  onPress={handleCheckout}
    className="bg-orange-500 mx-6 my-4 p-4 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm items-center"
  >
    <Text className="text-white text-lg font-semibold">Proceed to Checkout</Text>
  </TouchableOpacity>
)}
</View>
      
    </View>
  );
}
