import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteSheet from '../../classes/rn-sprite-sheet';

const Dandelion = ({ isSelected, width }) => {
  const spriteRef = useRef(null);
  const lastPlayedRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);
  const animationLoopRef = useRef(false);

  const animationConfig = {
    left: {
      frames: [1],
      loops: 1,
      fps: 4,
      delayAfter: 500,
    },
    right: {
      frames: [2],
      loops: 1,
      fps: 4,
      delayAfter: 500,
    },
    blink: {
      frames: [3, 4, 5, 3],
      loops: 4,
      fps: 6,
      delayAfter: 200,
    },
    glow: {
      frames: [11, 12, 13, 14],
      loops: 0,
      fps: 6,
      delayAfter: 0,
    },
  };

  const getNextAnimationName = () => {
    const names = Object.keys(animationConfig).filter((name) => name !== 'glow');
    const filtered = names.filter((name) => name !== lastPlayedRef.current);
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const playRandomAnimation = async () => {
    if (!spriteRef.current || !animationLoopRef.current) return;

    const name = getNextAnimationName();
    lastPlayedRef.current = name;

    const config = animationConfig[name];
    const frameCount = config.frames.length;
    const duration = (frameCount / config.fps) * 1000;

    const playOnce = () =>
      new Promise((resolve) => {
        spriteRef.current.play({
          type: name,
          fps: config.fps,
          loop: false,
          onFinish: resolve,
        });

        // Fallback in case onFinish doesn't fire
        fallbackTimeoutRef.current = setTimeout(resolve, duration + 100);
      });

    const loopCount = name === 'blink'
      ? Math.floor(Math.random() * 4) + 1
      : (config.loops || 1);

    for (let i = 0; i < loopCount; i++) {
      if (!animationLoopRef.current) break;
      await playOnce();
      await new Promise((r) => setTimeout(r, config.delayAfter));
    }

    if (animationLoopRef.current) {
      playRandomAnimation(); // Continue loop
    }
  };

  useEffect(() => {
    animationLoopRef.current = isSelected !== 'dandelion';

    if (isSelected === 'dandelion') {
      if (spriteRef.current) {
        spriteRef.current.play({
          type: 'glow',
          fps: animationConfig.glow.fps,
          loop: true,
        });
      }
    } else {
      const startTimeout = setTimeout(() => {
        playRandomAnimation();
      }, 1000);

      return () => {
        clearTimeout(startTimeout);
        animationLoopRef.current = false;
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
        }
      };
    }

    return () => {
      animationLoopRef.current = false;
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, [isSelected]);

  return (
    <View style={styles.container}>
      <SpriteSheet
        ref={spriteRef}
        source={require('../../../assets/sprites/dandelion.png')}
        columns={10}
        rows={10}
        width={width || 130}
        animations={{
          left: animationConfig.left.frames,
          right: animationConfig.right.frames,
          blink: animationConfig.blink.frames,
          glow: animationConfig.glow.frames,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dandelion;
