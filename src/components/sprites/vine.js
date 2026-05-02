import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteSheet from '../../classes/rn-sprite-sheet';

const WaterCan = ({leaveFall,inputField}) => {
  const spriteRef = useRef(null);

  useEffect(() => {
    if (!leaveFall || !spriteRef.current) return;

    if (leaveFall) {
      spriteRef.current.play({
        type: 'still',
        fps: 12,
        loop: false,
      });
    } 
    if(inputField){
      spriteRef.current.play({
        type: 'leaf_fall_2',
        fps: 12,
        loop: false,
      });
    }
  }, [leaveFall,inputField]);

  return (
    <View style={styles.container}>
      <SpriteSheet
        ref={spriteRef}
        source={require('../../../assets/sprites/vine.png')}
        columns={2}
        rows={2}
        width={180}
        animations={{
          still: [ 1],
          leaf_fall_2: [1,2],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WaterCan;
