
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

/**
 * Schedules a local notification for a given time and weekday.
 * @param {number} hours - Target hour (0-23)
 * @param {number} minutes - Target minute (0-59)
 * @param {number} dayIndex - Target weekday (0=Sun, ..., 6=Sat)
 * @param {string} message - Notification message
 */
export const scheduleNotification = async (hours, minutes, dayIndex, message) => {
 
  PushNotification.createChannel(
    {
      channelId: 'default-channel-id',
      channelName: 'Default Channel',
      channelDescription: 'A channel for weekly reminders',
      soundName: 'default',
      importance: 4,
      playSound: true,  
      vibrate: true,
    },
    (created) => {
     
    }
  );

 
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission denied', 'Notification permission is required.');
      return;
    }
  }

  const now = new Date();
  const target = new Date(now);
  target.setHours(hours);
  target.setMinutes(minutes);
  target.setSeconds(0);
  target.setMilliseconds(0);

  const todayIndex = now.getDay();
  let dayDiff = dayIndex - todayIndex;

 
  if (dayDiff < 0 || (dayDiff === 0 && target <= now)) {
    dayDiff += 7;
  }


  target.setDate(now.getDate() + dayDiff);



  PushNotification.localNotificationSchedule({
    channelId: 'default-channel-id',
    title: 'Weekly Reminder',
    message: message,
    date: target,
    allowWhileIdle: true,
    repeatType: 'week',
    soundName: 'default',
    importance: 4,
    playSound: true,  
    vibrate: true,
  });

  Alert.alert('Notification Scheduled', `Next reminder: ${target.toLocaleString()}`);


 

};
