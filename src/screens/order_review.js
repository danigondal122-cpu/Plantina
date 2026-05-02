import React, { useState,useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useSelector } from 'react-redux';
import LoadingScreen from '../components/loading-flora';
import { collection, addDoc,query,where,getDocs,doc,setDoc} from "firebase/firestore";
import { firestore } from '../config/firebase.config'; 
import { getOrder } from '../config/services/order';
import { getOrderByOrderId } from '../config/services/order';

export default function CheckoutScreen({navigation,route}) {
  const [shippingAddress, setShippingAddress] = useState(null);
const [loadingAddress, setLoadingAddress] = useState(true);
const orderId = route?.params?.orderId ?? null;

  const user = useSelector((state) => state.auth.user);
  

  const [orderInfo, setOrderInfo] = useState(null);

useEffect(() => {
  const fetchOrder = async () => {
    try {
      if (!user?.uid) return;
      if(orderId){
        const orders = await getOrderByOrderId(orderId);
        if (orders ) {
       
          setOrderInfo(orders); 
        }
      }
      else{
        const orders = await getOrder(user.uid);
        if (orders ) {
       
          setOrderInfo(orders); 
        }
      }
    
  
    } catch (err) {
      console.error("Failed to fetch order:", err);
    }
  };

  fetchOrder();
}, []);


  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        if (!user?.uid) return;

      
          const q = query(collection(firestore, "addresses"), where("userUid", "==", user.uid));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            setShippingAddress(existingDoc.data());
          
          }
        
      } catch (error) {
        console.error('Error fetching shipping address:', error);
      } finally {
        setLoadingAddress(false);
      }
    };
  
    fetchShippingAddress();
  }, []);


  return (
    <ScrollView className="bg-white flex-1">
         <View className='bg-black py-2 pt-14'>
        <Text className="text-xl text-white text-center  font-semibold mb-4">Checkout</Text>
        </View>


      <View className="p-4">
       
        {/* Step Indicator */}
        <View className="p-4">
      {/* Step Indicator */}
      <View className="flex-row justify-between items-center mb-6">
        {/* Shipping */}
        <View className="flex-1 items-center">
          <View className="bg-black w-8 h-8 rounded-full justify-center items-center">
            <Text className="text-white font-bold">1</Text>
          </View>
          <Text className="text-center text-black font-semibold text-md mt-2">Shipping</Text>
        </View>

        {/* Small Circle Divider */}
        <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
               <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
               <View className="bg-black w-2 h-2 rounded-full mx-2"></View>

        {/* Payment */}
        <View className="flex-1 items-center">
          <View className="bg-black w-8 h-8 rounded-full justify-center items-center">
            <Text className="text-white font-bold">2</Text>
          </View>
          <Text className="text-center text-black font-semibold mt-2">Review</Text>
        </View>

        {/* Small Circle Divider */}
        <View className="bg-gray-300 w-2 h-2 rounded-full mx-2"></View>
        <View className="bg-gray-300 w-2 h-2 rounded-full mx-2"></View>
        <View className="bg-gray-300 w-2 h-2 rounded-full mx-2"></View>
       
        {/* Review */}
        <View className="flex-1 items-center">
          <View className="bg-black w-8 h-8 rounded-full justify-center items-center">
            <Text className="text-white font-bold">3</Text>
          </View>
          <Text className="text-center font-semibold text-black mt-2">Payment</Text>
        </View>
      </View>
    </View>

    <Text className="text-lg font-semibold mb-1">Please confirm and submit your order</Text>
      <Text className="text-xs text-gray-500 mb-4">
        By clicking submit order, you agree to Fintory's 
        <Text className="text-blue-600"> Terms of Use </Text> and 
        <Text className="text-blue-600"> Privacy Policy</Text>
      </Text>

      {/* Payment Section */}
      <View className="border border-gray-200 rounded-lg p-4 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium">Payment</Text>
          <TouchableOpacity><Text className="text-blue-600 font-medium">Edit</Text></TouchableOpacity>
        </View>
        <View className="flex-row items-center space-x-2">
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/000000/mastercard-logo.png' }}
            className="w-6 h-6"
          />
          <Text className="text-sm text-gray-700">•••• 6714</Text>
          <Text className="text-sm text-gray-700 ml-auto">01/24</Text>
        </View>
      </View>

      {/* Shipping Address */}
      <View className="border border-gray-200 rounded-lg p-4 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium">Shipping address</Text>
          <TouchableOpacity   onPress={() => navigation.navigate('AddressScreen')}><Text className="text-blue-600 font-medium">Edit</Text></TouchableOpacity>
        </View>
        {loadingAddress ? (
  <LoadingScreen/>
) : shippingAddress ? (
  <View>
  <Text className="text-sm text-gray-700">Name</Text>
  <Text className="text-sm font-medium mb-2">{shippingAddress?.firstName}</Text>
  <Text className="text-sm text-gray-700">Address line 1</Text>
  <Text className="text-sm font-medium">{shippingAddress?.address1}</Text>
</View>
) : (
  <Text className="text-red-500 text-sm">No shipping address found.</Text>
)}
      </View>

      {/* Order Summary */}
    
{orderInfo ?
 ( <View className="bg-gray-100 p-4 rounded-lg mb-6">
        <Text className="font-medium text-base mb-2">Order summary</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-600">Subtotal</Text>
          <Text className="text-sm text-gray-800 font-medium"> <Text>${orderInfo.totalPrice-9.00}</Text></Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-600">Delivery</Text>
          <Text className="text-sm text-gray-800 font-medium">$9.00</Text>
        </View>
        <View className="border-t border-gray-300 my-2" />
        <View className="flex-row justify-between">
          <Text className="text-sm font-semibold">Total</Text>
          <Text className="text-sm font-semibold">${orderInfo.totalPrice}</Text>
        </View>
      </View>)
      :
      loadingAddress ?
       (<></>):
     ( <LoadingScreen/>)

}

      {/* Submit Order Button */}
      <TouchableOpacity onPress={()=>navigation.replace('CheckoutScreen',{orderId:orderId})} className="bg-black py-4 rounded-lg">
        <Text className="text-white text-center font-semibold">Submit Order</Text>
      </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
