import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { collection, addDoc,query,where,getDocs,doc,setDoc} from "firebase/firestore";
import { firestore } from '../config/firebase.config'; 
import ErrorMessage from '../components/error'; 
import { useSelector } from 'react-redux';

export default function Address({ navigation }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    zip: '',
    state: ''
  });
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null); 

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user?.uid) return;

      try {
        const q = query(collection(firestore, "addresses"), where("userUid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const existingDoc = querySnapshot.docs[0];
          setForm(existingDoc.data());
          setDocId(existingDoc.id);
        }
      } catch (err) {
        
        setError("Failed to load address.");
      }
    };

    fetchAddress();
  }, [user]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.firstName || !form.lastName || !form.address1 || !form.zip || !form.state) {
      return 'Please fill all required fields.';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    try {
      const addressRef = docId
        ? doc(firestore, "addresses", docId)
        : doc(collection(firestore, "addresses"));

      await setDoc(addressRef, {
        ...form,
        userUid: user.uid,
        updatedAt: new Date()
      });

      setError(null);
      navigation.replace("OrderReviewScreen");
    } catch (err) {
      
      setError("Failed to save address. Try again.");
    }
  };

  return (
    
    <View className="h-[120vh] bg-white">
       {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white flex-1  ">
      <View>
             
        
        <View className='bg-black  flex-1 py-2 pt-14'>
          <Text className="text-xl text-white text-center font-semibold mb-4">Checkout</Text>
        </View>

        

          <View className="p-4  flex-1">
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
                <View className="bg-gray-300 w-2 h-2 rounded-full mx-2"></View>
                <View className="bg-gray-300 w-2 h-2 rounded-full mx-2"></View>
                <View className="bg-gray-300 w-2 h-2 rounded-full mx-2"></View>
              
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



        <View className="p-4 ">
          <Text className="text-[1.3rem]  font-medium mb-2">Add your shipping address</Text>
          <Text className="text-gray-600 text-sm mb-4">
            You will not be charged until you review this order on the next page.
          </Text>

          {/* Form Fields */}
          <Text className="text-md font-bold text-gray-700 mb-1">First Name</Text>
          <TextInput
            placeholder="First Name"
            value={form.firstName}
            onChangeText={text => handleChange('firstName', text)}
            className="border border-gray-300 rounded px-4 py-2 mb-2"
          />

          <Text className="text-md font-bold text-gray-700 mb-1">Last Name</Text>
          <TextInput
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={text => handleChange('lastName', text)}
            className="border border-gray-300 rounded px-4 py-2 mb-2"
          />

          <Text className="text-md font-bold text-gray-700 mb-1">Address Line 1*</Text>
          <TextInput
            placeholder="Address Line 1"
            value={form.address1}
            onChangeText={text => handleChange('address1', text)}
            className="border border-gray-300 rounded px-4 py-2 mb-2"
          />

          <Text className="text-md font-bold text-gray-700 mb-1">Address Line 2 (Optional)</Text>
          <TextInput
            placeholder="Address Line 2"
            value={form.address2}
            onChangeText={text => handleChange('address2', text)}
            className="border border-gray-300 rounded px-4 py-2 mb-2"
          />

          <View className="flex-row justify-between">
            <View style={{ width: '48%' }}>
              <Text className="text-md font-bold text-gray-700 mb-1">Zip code*</Text>
              <TextInput
                placeholder="Zip code"
                value={form.zip}
                onChangeText={text => handleChange('zip', text)}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </View>

            <View style={{ width: '48%' }}>
              <Text className="text-md font-bold text-gray-700 mb-1">State*</Text>
              <TextInput
                placeholder="State"
                value={form.state}
                onChangeText={text => handleChange('state', text)}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleSave} className="bg-black rounded relative mt-8 py-3">
            <Text className="text-white text-center font-semibold">Save Address</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      </View>
   
  );
}
