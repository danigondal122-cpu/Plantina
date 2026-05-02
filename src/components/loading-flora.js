import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, Easing } from 'react-native';

const LoadingScreen = () => {
  
  const rotation = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
    const rotateImage = () => {
      rotation.setValue(0); 
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1200, 
          easing: Easing.linear, 
          useNativeDriver: true,
        })
      ).start();
    };

    rotateImage();
  }, [rotation]);

  
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Gray background overlay */}
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/loading.png')} 
          style={styles.image}
        />
      </Animated.View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top:0,
    bottom:0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width:'100%',
    height:'100vh',
    zIndex:99,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
   
    height:'100vh',
    zIndex: 1,
  },
  imageContainer: {
    zIndex: 2, 
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
    zIndex: 2, 
  },
});

export default LoadingScreen;
