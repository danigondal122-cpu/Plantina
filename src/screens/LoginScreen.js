import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';

import { loginUser } from '../auth/registeration'; 
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import WaterCan from '../components/sprites/water-can'; 
import LoadingScreen from '../components/loading-flora'
import { useIsFocused } from '@react-navigation/native';
import ErrorMessage from '../components/error';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [trigerWatering, setTriggerWatering] = useState(false);  
  const dispatch = useDispatch();
  const [bothFieldsFilled, setBothFieldsFilled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error,setError]=useState(null)
  const isFocused = useIsFocused();

  const handleLogin = async () => {
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!email || !password) {
  setError('Please fill in both fields.');
  return;
}

if (!emailRegex.test(email)) {
  setError('Please enter a valid email address.');
  return;
}

if (password.length < 6) {
  setError('Password must be at least 6 characters long.');
  return;
}
     setBothFieldsFilled(true);
    setLoading(true);
    const result = await loginUser(email, password);
     
    dispatch(setUser(result.user));
    setLoading(false);

    if (result.success) {
      alert('Login Successful!');
      navigation.replace('MainScreen');
    } else {
     setError('Invalid credentials')
    }
  };

  const checkFieldsFilled = () => {
    if (email.trim() !== '' && password.trim() !== '') {
 
    } else {
      setBothFieldsFilled(false);
    }
  };

  useEffect(()=>{
    setInitialized(true)
  })

  return (
    <SafeAreaView className="flex-1 bg-white">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {loading && <LoadingScreen/>}

<View style={{ flex: 1 }}>
     
    </View>
    
      <View className=' p-6'>
      <View className="relative mt-4 ">
        <TouchableOpacity
          className="absolute left-0 w-10 h-10 bg-gray-200 rounded-full justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

       
        <View className="items-center absolute -right-14 -top-58 mt-8">
          <Image source={require('../../assets/images/materials/leaves.png')} className="w-[200px] h-[200px]" />
        </View>
        <View className="mt-[150px]">
          <Text className="text-3xl font-bold text-center">Login</Text>
          <Text className="text-1xl text-center">Please enter your credentials</Text>
        </View>
      </View>

     
      <View className="mt-6 flex flex-col gap-y-4">
        <View className="bg-gray-300 rounded-lg flex-row items-center p-3">
          <Icon name="envelope" size={20} color="black" />
          <TextInput
            placeholder="Email"
            className="ml-3 py-2 flex-1"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              checkFieldsFilled();
            }}
            onFocus={() => setTriggerWatering(true)} 
          />
        </View>
        <View className="bg-gray-300 rounded-lg flex-row items-center p-3">
          <Icon name="lock" size={20} color="black" />
          <TextInput
            placeholder="Password"
            className="ml-3 py-2 flex-1"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              checkFieldsFilled();
            }}
            onFocus={() => setTriggerWatering(true)} 
          />
        </View>
      </View>

   
      {isFocused && (
  <View className="items-center ">
    <WaterCan initialized={initialized} trigerWatering={trigerWatering} bothFieldsFilled={bothFieldsFilled} />
  </View>
)}

    
      <TouchableOpacity
        className="bg-teal-900 py-4 rounded-full mt-6 items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-semibold">Login</Text>}
      </TouchableOpacity>

      
      <Text className="text-gray-500 text-center mt-4">
        Create an account?{' '}
        <Text className="text-green-700 font-bold" onPress={() => navigation.navigate('RegisterScreen')}>
          {' '}
          Sign Up
        </Text>
      </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
