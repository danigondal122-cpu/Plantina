import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import {Video} from "expo-av";
export default function AuthScreen({ navigation })  {
  return (
    <View className="flex-1 justify-center align-center  w-full h-full">
    {/* Background Video */}
    <Video
    className="w-full"
        source={require("../../assets/video/login.mp4")}
        style={{ width:'100%',height:'100%' }}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />
       <View className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
    {/* Text Container */}
    <View className="w-4/5 items-center">
      <Text className="text-white text-3xl font-bold text-center leading-tight">
        Leaf Through{"\n"}Nature's Finest
      </Text>
    </View>

    {/* Buttons at the Bottom */}
    <View className="absolute bottom-12 w-4/5">
      {/* Sign In Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("LoginScreen")}
        className="bg-white/20 py-3 rounded-lg items-center"
      >
        <Text className="text-white font-semibold text-lg">SIGN IN</Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")} className="mt-3 items-center">
        <Text className="text-white text-sm">CREATE AN ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
  );
}
