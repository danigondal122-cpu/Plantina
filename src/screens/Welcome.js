import { View, Text, ImageBackground } from "react-native";
import './AuthScreen'
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function WelcomeScreen({ navigation }) {

  const user = useSelector(state => state.auth.user);


  useEffect(() => {



    try{

    
    
        
        const timer = setTimeout(() => {
          if (user) {

            if ( !user.avatar) {
             
      navigation.replace("AvatarScreen");
    }else{
       navigation.replace("MainScreen");
    }
          
           
          }   else {

          navigation.replace("AuthScreen");
          return () => clearTimeout(timer);
        }
        }, 5000);
  
    }catch(err){
      navigation.replace("AuthScreen");
    }
    
  
   
  }, []);


  return (
    <ImageBackground
      source={require("../../assets/images/bg/bg-emerald.png")} 
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      {/* Title */}
      <View className="flex-1 py-[16rem] items-center ">
      <Text className="text-white text-[4rem] font-bold">PLANTINIA</Text>
      <Text className="text-white text-[1.2rem] text-center mx-12 mt-2">
        Discover and find your favorite house plants
      </Text>
      </View>

      {/* White Curve at the Bottom */}
     
    </ImageBackground>
  );
}
