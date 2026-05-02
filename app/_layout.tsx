import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect,useState } from 'react';
import { Image } from 'react-native';
import { Provider } from 'react-redux';
import 'react-native-reanimated';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationIndependentTree } from '@react-navigation/native';
import '../global.css'
import AvatarScreen from '../src/screens/AvatarScreen'
import LoginScreen from '../src/screens/LoginScreen'
import RegisterScreen from '../src/screens/RegisterScreen'
import MainPage from '../src/screens/MainPage'
import CartScreen from '../src/screens/CartScreen'
import ProfileScreen from '../src/screens/ProfilePage'
import AuthScreen from '../src/screens/AuthScreen'
import PlantRoutineScreen from '../src/screens/PlantRoutine'
import PlantDetails from '../src/screens/ProductScreen'
import SellPlantScreen from '../src/screens/AddPlant'
import MyPlantsScreen from '../src/screens/UserPlantsScreen'
import WelcomeScreen from '../src/screens/Welcome'
import AddUserPlant from '../src/screens/AddUserPlant'
import PlantTaskScreen from '../src/screens/PlantTaskScreen'
import MyOrderScreen from '../src/screens/MyOrders'
// import '../src/config/push-notifications.config'
// import '../src/config/firebaseInitialize'
// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store/redux';
import LoadingScreen from '@/src/components/loading-flora';
import CheckoutScreen from '@/src/screens/checkout'
import OrderReview from '@/src/screens/order_review'
import AddressScreen from '@/src/screens/Address'
import { StripeProvider } from '@stripe/stripe-react-native';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const MainStackNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      


       
      <Stack.Screen name="SplashScreen" component={WelcomeScreen} />
      <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
       <Stack.Screen name="AvatarScreen" component={AvatarScreen} options={{headerShown: false}}/>
      <Stack.Screen name="AddUserPlant" component={AddUserPlant} />
       <Stack.Screen name="OrderReviewScreen" component={OrderReview} />
       
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
    
     
      
        <Stack.Screen name="PlantTaskScreen" component={WelcomeScreen} />
    
       
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      
        <Stack.Screen name="MainScreen" component={MainPage} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="PlantProductScreen" component={PlantDetails} />
        
       
    
   
   
    
    <Stack.Screen name="SellPlantScreen" component={SellPlantScreen} />
    
   
   
    <Stack.Screen name="UserPlants" component={MyPlantsScreen} />
    
    <Stack.Screen name="PlantRoutineScreen" component={PlantRoutineScreen} />
       
                 


    </Stack.Navigator>
);





export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const spriteImages = [
    require('../assets/sprites/watering-can.png'),
    require('../assets/sprites/vine.png'),
    // more images here
  ];
  
  useEffect(() => {
    const preloadImages = async () => {
      const preloadPromises = spriteImages.map((image) =>
        Image.prefetch(Image.resolveAssetSource(image).uri)
      );
      await Promise.all(preloadPromises);
      setImagesLoaded(true);
    };
  
    if (loaded) {
      preloadImages();
    }
  }, [loaded]);
  
  useEffect(() => {
    if (loaded && imagesLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, imagesLoaded]);
  
  if (!loaded || !imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    
    <StripeProvider publishableKey="pk_test_51RKsOzQ5mEHaieFKm3UkGd4JTep1chv6rbvCAQS4Hrwu07uEW4RunSbhfh7KjnfOls3TEzOW5K8DajiN2NmFO6Tx00354EHFAe">

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <MainStackNavigator />
      <StatusBar style="auto" />
    </ThemeProvider>
    </PersistGate>
    </Provider>
     </StripeProvider>
   
  );
}


