import { View, Text, ScrollView } from 'react-native';
import PlantTaskItem from '../components/PlantTaskItem';


export default function HomeScreen() {
  return (
    <ScrollView className="bg-gray-50 px-5 py-6 mt-12">
        <View className='flex items-center mb-12'>
      <Text className="text-xl font-medium text-gray-700 mb-1">Hello, <Text className="font-bold">Melissa!</Text></Text>
      <Text className="text-sm w-[80%] text-center text-gray-500 mb-5">Complete your today’s tasks & keep your plants alive</Text>
      </View>
      <Text className="font-semibold text-lg text-gray-700 mb-2">Water</Text>
      <View>
      <PlantTaskItem plant="Monstera Deliciosa" amount="500 ml" done={false} />
      <PlantTaskItem plant="Alocacia" amount="250 ml" done={true} />
      <PlantTaskItem plant="Yucca" amount="500 ml" done={false} />
      </View>

     
    </ScrollView>
  );
}
