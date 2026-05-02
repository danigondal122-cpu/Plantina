import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { getOrdersByStatus } from '../config/services/order'; 
import { useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';




function OrderCard({ title, id, partner, schedule, active, order,navigation }) {


  return (
    <TouchableOpacity
      onPress={() => {
        if (order?.status === 'pending') {
          navigation.navigate('OrderReviewScreen', { orderId: order?.id });
        }
      }}
    >
      <View className={`rounded-xl p-4 mb-4 ${active ? 'bg-indigo-100' : 'bg-white'} shadow`}>
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold">{title}</Text>
          <Text className="text-xs text-gray-400"># {order?.id}</Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="text-xs text-gray-400">Assigned</Text>
            <Text className="text-sm text-gray-700">{partner}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400">Total</Text>
            <Text className="text-sm text-gray-700">{order?.totalPrice}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


export default function App({navigation}) {
  const [tab, setTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const user = useSelector((state)=>state.auth.user);  

  const tabs = ['pending', 'completed'];

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrdersByStatus(user.uid, tab);
      setOrders(fetchedOrders);
    };
    fetchOrders();
  }, [tab, user]); 

  return (
    <View className="flex-1 bg-white pt-28 px-4 pt-10">
      <Text className="text-2xl font-bold mb-4">My Orders</Text>

      {/* Tabs */}
      <View className="flex-row mb-6">
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`px-4 py-2 rounded-full mr-2 ${
              tab === t ? 'bg-indigo-500' : 'bg-gray-100'
            }`}
          >
            <Text className={`${tab === t ? 'text-white' : 'text-gray-600'} font-medium`}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order Cards */}
      <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
        {orders.map((order, index) => (
          <OrderCard
            key={index}
            order={order}
            navigation={navigation}
            active={order.title === 'Kitchen Cleaning'}
          />
        ))}
      </ScrollView>

       <View className="flex-row z-[999] justify-around items-center py-4 bg-white">
        <FontAwesome onPress={()=>{ navigation.navigate("MainScreen");  }} name="home" size={24} color="black" />
        <FontAwesome  onPress={()=>{ navigation.navigate("UserPlants");  }} name="heart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("CartScreen");  }}  name="shopping-cart" size={24} color="gray" />
        <FontAwesome onPress={()=>{ navigation.navigate("ProfileScreen");  }}  name="user" size={24} color="gray" />
      </View>
    </View>
  );
}
