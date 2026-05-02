import app from '../config/firebase.config';
import React, { useState ,useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import { registerUser } from '../auth/registeration'
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import Vine from '../components/sprites/vine'
import Leave from '../components/sprites/leavefall'
import LeafFall from '../components/sprites/leavefall';
import LeafFall_2 from '../components/sprites/leavefall_2';
import LoadingScreen from '../components/loading-flora'
import ErrorMessage from '../components/error'; 



const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [leaveFall, setLeaveFall] = useState(false); 
  const [leaveFall2, setLeaveFall2] = useState(false); 
  const [vinePosition, setVinePosition] = useState(0); // Track the bottom position of the focused input field
  const dispatch = useDispatch();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirm_password_Ref = useRef(null);
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null); // new state

  const registerClick = async () => {
    
    setError(null); // reset previous error
  
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
  
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
      const registration = await registerUser(username, email, password);
    
      if (registration.success) {
        dispatch(setUser(registration.user));
        setLoading(false);
        navigation.replace('AvatarScreen');
      }else{
        setError(registration.error)
      }
    } catch (error) {
     
      const firebaseError = error?.message || error?.code || "Something went wrong.";
      
      setError(firebaseError);
    } finally {
      setLoading(false);
    }
  };
  const handleInputFocus = (inputRef) => {
    
    inputRef?.current?.measureInWindow((x, y, width, height) => {
      const bottomPosition = y + height;
      
      setVinePosition(bottomPosition);
      if(leaveFall && !leaveFall2){
        setLeaveFall2(true)
      }else{
        setLeaveFall(true); 
      }
     
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
       {loading && <LoadingScreen/>}
       {error && (
        <ErrorMessage message={error} onClose={() => setError(null)} />
      )}
       <View className=' p-6'>
      <View className="relative mt-4">
        <TouchableOpacity  onPress={() => navigation.goBack()} className="absolute left-0 w-10 h-10 bg-gray-200 rounded-full justify-center items-center">
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <View className="items-center absolute -right-14 -top-36 mt-8">
          {/* <Image source={require('../../assets/images/materials/leaves.png')} className="w-[200px] h-[200px]" /> */}
          <Vine leaveFall={leaveFall}  inputField={leaveFall2}/>
          <LeafFall leaveFall={leaveFall}  />
          <LeafFall_2 leaveFall={leaveFall2} vinePosition={vinePosition} />
        </View>
        <View className='mt-8'>
          <Text className="text-3xl font-bold text-center">Register</Text>
          <Text className="text-1xl text-center">Create your new account </Text>
        </View>
      </View>

      <View className="mt-6 flex flex-col gap-y-4">
        <View className="bg-gray-300 rounded-t-lg flex-row items-center p-3">
          <Icon name="user" size={20} color="black" />
          <TextInput
           ref={usernameRef}
            placeholder="Full Name"
            className="ml-3 py-2 flex-1"
            value={username}
            onChangeText={setUsername}
            
            onFocus={(e) => handleInputFocus(usernameRef)}
          />
        </View>
        <View className="bg-gray-300 rounded-t-lg flex-row items-center p-3">
          <Icon name="envelope" size={20} color="black" />
          <TextInput
            placeholder="Email"
            className="ml-3 py-2 flex-1"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            ref={emailRef}
            onFocus={(e) => handleInputFocus(emailRef)}
          />
        </View>
        <View className="bg-gray-300 rounded-t-lg flex-row items-center p-3">
          <Icon name="lock" size={20} color="black" />
          <TextInput
           ref={passwordRef}
            placeholder="Password"
            className="ml-3 py-2 flex-1"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={(e) => handleInputFocus(passwordRef)}
          />
        </View>
        <View className="bg-gray-300 rounded-t-lg flex-row items-center p-3">
          <Icon name="lock" size={20} color="black" />
          <TextInput
            placeholder="Confirm Password"
            className="ml-3 py-2 flex-1"
            secureTextEntry
            value={confirmPassword}
            ref={confirm_password_Ref}
            onChangeText={setConfirmPassword}
            onFocus={(e) => handleInputFocus(confirm_password_Ref)}
          />
        </View>
      </View>

      <Text className="text-gray-500 text-center text-sm mt-14">
        By signing up, you agree to our Terms of Use and Privacy Policy.
      </Text>

      <View className="items-center mt-2">
        <Image source={require('../../assets/images/materials/water-can.png')} className="w-28 h-28" />
      </View>

      <TouchableOpacity  disabled={loading} className="bg-teal-900 py-4 rounded-full mt-6 items-center" onPress={registerClick}>
       {loading ? <ActivityIndicator color="white" /> :    <Text className="text-white text-lg font-semibold">Sign Up</Text> }
      </TouchableOpacity>

      <Text className="text-gray-500 text-center mt-4">
        Already have an account? <Text onPress={() => { navigation.navigate('LoginScreen') }} className="text-green-700 font-bold">Sign In</Text>
      </Text>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
