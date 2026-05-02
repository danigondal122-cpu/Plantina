import React, { useEffect } from 'react';
import { View, Button, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function LocalNotifyScreen() {
  useEffect(() => {
    // Create channel for Android 8.0+
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', 
        channelName: 'Default Channel', 
        channelDescription: 'A channel for push notifications',
        soundName: 'default', 
        importance: 4, 
        vibrate: true, 
      },
      (created) => {
        if (created) {
          
        } else {
        
        }
      }
    );

    
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        .then((result) => {
          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission denied', 'You need to grant notification permissions.');
          }
        });
    }
  
  }, []);

  const handleSchedule = () => {
   
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel-id',
      message: '⏰ This is your 5-minute reminder!',
      date: new Date(Date.now() + 0.1 * 60 * 1000), 
      allowWhileIdle: true,
    });

    Alert.alert('Notification scheduled', 'Will trigger in 5 minutes.');
  };


}
