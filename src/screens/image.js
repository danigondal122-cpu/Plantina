import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({navigation}) => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant access to your media library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Pick and Show an Image</Text>

      <Button title="Select Image" onPress={pickImage} />
      <Button title="Move" onPress={()=>navigation.navigate('WelcomeScreen')} />

      {imageUri && (
        <View style={{ marginTop: 20 }}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
          <Text style={{ marginTop: 10 }}>Image selected from phone!</Text>
        </View>
      )}
    </View>
  );
};

export default ImagePickerComponent;
