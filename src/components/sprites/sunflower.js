import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteSheet from '../../classes/rn-sprite-sheet';

const Sunflower = ({isSelected}) => {
  const spriteRef = useRef(null);

  useEffect(() => {
  

   
  }, []);

  useEffect(()=>{
    if (!spriteRef.current) return;

   
      if(isSelected==='sunflower'){
        spriteRef.current.play({
            type: 'selected',
            fps: 6,
            loop: true,
          });
      }else{
        spriteRef.current.play({
            type: 'motion',
            fps: 4,
            loop: true,
          });

      }

  },[isSelected])

  return (
    <View style={styles.container}>
      <SpriteSheet
        ref={spriteRef}
        source={require('../../../assets/sprites/sunflower.png')}
        columns={10}
        rows={10}
        width={130}
     
        animations={{
          motion: [ 1,2,3,4,5,6],
          selected: [ 11,12,13,14,15],
         
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

export default Sunflower;
