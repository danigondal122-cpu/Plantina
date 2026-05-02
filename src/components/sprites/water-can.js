import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteSheet from '../../classes/rn-sprite-sheet';

const WaterCan = ({ initialized, trigerWatering, bothFieldsFilled }) => {
  const spriteRef = useRef(null);

  useEffect(() => {
    if (!initialized || !trigerWatering || !spriteRef.current) return;

    if (bothFieldsFilled) {
      spriteRef.current.play({
        type: 'still',
        fps: 12,
        loop: false,
      });
    } else {
      spriteRef.current.play({
        type: 'water',
        fps: 10,
        loop: false,
      });
      setTimeout(()=>{
        spriteRef.current.play({
          type: 'looping',
          fps: 8,
          loop: true,
        });

      },1000)
      
    }
  }, [initialized, trigerWatering, bothFieldsFilled]);

  return (
    <View style={styles.container}>
      <SpriteSheet
        ref={spriteRef}
        source={require('../../../assets/sprites/watering-can.png')}
        columns={5}
        rows={5}
        width={200}
        animations={{
          water: [0, 1, 2, 3, 4, 5],
          looping: [6, 7],
          still: [8],
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
