import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const LeafFall = ({ leaveFall,vinePosition }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (leaveFall) {
     
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height - 200,
            duration: 4000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(rotate, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            { iterations: 2 }
          )
        ]).start(() => {
          translateY.setValue(-100); // reset
          rotate.setValue(0);
        });
     
    }
  }, [leaveFall]);

  if (!leaveFall) return null;

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={require('../../../assets/sprites/vine-leave.png')}
      style={[
        styles.leaf,
        {
          transform: [
            { translateY },
            { rotate: spin },
          ],
        },
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  leaf: {
    position: 'absolute',
    width: 60,
    height: 60,
    top: 220,
    left: width / 2 - 110,
    zIndex: 10,
  },
});

export default LeafFall;
