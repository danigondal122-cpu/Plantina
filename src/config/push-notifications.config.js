import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
   
  },
  popInitialNotification: true,
  requestPermissions: true,
});
