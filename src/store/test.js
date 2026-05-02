import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './authSlice';

export const TestComponent = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user || {});  // Safely handle undefined state

  useEffect(() => {
   

   

   
    setTimeout(() => {
     
    }, 500); 
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Redux State Test</Text>
      <Text>User: {auth?.user ? auth.user.name : 'None'}</Text>
    </View>
  );
};
