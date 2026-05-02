import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';



export default function PlantTaskItem({ plant, amount, done }) {
  const [checked, setChecked] = useState(done);

  return (
    <TouchableOpacity
  onPress={() => setChecked(!checked)}
  className={'flex-row relative items-center justify-between rounded-xl px-4  mb-6  bg-white'}
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }}

>

<View className={`w-6 h-6 border-blue-600 rounded-full border-2 ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
        {checked && (
            <FontAwesome name="check-circle" size={22} color="white" />
          )}
        </View> 

      <View className="flex-row items-center space-x-3">
       
        <View className='flex-col items-center'>
          <Text className="font-semibold text-md text-base">{plant}</Text>
          <Text className="text-gray-500 text-sm">{amount}</Text>
        </View>
      </View>
      <Image source={require('../../assets/images/plants/vase-0.png')} className="w-24 h-24 relative top-2" />
    </TouchableOpacity>
  );
}
