import React, { useState,useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import ErrorMessage from '../components/error';
import {savePaymentInfo} from '../config/services/payment'
import StripeButton from '../components/stripe_component'
import { getOrder,getOrderByOrderId,updateOrder } from '../config/services/order'; 
import { useSelector } from 'react-redux';


export default function CheckoutScreen({navigation,route}) {
  const [useShippingAddress, setUseShippingAddress] = useState(true);
  const [order, setOrder] = useState(null);
  const user=useSelector((state)=>state.auth.user)
  // Form state
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const orderId = route?.params?.orderId ?? null;
  const handlePaymentError = (errorMessage) => {
    setError(errorMessage)
    // You can show a modal, toast, or update local state here
  };


  // Error state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const handlePaymentSuccess = (successMessage) => {
  
    navigation.replace('MainScreen')
  };

  useEffect(() => {
    
    const fetchOrder = async () => {
      try {
        const userId = user.uid;
        if (!userId) return;

        if(orderId){
          const orderByorderId=await getOrderByOrderId(orderId)
          if (orderByorderId) {
            setOrder(orderByorderId);
          }

        }else{

        
        
  
        const latestOrder = await getOrder(userId);
        if (latestOrder) {
          setOrder(latestOrder);
        }
      }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };

  
    fetchOrder();



  }, [user]);
  



  const handleCashOnDelivery = async () => {
    if (!order?.id) {
      setError('Order not found');
      return;
    }
    if(validateForm()){

    
  
    try {
      await updateOrder(order.id, {
        status: 'completed',
        paymentMethod: 'cash_on_delivery',
        isPaid: false,
        paymentDetails: {
          nameOnCard: formData.nameOnCard,
          cardNumber: formData.cardNumber, 
          expiryDate: formData.expiryDate,
        },
      });
  
      navigation.navigate('MainScreen');
    } catch (err) {
      console.error('Failed to update order:', err);
      setError('Something went wrong while processing Cash on Delivery.');
    }
  }
  };







  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  const validateForm = () => {
    let isValid = true;
  
    const nameOnCard = formData.nameOnCard.trim();
    const cardNumber = formData.cardNumber.trim().replace(/\s+/g, '');
    const expiryDate = formData.expiryDate.trim();
    const cvc = formData.cvc.trim();
  
    const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/; 
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvcRegex = /^[0-9]{3,4}$/;
  
    if (!nameOnCard) {
      setError('Name on card is required.');
      isValid = false;
    } else if (!cardNumberRegex.test(cardNumber)) {
      setError('Invalid card number.');
      isValid = false;
    } else if (!expiryRegex.test(expiryDate)) {
      setError('Expiration date must be in MM/YY format.');
      isValid = false;
    } else if (!cvcRegex.test(cvc)) {
      setError('Invalid CVC code.');
      isValid = false;
    } else {
      setError(null);
    }
  
    return isValid;
  };
  
 

  return (
    <View className='h-[120vh] '>
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    <ScrollView  className="bg-white flex-1">
      
         <View className='bg-black py-2 pt-14'>
        <Text className="text-xl text-white text-center  font-semibold mb-4">Checkout</Text>
        </View>


      <View className="p-4">
       
       
        <View className="p-4">
     
      <View className="flex-row justify-between items-center mb-6">
      
        <View className="flex-1 items-center">
          <View className="bg-black w-8 h-8 rounded-full justify-center items-center">
            <Text className="text-white font-bold">1</Text>
          </View>
          <Text className="text-center text-black font-semibold text-md mt-2">Shipping</Text>
        </View>

       
        <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
        <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
        <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
      
      
        <View className="flex-1 items-center">
          <View className="bg-black w-8 h-8 rounded-full justify-center items-center">
            <Text className="text-white font-bold">2</Text>
          </View>
          <Text className="text-center text-black font-semibold mt-2">Review</Text>
        </View>

      
       <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
        <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
        <View className="bg-black w-2 h-2 rounded-full mx-2"></View>
      
       
        
        <View className="flex-1 items-center">
          <View className="bg-black w-8 h-8 rounded-full justify-center items-center">
            <Text className="text-white font-bold">3</Text>
          </View>
          <Text className="text-center font-semibold text-black mt-2">Payment</Text>
        </View>
      </View>
    </View>

       
        <Text className="text-[1.3rem] mt-2 font-medium mb-2">Choose a payment method</Text>
        <Text className="text-gray-600 text-sm mb-4">
          You will not be charged until you review this order on the next page.
        </Text>

       
        <View className="flex-row mt-6 items-center mb-2">
          <View className="w-4 h-4 rounded-full border-2 border-black mr-2" />
          <Text className="text-base font-bold">Credit card</Text>
          <View className="flex-row ml-auto">
            <Image source={{ uri: 'https://img.icons8.com/color/48/000000/mastercard-logo.png' }} className="w-7 h-5 mr-1" />
            <Image source={{ uri: 'https://img.icons8.com/color/48/000000/visa.png' }} className="w-7 h-5" />
          </View>
        </View>

        <View className="py-6">
        <Text className="text-md font-bold text-gray-700 mb-1">Name on card</Text>
          <TextInput
            placeholder="Name on card"
            value={formData.nameOnCard}
            onChangeText={(text) => handleInputChange('nameOnCard', text)}
            className="border border-gray-300 rounded px-4 py-2 mb-2"
          />
         

        
          <Text className="text-sm text-gray-700 text-md font-bold mb-1">Card number</Text>
          <TextInput
            placeholder="Card number"
            secureTextEntry
            value={formData.cardNumber}
            onChangeText={(text) => handleInputChange('cardNumber', text)}
            className="border border-gray-300 rounded px-4 py-2 mb-2"
          />
        

         
          <View className="flex-row justify-between">
            <View style={{ width: '48%' }}>
              <Text className="text-sm text-gray-700 text-md font-bold mb-1">Expiration date</Text>
              <TextInput
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChangeText={(text) => handleInputChange('expiryDate', text)}
                className="border border-gray-300 rounded px-4 py-2"
              />
            
            </View>

            <View style={{ width: '48%' }}>
              <Text className="text-sm text-gray-700 text-md font-bold mb-1">Security code</Text>
              <TextInput
                placeholder="CVC"
                secureTextEntry
                value={formData.cvc}
                onChangeText={(text) => handleInputChange('cvc', text)}
                className="border border-gray-300 rounded px-4 py-2"
              />
             
            </View>
          </View>
        </View>
        
   


       
        <View className="flex-row items-center mb-6">
          <View className="w-4 h-4 rounded-full border border-gray-400 mr-2" />
          <Text className="text-base">Apple Pay</Text>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png' }} className="w-6 h-6 ml-1" />
        </View>

         
          <StripeButton  amount={order?.totalPrice} orderId={order?.id}   onError={handlePaymentError} onSucess={handlePaymentSuccess}/>
         

       
        <TouchableOpacity  onPress={handleCashOnDelivery} className="bg-black rounded py-3">
          <Text className="text-white text-center font-semibold">Cash on Delivery</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
   </View>
  );
}
